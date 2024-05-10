package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// SetUserRoutes sets up the user routes for the given fiber app and MongoDB client.
// It handles the following routes:
//   - POST /api/login: Creates a new user or updates an existing user.
//   - POST /api/user: Retrieves a user by email.
func SetUserRoutes(app *fiber.App, client *mongo.Client) {
	// POST /api/login
	// Creates a new user or updates an existing user.
	app.Post("/api/login", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.CreateUserHandler(c, client, trackingID)
	})

	// POST /api/user
	// Retrieves a user by email.
	app.Post("/api/user", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		// Parse and validate the request body.
		request, err := controllers.ParseAndValidateGetUserByEmailRequest(c, trackingID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Bad request")
		}

		// Retrieve the user by email.
		user, err := controllers.GetUserByEmailHandler(client, request.Email, trackingID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		// If user is not found, return a "User not found" error.
		if user == nil {
			return c.Status(fiber.StatusNotFound).SendString("User not found")
		}

		// Return the user as a JSON response.
		return c.JSON(user)
	})
}
