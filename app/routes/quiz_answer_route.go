package routes

import (
	"quizmaster/app/controllers"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// SetAnswerRoutes sets up the answer routes for the given fiber app and MongoDB client.
// It handles the following routes:
//   - POST /api/answer: Creates a new answer.
//   - GET /api/quiz/:quizId/answers: Retrieves all answers for a quiz.
//   - GET /api/quiz/:quizId/user/:userId/answer: Retrieves the answer for a quiz by a user.
//   - GET /api/quiz/:quizId/question/:questionId/answers: Retrieves all answers for a question.
func SetAnswerRoutes(app *fiber.App, client *mongo.Client) {
	// create an answer
	app.Post("/api/answer", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.CreateAnswerHandler(c, client, trackingID)
	})

	// Retrive all answers for a quiz
	app.Get("/api/quiz/:quizId/answers", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		page, err := strconv.Atoi(c.Query("page", "1"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid page number")
		}
		perPage, err := strconv.Atoi(c.Query("perPage", "10"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid perPage number")
		}
		return controllers.GetAnswersByQuiz(c, client, trackingID, page, perPage)
	})

	// Retrieve answer for a quiz by a user
	app.Get("/api/quiz/:quizId/user/:userId/answer", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.GetAnswerForQuizByUser(c, client, trackingID)
	})

	// Retrieve all answers for a question
	app.Get("/api/quiz/:quizId/question/:questionId/answers", func(c *fiber.Ctx) error {
		trackingID := c.Locals("trackingID").(string)
		return controllers.GetAnswersByQuestion(c, client, trackingID)
	})
}
