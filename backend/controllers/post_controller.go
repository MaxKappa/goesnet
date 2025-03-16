package controllers

import (
	"net/http"
	"path/filepath"
	"strconv"

	"social_network_backend/models"
	"social_network_backend/services"

	"github.com/gin-gonic/gin"
)

func CreatePost(c *gin.Context) {
	content := c.PostForm("content")
	if content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Contenuto obbligatorio"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utente non autenticato"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore nel recuperare l'ID utente"})
		return
	}
	parsedUserID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore nella conversione dell'ID utente"})
		return
	}

	post := models.Post{
		Content: content,
		UserID:  uint(parsedUserID),
	}
	file, err := c.FormFile("photo")
	if err == nil {
		openedFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossibile aprire il file"})
			return
		}
		defer openedFile.Close()

		ext := filepath.Ext(file.Filename)
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Formato immagine non supportato"})
			return
		}
		photoURL, err := services.UploadFileToS3(openedFile, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore durante l'upload su S3"})
			return
		}
		post.ImageURL = photoURL
	}

	newPost, err := services.CreatePost(post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, newPost)
}

func GetPosts(c *gin.Context) {
	posts, err := services.GetAllPosts()
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func GetPost(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Dettagli post (da implementare)"})
}

func GetUserPosts(c *gin.Context) {
	userIDParam := c.Param("id")
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utente non valido"})
		return
	}
	posts, err := services.GetPostsByUser(uint(userID))
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, posts)
}
