package main

import (
	"context"
	"log"
	"quizmaster/app/routes"
	"quizmaster/database"

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

	// Allowed origins URIs from environment variable
	uri := os.Getenv("ALLOWED_ORIGINS")

	// Connect to MongoDB
	client, err := database.InitMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Define Fiber application and routes
	app := fiber.New()

	// Enable CORS for localhost:3001 for local dev
	app.Use(cors.New(cors.Config{
		AllowOrigins: uri,
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Set user routes
	routes.SetUserRoutes(app, client)

	routes.SetQuizRoutes(app, client)

	// Start the Fiber application
	app.Listen(":3001")
}
