package services

import (
	"fmt"
	"social_network_backend/config"
	"social_network_backend/models"
)

func CreateComment(comment models.Comment) (models.Comment, error) {
	err := config.DB.Create(&comment).Error
	if err != nil {
		return comment, err
	}
	var post models.Post
	if err := config.DB.First(&post, comment.PostID).Error; err == nil {
		if post.UserID != comment.UserID {
			var commenter models.User
			if err := config.DB.First(&commenter, comment.UserID).Error; err == nil {
				dataPayload := fmt.Sprintf(`{"commenter_id": %d, "username": "%s"}`, commenter.ID, commenter.Username)
				if err := CreateNotification(post.UserID, "comment", dataPayload); err != nil {
					fmt.Println("Errore durante la creazione della notifica:", err)
				}
			} else {
				fmt.Println("Errore nel recuperare i dati del commentatore:", err)
			}
		}
	}

	return comment, nil
}
func GetCommentsByPost(postID uint) ([]models.Comment, error) {
	var comments []models.Comment
	err := config.DB.Preload("User").Where("post_id = ?", postID).Find(&comments).Error
	if err != nil {
		return nil, err
	}
	return comments, nil
}
