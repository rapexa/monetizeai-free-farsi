package main

import (
	"monetizeai-backend/routes"
	"monetizeai-backend/database"
	"monetizeai-backend/config"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	database.Connect()
	r := gin.Default()

	routes.RegisterRoutes(r)

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
} 