package main

import (
	"log"
	"social_network_backend/config"
	"social_network_backend/middleware"
	"social_network_backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitConfig()
	config.InitDB()

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	//router.Use(middleware.ErrorHandlingMiddleware())

	routes.SetupRoutes(router)

	log.Println("Server in esecuzione sulla porta 8080")
	router.Run(":8080")
}
