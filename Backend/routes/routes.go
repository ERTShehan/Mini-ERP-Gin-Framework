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

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/customers", controllers.GetCustomers)
			protected.POST("/customers", controllers.CreateCustomer)
			protected.PUT("/customers/:id", controllers.UpdateCustomer)
			protected.DELETE("/customers/:id", controllers.DeleteCustomer)

		}
	}
}
