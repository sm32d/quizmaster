package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

type GetUserByEmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

func GetUserByEmailHandler(client *mongo.Client, email string) (*models.User, error) {
	// Use the services function to fetch the user by email
	user, err := services.GetUserByEmail(client, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// CreateUserHandler handles the creation of a new user.
func CreateUserHandler(c *fiber.Ctx, client *mongo.Client) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	// Check if a user with the same email already exists
	existingUser, err := services.GetUserByEmail(client, user.Email)
	if err != nil {
		return err // Handle the error, such as a database error
	}
	if existingUser != nil {
		// User with the same email already exists, return an error response
		return c.JSON(existingUser)
	}

	// Use the InsertUser function from the services package
	dbId, err := services.InsertUser(client, user)
	if err != nil {
		return err
	}
    user.ID = dbId
	return c.JSON(user)
}

func ParseAndValidateGetUserByEmailRequest(c *fiber.Ctx) (*GetUserByEmailRequest, error) {
	var request GetUserByEmailRequest
	validate := validator.New()

	if err := c.BodyParser(&request); err != nil {
		return nil, err
	}

	if err := validate.Struct(request); err != nil {
		return nil, err
	}

	return &request, nil
}
