package routes

import (
	"monetizeai-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.POST("/register", controllers.RegisterUser)
		api.GET("/videos", controllers.GetVideos)
		api.POST("/videos/:id/complete", controllers.CompleteVideo)
		api.POST("/videos/:id/unlock", controllers.UnlockVideo)
		api.GET("/progress", controllers.GetUserProgress)
		api.GET("/users/csv", controllers.GetUsersCSV)
	}
}
