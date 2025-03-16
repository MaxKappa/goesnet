package routes

import (
	"social_network_backend/controllers"
	"social_network_backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			auth := v1.Group("/auth")
			{
				auth.POST("/register", controllers.Register)
				auth.POST("/login", controllers.Login)
			}
			protected := v1.Group("/")
			protected.Use(middleware.JWTAuthMiddleware())
			{
				userRoutes(protected)
				postRoutes(protected)
				commentRoutes(protected)
				followRoutes(protected)
				notificationRoutes(protected)
				likeRoutes(protected)

			}
		}
	}
	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"error": "Route non trovata"})
	})
}

func userRoutes(group *gin.RouterGroup) {
	users := group.Group("/users")
	{

		users.GET("/:id", controllers.GetUser)
		users.GET("/:id/posts", controllers.GetUserPosts)
		users.PUT("/:id", controllers.UpdateUser)
		users.GET("/me", controllers.GetMe)
		users.GET("/search", controllers.SearchUsers)
	}
}

func postRoutes(group *gin.RouterGroup) {
	posts := group.Group("/posts")
	{
		posts.POST("", controllers.CreatePost)
		posts.GET("", controllers.GetPosts)
		posts.GET("/:id", controllers.GetPost)
	}
}

func commentRoutes(group *gin.RouterGroup) {
	comments := group.Group("/comments")
	{
		comments.POST("", controllers.CreateComment)
		comments.GET("", controllers.GetComments)
	}
}

func followRoutes(group *gin.RouterGroup) {
	follows := group.Group("/follows")
	{
		follows.POST("/:id/follow", controllers.FollowUser)
		follows.POST("/:id/unfollow", controllers.UnfollowUser)
		follows.GET("/:id/followers", controllers.GetFollowers)
		follows.GET("/:id/following", controllers.GetFollowing)
	}
}

func notificationRoutes(group *gin.RouterGroup) {
	notifications := group.Group("/notifications")
	{
		notifications.GET("", controllers.GetNotifications)
		notifications.PATCH("/:id/mark-as-read", controllers.MarkNotificationAsRead)
	}
}

func likeRoutes(group *gin.RouterGroup) {
	likes := group.Group("/likes")
	{
		likes.POST("/:id", controllers.LikePost)
		likes.DELETE("/:id", controllers.UnlikePost)
		likes.GET("/:id", controllers.GetLikesCount)
		likes.GET("/:id/me", controllers.IsPostLiked)
	}
}
