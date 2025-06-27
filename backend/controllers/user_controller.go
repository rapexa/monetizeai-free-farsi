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

	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists or DB error"})
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

	c.JSON(http.StatusOK, gin.H{"user": user})
}
