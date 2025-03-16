package models

import "time"

type Like struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	PostID    uint      `json:"post_id"`
	UserID    uint      `json:"user_id"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func (Like) TableName() string {
	return "likes"
}
