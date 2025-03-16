package controllers

import (
	"net/http"
	"strconv"

	"social_network_backend/models"
	"social_network_backend/services"

	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
	comment.UserID = uint(parsedUserID)
	newComment, err := services.CreateComment(comment)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, newComment)
}

func GetComments(c *gin.Context) {
	postIDParam := c.Query("post_id")
	if postIDParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Il parametro post_id è obbligatorio"})
		return
	}
	postID, err := strconv.Atoi(postIDParam)
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "post_id non valido"})
		return
	}
	comments, err := services.GetCommentsByPost(uint(postID))
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comments)
}
