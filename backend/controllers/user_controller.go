package controllers

import (
	"monetizeai-backend/database"
	"monetizeai-backend/models"
	"monetizeai-backend/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("phone = ?", req.Phone).First(&existingUser).Error; err == nil {
		// User exists, return existing user data
		c.JSON(http.StatusOK, gin.H{
			"user":     existingUser,
			"message":  "Welcome back! You're already registered.",
			"existing": true,
		})
		return
	}

	// Create new user
	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Database error occurred"})
		return
	}

	// Send welcome SMS with only 'name' param
	smsParams := map[string]string{
		"name": user.FirstName,
	}
	services.SendSMS(user.Phone, smsParams, "registration")

	// Schedule follow-up SMS jobs for step 1
	database.ScheduleSMS(user.ID, "followup1_3h", time.Now().Add(3*time.Hour))
	database.ScheduleSMS(user.ID, "followup1_15h", time.Now().Add(15*time.Hour))

	c.JSON(http.StatusOK, gin.H{
		"user":     user,
		"message":  "Registration successful!",
		"existing": false,
	})
}
