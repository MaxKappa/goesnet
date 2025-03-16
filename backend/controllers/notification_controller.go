package controllers

import (
	"net/http"
	"strconv"

	"social_network_backend/services"

	"github.com/gin-gonic/gin"
)

func GetNotifications(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utente non autenticato"})
		return
	}
	idInt, err := strconv.Atoi(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID utente non valido"})
		return
	}

	notifications, err := services.GetNotifications(uint(idInt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func MarkNotificationAsRead(c *gin.Context) {
	notifID := c.Param("id")
	idInt, err := strconv.Atoi(notifID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID non valido"})
		return
	}

	err = services.MarkNotificationAsRead(uint(idInt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Notifica segnata come letta"})
}
