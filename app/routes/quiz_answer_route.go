package routes

import (
	"quizmaster/app/controllers"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetAnswerRoutes(app *fiber.App, client *mongo.Client) {
	// create an answer
	app.Post("/api/answer", func(c *fiber.Ctx) error {
		return controllers.CreateAnswerHandler(c, client)
	})

	// Retrive all answers for a quiz
	app.Get("/api/quiz/:quizId/answers", func(c *fiber.Ctx) error {
		return controllers.GetAnswersByQuiz(c, client)
	})

	// Retrieve answer for a quiz by a user
	app.Get("/api/quiz/:quizId/user/:userId/answer", func(c *fiber.Ctx) error {
		return controllers.GetAnswerForQuizByUser(c, client)
	})

	// Retrieve all answers for a user
	app.Get("/api/quiz/answers/user/:userId", func(c *fiber.Ctx) error {
		return controllers.GetAnswersByUser(c, client)
	})

	// Retrieve all answers for a question
	app.Get("/api/quiz/:quizId/question/:questionId/answers", func(c *fiber.Ctx) error {
		return controllers.GetAnswersByQuestion(c, client)
	})
}
