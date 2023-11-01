package routes

import (
    "github.com/gofiber/fiber/v2"
    "quizmaster/app/controllers"
    "go.mongodb.org/mongo-driver/mongo"
)

// SetUserRoutes defines the user-related routes.
func SetUserRoutes(app *fiber.App, client *mongo.Client) {
    // Define the route for user signup
    app.Post("/api/signup", func(c *fiber.Ctx) error {
        return controllers.CreateUserHandler(c, client)
    })
}
