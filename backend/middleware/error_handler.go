package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		if len(c.Errors) > 0 {
			for _, e := range c.Errors {
				log.Println(e.Err)
			}
			if !c.Writer.Written() {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore interno del server"})
			}
		}
	}
}
