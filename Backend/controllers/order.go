package controllers

import (
	"log"
	"mini-erp/config"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type OrderItem struct {
	ID         int     `json:"id"`
	OrderID    int     `json:"order_id"`
	ProductID  int     `json:"product_id"`
	Quantity   int     `json:"quantity"`
	UnitPrice  float64 `json:"unit_price"`
	TotalPrice float64 `json:"total_price"`
}

type Order struct {
	ID          int         `json:"id"`
	CustomerID  int         `json:"customer_id"`
	OrderDate   string      `json:"order_date"`
	TotalAmount float64     `json:"total_amount"`
	Status      string      `json:"status"`
	Items       []OrderItem `json:"items,omitempty"`
}

type OrderItemInput struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type OrderInput struct {
	CustomerID int              `json:"customer_id"`
	Items      []OrderItemInput `json:"items"`
}

func GetOrders(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, customer_id, order_date, total_amount, status FROM orders")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		rows.Scan(&o.ID, &o.CustomerID, &o.OrderDate, &o.TotalAmount, &o.Status)
		orders = append(orders, o)
	}

	if orders == nil {
		orders = []Order{}
	}

	c.JSON(http.StatusOK, orders)
}

func CreateOrder(c *gin.Context) {
	var input OrderInput
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if len(input.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items in order"})
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to handle transaction"})
		return
	}

	var totalAmount float64
	type ItemWithPrice struct {
		ProductID  int
		Quantity   int
		UnitPrice  float64
		TotalPrice float64
	}
	var processedItems []ItemWithPrice

	for _, item := range input.Items {
		var price float64
		var stock int
		err := tx.QueryRow("SELECT price, stock_qty FROM products WHERE id=?", item.ProductID).Scan(&price, &stock)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found or error fetching product: " + strconv.Itoa(item.ProductID)})
			return
		}

		if stock < item.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for product ID: " + strconv.Itoa(item.ProductID)})
			return
		}

		itemTotal := price * float64(item.Quantity)
		totalAmount += itemTotal

		_, err = tx.Exec("UPDATE products SET stock_qty = stock_qty - ? WHERE id=?", item.Quantity, item.ProductID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
			return
		}

		processedItems = append(processedItems, ItemWithPrice{
			ProductID:  item.ProductID,
			Quantity:   item.Quantity,
			UnitPrice:  price,
			TotalPrice: itemTotal,
		})
	}

	orderDate := time.Now().Format("2006-01-02 15:04:05")
	res, err := tx.Exec("INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES (?, ?, ?, 'Pending')",
		input.CustomerID, orderDate, totalAmount)
	if err != nil {
		tx.Rollback()
		log.Println("Error inserting order: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	orderID, _ := res.LastInsertId()

	for _, pItem := range processedItems {
		_, err = tx.Exec("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
			orderID, pItem.ProductID, pItem.Quantity, pItem.UnitPrice, pItem.TotalPrice)
		if err != nil {
			tx.Rollback()
			log.Println("Error inserting order item: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add items to order"})
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction complete error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Order created successfully",
		"order_id":     orderID,
		"total_amount": totalAmount,
	})
}

type OrderStatusInput struct {
	Status string `json:"status"`
}

func UpdateOrderStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input OrderStatusInput
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	var currentStatus string
	err = tx.QueryRow("SELECT status FROM orders WHERE id=?", id).Scan(&currentStatus)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if currentStatus == "Cancel" {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order is already cancelled, status cannot be changed"})
		return
	}

	if input.Status == "Cancel" {
		rows, err := tx.Query("SELECT product_id, quantity FROM order_items WHERE order_id=?", id)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order items"})
			return
		}

		type itemsToRestore struct {
			ProductID int
			Quantity  int
		}
		var restoreList []itemsToRestore
		for rows.Next() {
			var r itemsToRestore
			rows.Scan(&r.ProductID, &r.Quantity)
			restoreList = append(restoreList, r)
		}
		rows.Close() // Close before executing updates in same tx to avoid busy locks in some drivers, though mostly safe here.

		for _, item := range restoreList {
			_, err = tx.Exec("UPDATE products SET stock_qty = stock_qty + ? WHERE id=?", item.Quantity, item.ProductID)
			if err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to restore stock"})
				return
			}
		}
	}

	_, err = tx.Exec("UPDATE orders SET status=? WHERE id=?", input.Status, id)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction complete error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated successfully"})
}
