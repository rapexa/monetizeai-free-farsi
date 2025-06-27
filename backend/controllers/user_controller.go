package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"monetizeai-backend/models"
	"monetizeai-backend/database"
	"monetizeai-backend/services"
)

func RegisterUser(c *gin.Context) {
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists or DB error"})
		return
	}

	// Send welcome SMS with all relevant params
	smsParams := map[string]string{
		"name": user.FirstName,
		"phonenumber": user.Phone,
	}
	services.SendSMS(user.Phone, smsParams, "registration")

	c.JSON(http.StatusOK, gin.H{"user": user})
} 