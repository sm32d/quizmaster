// controllers/quiz_controller.go

package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// ListQuizzes retrieves a list of all quizzes.
func GetQuizzes(c *fiber.Ctx, client *mongo.Client) error {
	// Use the service function to retrieve quizzes from the database
	quizzes, err := services.ListQuizzes(client)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"quizzes": quizzes,
	})
}

func CreateQuizHandler(c *fiber.Ctx, client *mongo.Client) error {
	var quiz models.Quiz

	// Parse the request body into the quiz object
	if err := c.BodyParser(&quiz); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	// Set the CreatedAt timestamp
	quiz.CreatedAt = time.Now()
	quiz.UpdatedAt = time.Now()

	// Set the CreatedBy field with the user's information

	// Insert the quiz into the database
	err := services.InsertQuiz(client, quiz)
	if err != nil {
		return err
	}

	return c.JSON(quiz)
}
