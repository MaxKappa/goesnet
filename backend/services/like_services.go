package services

import (
	"errors"
	"fmt"
	"social_network_backend/config"
	"social_network_backend/models"

	"gorm.io/gorm"
)

func LikePost(postID uint, userID uint) error {
	var existing models.Like
	if err := config.DB.Where("post_id = ? AND user_id = ?", postID, userID).First(&existing).Error; err == nil {
		return errors.New("post già liked")
	}
	like := models.Like{
		PostID: postID,
		UserID: userID,
	}
	if err := config.DB.Create(&like).Error; err != nil {
		return err
	}
	var post models.Post
	if err := config.DB.First(&post, postID).Error; err == nil {
		if post.UserID != userID {
			var liker models.User
			if err := config.DB.First(&liker, userID).Error; err == nil {
				dataPayload := fmt.Sprintf(`{"liker_id": %d, "username": "%s"}`, liker.ID, liker.Username)
				if err := CreateNotification(post.UserID, "post_liked", dataPayload); err != nil {
					fmt.Println("Errore nella creazione della notifica:", err)
				}
			} else {
				fmt.Println("Errore nel recuperare i dati del liker:", err)
			}
		}
	}

	return nil
}

func UnlikePost(postID uint, userID uint) error {
	return config.DB.Where("post_id = ? AND user_id = ?", postID, userID).
		Delete(&models.Like{}).Error
}

func GetLikesCount(postID uint) (int64, error) {
	var count int64
	err := config.DB.Model(&models.Like{}).Where("post_id = ?", postID).Count(&count).Error
	return count, err
}

func IsPostLiked(postID uint, userID uint) (bool, error) {
	var like models.Like
	err := config.DB.Where("post_id = ? AND user_id = ?", postID, userID).First(&like).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}
