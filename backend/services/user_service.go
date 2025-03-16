package services

import (
	"fmt"
	"os"
	"social_network_backend/config"
	"social_network_backend/models"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	_ "gorm.io/driver/mysql"
)

func CreateUser(user models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	err = config.DB.Create(&user).Error
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && strings.Contains(err.Error(), "email") {
			return fmt.Errorf("email già presente")
		}
		return err
	}
	return nil
}

func AuthenticateUser(email, password string) (models.User, error) {
	var user models.User
	err := config.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return user, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return user, err
	}
	return user, nil
}

func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":   strconv.Itoa(int(user.ID)),
		"username": user.Username,
		"email":    user.Email,
		"exp":      time.Now().Add(72 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(getJWTSecret()))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func getJWTSecret() string {
	return os.Getenv("JWT_SECRET")
}

func GetUserByID(id string, user *models.User) error {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return err
	}
	return config.DB.First(user, idInt).Error
}

func UpdateUser(id string, updateData models.User) (models.User, error) {
	var user models.User
	err := config.DB.First(&user, id).Error
	if err != nil {
		return user, err
	}

	if updateData.Username != "" {
		user.Username = updateData.Username
	}
	if updateData.Email != "" {
		user.Email = updateData.Email
	}
	if updateData.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updateData.Password), bcrypt.DefaultCost)
		if err != nil {
			return user, err
		}
		user.Password = string(hashedPassword)
	}
	if !updateData.DateOfBirth.IsZero() {
		user.DateOfBirth = updateData.DateOfBirth
	}
	if updateData.ProfilePicture != "" {
		user.ProfilePicture = updateData.ProfilePicture
	}

	err = config.DB.Save(&user).Error
	if err != nil {
		return user, err
	}
	return user, nil
}
