package main

import (
	"monetizeai-backend/config"
	"monetizeai-backend/database"
	"monetizeai-backend/models"
	"monetizeai-backend/routes"
	"monetizeai-backend/services"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func startSMSScheduler() {
	go func() {
		for {
			jobs := database.GetDueScheduledSMS()
			for _, job := range jobs {
				var user models.User
				database.DB.First(&user, job.UserID)
				smsParams := map[string]string{"name": user.FirstName}
				services.SendSMS(user.Phone, smsParams, job.Pattern)
				database.MarkSMSSent(job.ID)
			}
			time.Sleep(1 * time.Minute)
		}
	}()
}

func extractStepNumber(pattern string) int {
	// Extract step number from pattern like "followup1_3h" -> 1
	if strings.Contains(pattern, "followup") {
		parts := strings.Split(pattern, "followup")
		if len(parts) > 1 {
			stepPart := strings.Split(parts[1], "_")[0]
			if step, err := strconv.Atoi(stepPart); err == nil {
				return step
			}
		}
	}
	return 1
}

func main() {
	config.LoadConfig()
	database.Connect()
	startSMSScheduler()
	r := gin.Default()

	routes.RegisterRoutes(r)

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
