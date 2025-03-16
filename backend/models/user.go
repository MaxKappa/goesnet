package models

import "time"

type User struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Username       string    `json:"username"`
	Email          string    `json:"email" gorm:"unique"`
	Password       string    `json:"password"`
	Bio            string    `json:"bio"`
	DateOfBirth    time.Time `json:"date_of_birth"`
	ProfilePicture string    `json:"profile_picture"`
	Followers      []*User   `gorm:"many2many:user_follows;joinForeignKey:FollowedID;joinReferences:FollowerID"`
	Following      []*User   `gorm:"many2many:user_follows;joinForeignKey:FollowerID;joinReferences:FollowedID"`
}
