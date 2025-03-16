package services

import (
	"social_network_backend/config"
	"social_network_backend/models"
	"time"
)

func CreateNotification(userID uint, notifType string, data string) error {
	notification := models.Notification{
		UserID:    userID,
		Type:      notifType,
		Data:      data,
		Read:      false,
		CreatedAt: time.Now(),
	}
	return config.DB.Create(&notification).Error
}

func GetNotifications(userID uint) ([]models.Notification, error) {
	var notifications []models.Notification
	err := config.DB.
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&notifications).Error
	return notifications, err
}

func MarkNotificationAsRead(notificationID uint) error {
	return config.DB.
		Model(&models.Notification{}).
		Where("id = ?", notificationID).
		Update("read", true).Error
}
