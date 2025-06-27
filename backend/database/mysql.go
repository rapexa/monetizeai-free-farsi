package database

import (
	"fmt"
	"log"
	"monetizeai-backend/config"
	"monetizeai-backend/models"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	cfg := config.Config.DB
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Name)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	DB = db

	// Auto-migrate all models
	db.AutoMigrate(&models.User{}, &models.Video{}, &models.Progress{}, &models.ScheduledSMS{})

	// Seed fake data if needed
	seedFakeVideos()
}

func seedFakeVideos() {
	var count int64
	DB.Model(&models.Video{}).Count(&count)
	if count == 0 {
		videos := []models.Video{
			{Title: "آشنایی با هوش مصنوعی و فرصت‌های درآمدزایی", Description: "در این ویدیو یاد می‌گیری چطور AI می‌تونه منبع درآمد باشه", Duration: "15:30", Code: "AI2024", Points: 100},
			{Title: "ساخت اولین سرویس AI با چت بات", Description: "قدم به قدم یک چت بات هوشمند می‌سازیم", Duration: "22:45", Code: "CHAT99", Points: 150},
			{Title: "بازاریابی و فروش سرویس AI", Description: "راهکارهای عملی برای پیدا کردن مشتری", Duration: "18:20", Code: "SELL77", Points: 200},
			{Title: "اتوماسیون و مقیاس‌سازی درآمد", Description: "چطور سیستمت رو اتوماتیک کنی و درآمدت رو چندین برابر کنی", Duration: "25:10", Code: "AUTO55", Points: 250},
		}
		for _, v := range videos {
			DB.Create(&v)
		}
		log.Println("Seeded fake videos.")
	}
}

func ScheduleSMS(userID uint, pattern string, sendAt time.Time) {
	DB.Create(&models.ScheduledSMS{
		UserID:    userID,
		Pattern:   pattern,
		SendAt:    sendAt,
		Sent:      false,
		CreatedAt: time.Now(),
	})
}

func GetDueScheduledSMS() []models.ScheduledSMS {
	var jobs []models.ScheduledSMS
	DB.Where("sent = ? AND send_at <= ?", false, time.Now()).Find(&jobs)
	return jobs
}

func MarkSMSSent(id uint) {
	DB.Model(&models.ScheduledSMS{}).Where("id = ?", id).Update("sent", true)
}

func CancelScheduledSMS(userID uint, pattern string) {
	DB.Model(&models.ScheduledSMS{}).Where("user_id = ? AND pattern = ? AND sent = ?", userID, pattern, false).Update("sent", true)
}

func Cancel15HourFollowup(userID uint, stepNumber int) {
	pattern := fmt.Sprintf("followup%d_15h", stepNumber)
	DB.Model(&models.ScheduledSMS{}).Where("user_id = ? AND pattern = ? AND sent = ?", userID, pattern, false).Update("sent", true)
}
