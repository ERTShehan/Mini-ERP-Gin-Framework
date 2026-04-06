package main

import (
	"mini-erp/config"
	"mini-erp/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()
	r := gin.Default()
	routes.SetupRoutes(r)
	r.Run(":8080")
}
