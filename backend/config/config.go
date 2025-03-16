package config

import (
	"fmt"
	"log"
	"os"

	"social_network_backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitConfig() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println(err)
	}
}

func InitDB() {
	dbUser := "root"
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Impossibile connettersi al database: ", err)
	}
	DB = database

	err = DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.Follow{}, &models.Notification{}, &models.Like{})
	if err != nil {
		log.Fatal("Errore durante la migrazione: ", err)
	}

	log.Println("Connessione al database avvenuta con successo")
}
