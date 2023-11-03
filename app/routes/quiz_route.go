// routes/quiz_routes.go

package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetQuizRoutes(app *fiber.App, client *mongo.Client) {
	app.Get("/api/quizzes", func(c *fiber.Ctx) error {
		return controllers.GetQuizzes(c, client)
	})

	// Define the route for creating a quiz
	app.Post("/api/quiz", func(c *fiber.Ctx) error {
		return controllers.CreateQuizHandler(c, client)
	})

}
