package controllers

import (
	"monetizeai-backend/database"
	"monetizeai-backend/models"
	"monetizeai-backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetVideos(c *gin.Context) {
	var videos []models.Video
	database.DB.Find(&videos)
	c.JSON(http.StatusOK, gin.H{"videos": videos})
}

func CompleteVideo(c *gin.Context) {
	phone := c.Query("phone")
	videoID, _ := strconv.Atoi(c.Param("id"))

	var user models.User
	if err := database.DB.Where("phone = ?", phone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var progress models.Progress
	err := database.DB.Where("user_id = ? AND video_id = ?", user.ID, videoID).First(&progress).Error
	if err != nil {
		progress = models.Progress{UserID: user.ID, VideoID: uint(videoID), Unlocked: true, Completed: true}
		database.DB.Create(&progress)
	} else {
		progress.Completed = true
		database.DB.Save(&progress)
	}

	// Send SMS for video completion
	smsParams := map[string]string{
		"name":        user.FirstName,
		"code":        c.Param("id"),
		"phonenumber": user.Phone,
	}
	services.SendSMS(user.Phone, smsParams, "video_complete")

	c.JSON(http.StatusOK, gin.H{"message": "Video completed"})
}

func UnlockVideo(c *gin.Context) {
	phone := c.Query("phone")
	videoID, _ := strconv.Atoi(c.Param("id"))

	var user models.User
	if err := database.DB.Where("phone = ?", phone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var progress models.Progress
	err := database.DB.Where("user_id = ? AND video_id = ?", user.ID, videoID).First(&progress).Error
	if err != nil {
		progress = models.Progress{UserID: user.ID, VideoID: uint(videoID), Unlocked: true}
		database.DB.Create(&progress)
	} else {
		progress.Unlocked = true
		database.DB.Save(&progress)
	}

	// Send SMS for unlocking video
	smsParams := map[string]string{
		"name":        user.FirstName,
		"code":        c.Param("id"),
		"phonenumber": user.Phone,
	}
	services.SendSMS(user.Phone, smsParams, "video_unlock")

	c.JSON(http.StatusOK, gin.H{"message": "Video unlocked"})
}

func GetUserProgress(c *gin.Context) {
	phone := c.Query("phone")
	var user models.User
	if err := database.DB.Where("phone = ?", phone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var progresses []models.Progress
	database.DB.Where("user_id = ?", user.ID).Find(&progresses)

	// Calculate total points, level, and progress
	var totalPoints int
	var completedCount int
	var totalVideos int64
	database.DB.Model(&models.Video{}).Count(&totalVideos)

	for _, p := range progresses {
		if p.Completed {
			var video models.Video
			database.DB.First(&video, p.VideoID)
			totalPoints += video.Points
			completedCount++
		}
	}

	progressPercent := 0
	if totalVideos > 0 {
		progressPercent = int(float64(completedCount) / float64(totalVideos) * 100)
	}
	level := totalPoints/200 + 1

	c.JSON(http.StatusOK, gin.H{
		"progress":         progresses,
		"total_points":     totalPoints,
		"level":            level,
		"progress_percent": progressPercent,
		"completed_videos": completedCount,
		"total_videos":     totalVideos,
	})
}
