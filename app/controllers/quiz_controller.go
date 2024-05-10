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

// GetQuizzes retrieves a list of all quizzes for the specified user.
//
// Parameters:
// - c: the fiber context
// - client: the MongoDB client
//
// Returns:
// - error: any error that occurred during the operation
func GetQuizzes(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	emailId := c.Params("emailId")

	log.Info("Retrieving quizzes for user:", emailId, ", trackingID:", trackingID)

	user, err := GetUserByEmailHandler(client, emailId, trackingID)
	if err != nil {
		log.Error("Failed to retrieve user:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if user == nil {
		log.Error("User not found:", emailId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("User not found")
	}

	userId := user.ProviderAccountId

	quizzes, err := services.ListQuizzes(client, userId)
	if err != nil {
		log.Error("Failed to retrieve quizzes:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("Retrieved ", len(quizzes), " quizzes for user:", emailId, ", trackingID:", trackingID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"quizzes": quizzes,
	})
}

// CreateQuizHandler handles the creation of a new quiz.
//
// Parameters:
// - c: the fiber context
// - client: the MongoDB client
//
// Returns:
// - error: any error that occurred during the operation
func CreateQuizHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	var quiz models.Quiz
	if err := c.BodyParser(&quiz); err != nil {
		log.Error("Failed to parse quiz from request body:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	log.Info("Received quiz creation request for user:", quiz.CreatedBy, ", trackingID:", trackingID)

	user, err := GetUserByEmailHandler(client, quiz.CreatedBy, trackingID)
	if err != nil {
		log.Error("Failed to retrieve user:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if user == nil {
		log.Error("User not found:", quiz.CreatedBy, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("User not found")
	}

	// Assign a new ID to the quiz
	quiz.ID = primitive.NewObjectID()
	quiz.CreatedBy = user.ProviderAccountId

	// Set the createdAt and updatedAt fields to the current time
	quiz.CreatedAt = time.Now()
	quiz.UpdatedAt = time.Now()

	// Assign a new ID to each question in the quiz
	for i := range quiz.Questions {
		quiz.Questions[i].ID = primitive.NewObjectID()
	}

	// Insert the quiz into the database
	log.Info("Inserting quiz into database with ID:", quiz.ID, ", trackingID:", trackingID)
	err = services.InsertQuiz(client, quiz)
	if err != nil {
		log.Error("Failed to insert quiz into database:", err, ", trackingID:", trackingID)
		return err
	}

	log.Info("Quiz created successfully", ", trackingID:", trackingID)
	return c.JSON(quiz)
}

// GetQuizHandler retrieves a quiz by ID
func GetQuizById(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizID := c.Params("id")
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

	log.Info("Retrieving quiz with ID:", quizID, "for user:", userId, ", trackingID:", trackingID)
	quiz, err := services.GetQuizByID(client, quizID, userId)
	if err != nil {
		log.Error("Failed to retrieve quiz:", err, ", trackingID:", trackingID)
		return err
	}

	if quiz == nil {
		log.Error("Quiz not found:", quizID, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	log.Info("Quiz retrieved successfully", ", trackingID:", trackingID)
	return c.JSON(quiz)
}

// GetQuizByIdForEU retrieves a quiz by ID
func GetQuizByIdForEU(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizID := c.Params("id")
	log.Info("Retrieving quiz with ID:", quizID, ", trackingID:", trackingID)

	quiz, err := services.GetQuizByIdForEU(client, quizID)
	if err != nil {
		log.Error("Failed to retrieve quiz:", err, ", trackingID:", trackingID)
		return err
	}

	if quiz == nil {
		log.Error("Quiz not found with ID:", quizID, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	log.Info("Quiz retrieved successfully", ", trackingID:", trackingID)
	return c.JSON(quiz)
}

// UpdateQuizHandler updates a quiz by ID
func UpdateQuiz(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizID := c.Params("id")
	log.Info("Received quiz update request for ID:", quizID, ", trackingID:", trackingID)

	var updatedQuiz models.Quiz
	if err := c.BodyParser(&updatedQuiz); err != nil {
		log.Error("Failed to parse quiz from request body:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	err := services.UpdateQuiz(client, quizID, updatedQuiz)
	if err != nil {
		log.Error("Failed to update quiz:", err, ", trackingID:", trackingID)
		return err
	}

	updatedQuiz.UpdatedAt = time.Now()
	log.Info("Updated quiz details successfully:", updatedQuiz, ", trackingID:", trackingID)

	return c.JSON(updatedQuiz)
}

// DeleteQuizHandler deletes a quiz by ID
func DeleteQuiz(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizID := c.Params("id")
	log.Info("Deleting quiz with ID:", quizID, ", trackingID:", trackingID)

	err := services.DeleteQuiz(client, quizID)
	if err != nil {
		log.Error("Failed to delete quiz:", err, ", trackingID:", trackingID)
		return err
	}

	log.Info("Quiz deleted successfully", ", trackingID:", trackingID)
	return c.SendStatus(fiber.StatusNoContent)
}
