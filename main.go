package main

import (
	"context"
	"log"
	"quizmaster/app/routes"
	"quizmaster/database"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Connect to MongoDB
	client, err := database.InitMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Define Fiber application and routes
	app := fiber.New()

	// Define routes and handlers inside this function
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Set user routes
    routes.SetUserRoutes(app, client)

	// Start the Fiber application
	app.Listen(":3000")
}
