package middleware

import (
	"github.com/gofiber/fiber/v2"

	"github.com/google/uuid"
)

func TrackingIDMiddleware(c *fiber.Ctx) error {
	// Generate a unique tracking ID for each request
	trackingID, err := uuid.NewRandom()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to generate tracking ID")
	}

	// Set the tracking ID in the request context
	c.Locals("trackingID", trackingID.String())

	// Continue to the next middleware or route handler
	return c.Next()
}
