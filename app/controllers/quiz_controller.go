package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

// ListQuizzes retrieves a list of all quizzes.
func GetQuizzes(c *fiber.Ctx, client *mongo.Client, emailId string) error {
	user, err := GetUserByEmailHandler(client, emailId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if user == nil {
		return c.Status(fiber.StatusNotFound).SendString("User not found")
	}
	userId := user.ProviderAccountId
	// Use the service function to retrieve quizzes from the database
	quizzes, err := services.ListQuizzes(client, userId)
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

// GetQuizHandler retrieves a quiz by ID
func GetQuizById(c *fiber.Ctx, client *mongo.Client) error {
	quizID := c.Params("id")
	var email models.User

	if err := c.BodyParser(&email); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	user, err := GetUserByEmailHandler(client, email.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if user == nil {
		return c.Status(fiber.StatusNotFound).SendString("User not found")
	}
	userId := user.ProviderAccountId

	// Retrieve the quiz by ID from the database
	quiz, err := services.GetQuizByID(client, quizID, userId)
	if err != nil {
		return err
	}

	if quiz == nil {
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	return c.JSON(quiz)
}

// UpdateQuizHandler updates a quiz by ID
func UpdateQuiz(c *fiber.Ctx, client *mongo.Client) error {
	quizID := c.Params("id")

	// Parse the request body into the updated quiz object
	var updatedQuiz models.Quiz
	if err := c.BodyParser(&updatedQuiz); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	updatedQuiz.UpdatedAt = time.Now()

	// Update the quiz in the database
	err := services.UpdateQuiz(client, quizID, updatedQuiz)
	if err != nil {
		return err
	}

	return c.JSON(updatedQuiz)
}

// DeleteQuizHandler deletes a quiz by ID
func DeleteQuiz(c *fiber.Ctx, client *mongo.Client) error {
	quizID := c.Params("id")

	// Delete the quiz by ID from the database
	err := services.DeleteQuiz(client, quizID)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
