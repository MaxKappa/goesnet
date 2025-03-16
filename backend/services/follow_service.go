package services

import (
	"fmt"
	"social_network_backend/config"
	"social_network_backend/models"
	"strconv"
	"time"
)

func FollowUser(followerIDStr, followedIDStr string) error {
	followerID, err := strconv.Atoi(followerIDStr)
	if err != nil {
		return err
	}
	followedID, err := strconv.Atoi(followedIDStr)
	if err != nil {
		return err
	}
	var existing models.Follow
	if err := config.DB.Where("follower_id = ? AND followed_id = ?", followerID, followedID).
		First(&existing).Error; err == nil {
		return fmt.Errorf("utente %d segue già l'utente %d", followerID, followedID)
	}
	follow := models.Follow{
		FollowerID: uint(followerID),
		FollowedID: uint(followedID),
		CreatedAt:  time.Now(),
	}
	if err := config.DB.Create(&follow).Error; err != nil {
		return err
	}
	var followerUser models.User
	if err := config.DB.First(&followerUser, followerID).Error; err != nil {
		fmt.Println("Errore nel recupero dell'utente follower:", err)
	} else {
		dataPayload := fmt.Sprintf(`{"follower_id": %d, "username": "%s"}`, followerUser.ID, followerUser.Username)
		if err := CreateNotification(uint(followedID), "new_follower", dataPayload); err != nil {
			fmt.Println("Errore durante la creazione della notifica:", err)
		}
	}
	return nil
}

func UnfollowUser(followerIDStr, followedIDStr string) error {
	followerID, err := strconv.Atoi(followerIDStr)
	if err != nil {
		return err
	}
	followedID, err := strconv.Atoi(followedIDStr)
	if err != nil {
		return err
	}
	return config.DB.Where("follower_id = ? AND followed_id = ?", followerID, followedID).
		Delete(&models.Follow{}).Error
}

func GetFollowers(userIDStr string) ([]models.User, error) {
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, err
	}
	var follows []models.Follow
	err = config.DB.Where("followed_id = ?", userID).Find(&follows).Error
	if err != nil {
		return nil, err
	}
	var followers []models.User
	for _, f := range follows {
		var user models.User
		if err = config.DB.First(&user, f.FollowerID).Error; err == nil {
			followers = append(followers, user)
		}
	}
	return followers, nil
}

func GetFollowing(userIDStr string) ([]models.User, error) {
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, err
	}
	var follows []models.Follow
	err = config.DB.Where("follower_id = ?", userID).Find(&follows).Error
	if err != nil {
		return nil, err
	}
	var following []models.User
	for _, f := range follows {
		var user models.User
		if err = config.DB.First(&user, f.FollowedID).Error; err == nil {
			following = append(following, user)
		}
	}
	return following, nil
}
