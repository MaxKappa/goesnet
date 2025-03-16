package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"social_network_backend/config"
	"social_network_backend/models"
	"social_network_backend/services"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	user, err := parseRegistrationForm(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = services.CreateUser(user)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}

func parseRegistrationForm(c *gin.Context) (models.User, error) {
	var user models.User
	username := c.PostForm("username")
	email := c.PostForm("email")
	password := c.PostForm("password")
	bio := c.PostForm("bio")
	dobStr := c.PostForm("dob")

	if username == "" || email == "" || password == "" || dobStr == "" {
		return user, fmt.Errorf("campi obbligatori mancanti")
	}

	dob, err := time.Parse("2006-01-02", dobStr)
	if err != nil {
		return user, fmt.Errorf("formato data non valido, usa YYYY-MM-DD")
	}

	var profilePictureURL string
	file, err := c.FormFile("profile_picture")
	if err == nil {
		openedFile, err := file.Open()
		if err != nil {
			return user, fmt.Errorf("impossibile aprire il file caricato")
		}
		defer openedFile.Close()

		ext := filepath.Ext(file.Filename)
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" {
			return user, fmt.Errorf("formato immagine non supportato")
		}

		profilePictureURL, err = services.UploadFileToS3(openedFile, file)
		if err != nil {
			return user, fmt.Errorf("errore durante l'upload su S3: %v", err)
		}
	}

	user = models.User{
		Username:       username,
		Email:          email,
		Password:       password,
		Bio:            bio,
		DateOfBirth:    dob,
		ProfilePicture: profilePictureURL,
	}
	return user, nil
}

func Login(c *gin.Context) {
	var loginData models.User
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := services.AuthenticateUser(loginData.Email, loginData.Password)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenziali non valide"})
		return
	}

	tokenString, err := services.GenerateJWT(user)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore nella generazione del token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	err := services.GetUserByID(id, &user)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Utente non trovato"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var updateData models.User
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updatedUser, err := services.UpdateUser(id, updateData)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}

func GetMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utente non autenticato"})
		return
	}

	var user models.User
	err := services.GetUserByID(userID.(string), &user)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Utente non trovato"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func SearchUsers(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query richiesta"})
		return
	}

	var users []models.User
	err := config.DB.Where("username LIKE ?", "%"+query+"%").Find(&users).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}
