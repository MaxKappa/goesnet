package controllers

import (
	"net/http"

	"social_network_backend/services"

	"github.com/gin-gonic/gin"
)

func FollowUser(c *gin.Context) {
	targetUserID := c.Param("id")

	followerID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utente non autenticato"})
		return
	}

	err := services.FollowUser(followerID.(string), targetUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Seguito con successo"})
}

func UnfollowUser(c *gin.Context) {
	targetUserID := c.Param("id")
	followerID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utente non autenticato"})
		return
	}
	err := services.UnfollowUser(followerID.(string), targetUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Non segui più l'utente"})
}

func GetFollowers(c *gin.Context) {
	userID := c.Param("id")
	users, err := services.GetFollowers(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetFollowing(c *gin.Context) {
	userID := c.Param("id")
	users, err := services.GetFollowing(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
