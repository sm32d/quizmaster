package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// SetQuizRoutes sets up the routes for quizzes
// on the given fiber app and MongoDB client.
// It handles the following routes:
//   - GET /api/quizzes/:emailId: Retrieves all quizzes for a user.
//   - POST /api/quiz: Creates a new quiz.
//   - POST /api/quiz/:id: Retrieves a quiz by ID.
//   - GET /api/quiz/:id: Retrieves a quiz by ID (for EU).
//   - PUT /api/quiz/:id: Updates a quiz by ID.
//   - DELETE /api/quiz/:id: Deletes a quiz by ID.
func SetQuizRoutes(app *fiber.App, client *mongo.Client) {
	// Get all quizzes for a user
	app.Get("/api/quizzes/:emailId", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.GetQuizzes(c, client, trackingID)
	})

	// Create a new quiz
	app.Post("/api/quiz", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.CreateQuizHandler(c, client, trackingID)
	})

	// Retrieve a quiz by ID
	app.Post("/api/quiz/:id", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.GetQuizById(c, client, trackingID)
	})

	// Retrieve a quiz by ID (for End Users)
	app.Get("/api/quiz/:id", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.GetQuizByIdForEU(c, client, trackingID)
	})

	// Update a quiz by ID
	app.Put("/api/quiz/:id", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.UpdateQuiz(c, client, trackingID)
	})

	// Delete a quiz by ID
	app.Delete("/api/quiz/:id", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.DeleteQuiz(c, client, trackingID)
	})

}
