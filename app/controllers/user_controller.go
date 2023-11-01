package controllers

import (
    "github.com/gofiber/fiber/v2"
    "quizmaster/app/models"
    "quizmaster/app/services"
    "go.mongodb.org/mongo-driver/mongo"
)

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
        return c.Status(fiber.StatusConflict).JSON(fiber.Map{
            "message": "User with this email already exists",
        })
    }

    // Use the InsertUser function from the services package
    err = services.InsertUser(client, user)
    if err != nil {
        return err
    }

    return c.JSON(user)
}
