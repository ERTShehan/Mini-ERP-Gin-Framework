package main

import (
	"mini-erp/config"
	"mini-erp/routes"
	"mini-erp/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())
	routes.SetupRoutes(r)
	r.Run(":8080")
}
