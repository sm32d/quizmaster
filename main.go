package main

import (
	"context"
	"log"
	"quizmaster/app/routes"
	"quizmaster/database"
	"strings"

	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		// Handle the error
	}

	uri := os.Getenv("ALLOWED_ORIGINS")

	client, err := database.InitMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: uri,
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH",
	}))

	app.Use(func(c *fiber.Ctx) error {
		allowedOrigins := uri
		origin := c.BaseURL()

		// Trim spaces and split the allowed origins
		allowedOriginList := strings.Split(strings.TrimSpace(allowedOrigins), ",")

		// Check if the trimmed origin is in the list of allowed origins
		originAllowed := false
		for _, allowedOrigin := range allowedOriginList {
			if origin == strings.TrimSpace(allowedOrigin) {
				originAllowed = true
				break
			}
		}

		if !originAllowed {
			return c.Status(fiber.StatusForbidden).SendString("Access denied: Invalid origin")
		}

		return c.Next()
	})

	routes.SetUserRoutes(app, client)

	routes.SetQuizRoutes(app, client)

	app.Listen(":3001")
}
