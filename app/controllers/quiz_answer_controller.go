package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateAnswerHandler(c *fiber.Ctx, client *mongo.Client) error {
	var answer models.Answer

	if err := c.BodyParser(&answer); err != nil {
		log.Error("CreateAnswerHandler : Error parsing answer body : ", err)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	// Check if the user has already submitted an answer for the quiz
	existingAnswer, err := services.GetAnswerForQuizByUser(client, answer.QuizID, answer.UserID)
	if err != nil {
		log.Error("CreateAnswerHandler : Error retrieving answer to check for existing answer : ", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	// If an answer exists and the quiz does not allow multiple attempts, return an error
	if existingAnswer != nil {
		quiz, err := services.GetQuizByIdForEU(client, answer.QuizID)
		if err != nil {
			log.Error("CreateAnswerHandler : Error retrieving quiz to check for multiple attempts : ", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}

		if !quiz.AllowMultipleAttempts {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Multiple attempts not allowed for this quiz",
			})
		}
	}

	// Assign a new ID to each question
	answer.ID = primitive.NewObjectID()

	_, err = services.CreateAnswer(client, answer)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuiz retrieves all answers for a quiz.
func GetAnswersByQuiz(c *fiber.Ctx, client *mongo.Client) error {
	quizId := c.Params("quizId")

	answers, err := services.GetAnswersByQuiz(client, quizId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
	})
}

// GetAnswerForQuizByUser retrieves the answer for a quiz by a user.
func GetAnswerForQuizByUser(c *fiber.Ctx, client *mongo.Client) error {
	quizId := c.Params("quizId")
	userId := c.Params("userId")

	answer, err := services.GetAnswerForQuizByUser(client, quizId, userId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if answer == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Answer not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuestion retrieves all answers for a question.
func GetAnswersByQuestion(c *fiber.Ctx, client *mongo.Client) error {
	quizId := c.Params("quizId")
	questionId := c.Params("questionId")

	answers, err := services.GetAnswersByQuestion(client, quizId, questionId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
	})
}
