package controllers

import (
	"quizmaster/app/models"
	"quizmaster/app/services"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/mongo"
)

type GetUserByEmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// GetUserByEmailHandler retrieves a user by their email from the MongoDB database.
//
// Parameters:
// - client: a pointer to the MongoDB client
// - email: the email of the user to retrieve
//
// Returns:
// - *models.User: a pointer to the retrieved user, or nil if no user was found
// - error: an error if the operation fails
func GetUserByEmailHandler(client *mongo.Client, email string, trackingID string) (*models.User, error) {
	log.Info("Retrieving user by email:", email, ", trackingID:", trackingID)

	// Retrieve the user from the database
	user, err := services.GetUserByEmail(client, email)
	if err != nil {
		log.Error("Failed to retrieve user:", err, ", trackingID:", trackingID)
		return nil, err
	}

	if user == nil {
		log.Info("User not found", ", trackingID:", trackingID)
	} else {
		log.Info("User retrieved:", user, ", trackingID:", trackingID)
	}

	return user, nil
}

// CreateUserHandler handles the creation or update of a user.
// It expects a request body containing a User struct.
// If a user with the same providerId already exists, it updates the user.
// Otherwise, it creates a new user.
func CreateUserHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	// Parse the request body into a User struct
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	// Check if a user with the same providerId already exists
	existingUser, err := services.GetUserByProviderAccountId(client, user.Provider, user.ProviderAccountId)
	if err != nil {
		log.Error("Failed to retrieve user to check if user already exists:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	if existingUser != nil {
		// User with the same id already exists, update the user
		log.Info("User already exists, updating:", user, ", trackingID:", trackingID)
		user.ID = existingUser.ID
		user.UpdatedAt = time.Now()
		err := services.UpdateUserByProviderAccountID(client, user)
		if err != nil {
			log.Error("Failed to update user:", err, ", trackingID:", trackingID)
			return c.Status(fiber.StatusInternalServerError).SendString("Server error")
		}
		log.Info("User updated:", user.Email, ", trackingID:", trackingID)
		return c.JSON(user)
	}

	// Check if a user with the same email already exists as one email can only have one user
	existingUser, err = services.GetUserByEmail(client, user.Email)
	if err != nil {
		log.Error("Failed to retrieve user to check if user already exists:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	if existingUser != nil {
		log.Error("User with email already exists:", user.Email, " provider:", user.Provider, ", trackingID:", trackingID)
		return c.Status(fiber.StatusConflict).SendString("User with email already exists")
	}

	// User does not exist, create a new user
	log.Info("User does not exist, creating:", user.Email, ", trackingID:", trackingID)
	user.CreatedAt = time.Now()
	dbId, err := services.InsertUser(client, user)
	if err != nil {
		log.Error("Failed to create user:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}
	user.ID = dbId
	log.Info("User created:", user.Email, ", trackingID:", trackingID)
	return c.JSON(user)
}

func ParseAndValidateGetUserByEmailRequest(c *fiber.Ctx, trackingID string) (*GetUserByEmailRequest, error) {
	log.Info("Parsing and validating get user by email request", ", trackingID:", trackingID)
	var request GetUserByEmailRequest
	validate := validator.New()

	if err := c.BodyParser(&request); err != nil {
		log.Error("Error parsing get user by email request:", err, ", trackingID:", trackingID)
		return nil, err
	}

	if err := validate.Struct(request); err != nil {
		log.Error("Error validating get user by email request:", err, ", trackingID:", trackingID)
		return nil, err
	}

	log.Info("Get user by email request successfully parsed and validated", ", trackingID:", trackingID)
	return &request, nil
}
