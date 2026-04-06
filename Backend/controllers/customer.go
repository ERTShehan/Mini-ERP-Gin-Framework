package controllers

import (
	"mini-erp/config"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Customer struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}

func GetCustomers(c *gin.Context) {
	rows, _ := config.DB.Query("SELECT id, name, email, phone, address FROM customers")
	defer rows.Close()
	var customers []Customer
	for rows.Next() {
		var cus Customer
		rows.Scan(&cus.ID, &cus.Name, &cus.Email, &cus.Phone, &cus.Address)
		customers = append(customers, cus)
	}
	c.JSON(http.StatusOK, customers)
}

func CreateCustomer(c *gin.Context) {
	var cus Customer
	c.BindJSON(&cus)
	result, _ := config.DB.Exec("INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
		cus.Name, cus.Email, cus.Phone, cus.Address)
	id, _ := result.LastInsertId()
	cus.ID = int(id)
	c.JSON(http.StatusCreated, cus)
}

func UpdateCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var cus Customer
	c.BindJSON(&cus)
	_, err := config.DB.Exec("UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?",
		cus.Name, cus.Email, cus.Phone, cus.Address, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer updated"})
}

func DeleteCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	config.DB.Exec("DELETE FROM customers WHERE id=?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted"})
}
