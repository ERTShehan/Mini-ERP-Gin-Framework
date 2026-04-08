package routes

import (
	"mini-erp/controllers"
	"mini-erp/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/login", controllers.Login)
		api.POST("/refresh", controllers.RefreshToken)
		// api.POST("/register", controllers.Register)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/customers", controllers.GetCustomers)
			protected.POST("/customers", controllers.CreateCustomer)
			protected.PUT("/customers/:id", controllers.UpdateCustomer)
			protected.DELETE("/customers/:id", controllers.DeleteCustomer)

			protected.GET("/products", controllers.GetProducts)
			protected.POST("/products", controllers.CreateProduct)
			protected.PUT("/products/:id", controllers.UpdateProduct)
			protected.DELETE("/products/:id", controllers.DeleteProduct)

			protected.GET("/orders", controllers.GetOrders)
			protected.POST("/orders", controllers.CreateOrder)
			protected.PUT("/orders/:id/status", controllers.UpdateOrderStatus)
		}
	}
}
