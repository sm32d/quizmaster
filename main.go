package main

import (
	"context"
	"log"
	"quizmaster/app/routes"
	"quizmaster/database"
	"quizmaster/middleware"

	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
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

	// middleware setup
	app.Use(middleware.SetupCORS(uri))
	app.Use(keyauth.New(keyauth.Config{
		Validator: middleware.ValidateAPIKey,
	}))

	// routes setup
	routes.SetUserRoutes(app, client)
	routes.SetQuizRoutes(app, client)
	routes.SetAnswerRoutes(app, client)

	app.Listen(":3001")
}
