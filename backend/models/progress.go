package models

type Progress struct {
	ID       uint `gorm:"primaryKey" json:"id"`
	UserID   uint `json:"user_id"`
	VideoID  uint `json:"video_id"`
	Unlocked bool `json:"unlocked"`
	Completed bool `json:"completed"`
} 