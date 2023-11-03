// routes/quiz_routes.go

package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetQuizRoutes(app *fiber.App, client *mongo.Client) {
	// get all quizzes
	app.Get("/api/quizzes", func(c *fiber.Ctx) error {
		return controllers.GetQuizzes(c, client)
	})

	// create a quiz
	app.Post("/api/quiz", func(c *fiber.Ctx) error {
		return controllers.CreateQuizHandler(c, client)
	})

	// Retrieve a quiz by ID
	app.Get("/api/quiz/:id", func(c *fiber.Ctx) error {
		return controllers.GetQuizById(c, client)
	})

	// Update a quiz by ID
	app.Put("/api/quiz/:id", func(c *fiber.Ctx) error {
		return controllers.UpdateQuiz(c, client)
	})

	// Delete a quiz by ID
	app.Delete("/api/quiz/:id", func(c *fiber.Ctx) error {
		return controllers.DeleteQuiz(c, client)
	})

}
