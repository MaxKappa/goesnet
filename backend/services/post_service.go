package services

import (
	"social_network_backend/config"
	"social_network_backend/models"
)

func CreatePost(post models.Post) (models.Post, error) {
	err := config.DB.Create(&post).Error
	if err != nil {
		return post, err
	}
	return post, nil
}
func GetAllPosts() ([]models.Post, error) {
	var posts []models.Post
	err := config.DB.
		Preload("User").
		Order("created_at desc").
		Find(&posts).Error
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func GetPostsByUser(userID uint) ([]models.Post, error) {
	var posts []models.Post
	err := config.DB.Preload("User").Where("user_id = ?", userID).Find(&posts).Error
	if err != nil {
		return nil, err
	}
	return posts, nil
}
