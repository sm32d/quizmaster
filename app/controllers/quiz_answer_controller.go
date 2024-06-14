package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateAnswerHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	var answer models.Answer

	log.Info("CreateAnswerHandler : Parsing answer body", ", trackingID:", trackingID)
	if err := c.BodyParser(&answer); err != nil {
		log.Error("CreateAnswerHandler : Error parsing answer body : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	log.Info("CreateAnswerHandler : Checking if the user has already submitted an answer for the quiz", ", trackingID:", trackingID)
	existingAnswer, err := services.GetAnswerForQuizByUser(client, answer.QuizID, answer.UserID)
	if err != nil {
		log.Error("CreateAnswerHandler : Error retrieving answer to check for existing answer : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	// If an answer exists and the quiz does not allow multiple attempts, return an error
	if existingAnswer != nil {
		log.Info("CreateAnswerHandler : Retrieving quiz to check for multiple attempts", ", trackingID:", trackingID)
		quiz, err := services.GetQuizByIdForEU(client, answer.QuizID)
		if err != nil {
			log.Error("CreateAnswerHandler : Error retrieving quiz to check for multiple attempts : ", err, ", trackingID:", trackingID)
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

	log.Info("CreateAnswerHandler : Assigning a new ID to the answer", ", trackingID:", trackingID)
	answer.ID = primitive.NewObjectID()
	answer.CreatedAt = time.Now()

	log.Info("CreateAnswerHandler : Creating the answer", ", trackingID:", trackingID)
	_, err = services.CreateAnswer(client, answer)
	if err != nil {
		log.Error("CreateAnswerHandler : Error creating answer : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("CreateAnswerHandler : Answer created successfully", ", trackingID:", trackingID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuiz retrieves all answers for a quiz.
func GetAnswersByQuiz(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")

	// ensure that the quiz creator is the one querying the answers
	var email models.User

	if err := c.BodyParser(&email); err != nil {
		log.Error("Failed to parse user from request body:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	log.Info("Retrieving user:", email.Email)
	user, err := GetUserByEmailHandler(client, email.Email, trackingID)
	if err != nil {
		log.Error("Failed to retrieve user:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if user == nil {
		log.Error("User not found:", email.Email, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("User not found")
	}

	userId := user.ProviderAccountId

	quiz, err := services.GetQuizByIdForEU(client, quizId)
	if err != nil {
		log.Error("Failed to retrieve quiz to validate creator:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	if quiz.CreatedBy != userId {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorised")
	}

	// proceed to fetch answers
	log.Info("Getting answers for quiz: ", quizId, ", trackingID:", trackingID)

	answers, err := services.GetAnswersByQuiz(client, quizId)
	if err != nil {
		log.Error("Failed to get answers for quiz: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("Retrieved ", len(answers), " answers for quiz: ", quizId, ", trackingID:", trackingID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
	})
}

// GetAnswerForQuizByUser retrieves the answer for a quiz by a user.
func GetAnswerForQuizByUser(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")
	userId := c.Params("userId")

	log.Info("Getting answer for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
	answer, err := services.GetAnswerForQuizByUser(client, quizId, userId)
	if err != nil {
		log.Error("Failed to get answer for quiz: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if answer == nil {
		log.Error("Answer not found for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Answer not found",
		})
	}

	log.Info("Answer retrieved successfully for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuestion retrieves all answers for a question.
func GetAnswersByQuestion(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")
	questionId := c.Params("questionId")

	log.Info("Getting answers for question: ", questionId, "in quiz: ", quizId, ", trackingID:", trackingID)
	answers, err := services.GetAnswersByQuestion(client, quizId, questionId)
	if err != nil {
		log.Error("Failed to get answers for question: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("Retrieved ", len(answers), " answers for question: ", questionId, "in quiz: ", quizId, ", trackingID:", trackingID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
	})
}
