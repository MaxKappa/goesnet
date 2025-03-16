package models

import "time"

type Follow struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	FollowerID uint      `json:"follower_id"`
	FollowedID uint      `json:"followed_id"`
	CreatedAt  time.Time `json:"created_at"`
}

func (Follow) TableName() string {
	return "follows"
}
