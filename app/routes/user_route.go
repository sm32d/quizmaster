package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetUserRoutes(app *fiber.App, client *mongo.Client) {

	app.Post("/api/login", func(c *fiber.Ctx) error {
		return controllers.CreateUserHandler(c, client)
	})

	app.Post("/api/user", func(c *fiber.Ctx) error {
		// Parse and validate the request
		request, err := controllers.ParseAndValidateGetUserByEmailRequest(c)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Bad request")
		}

		// Call the controller function to fetch the user by email
		user, err := controllers.GetUserByEmailHandler(client, request.Email)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}

		if user == nil {
			return c.Status(fiber.StatusNotFound).SendString("User not found")
		}

		return c.JSON(user)
	})
}
