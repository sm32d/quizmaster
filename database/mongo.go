package database

import (
	"context"
	"time"
	"os"
    "github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// InitMongoDB initializes and returns a MongoDB client.
func InitMongoDB() (*mongo.Client, error) {
	// Load environment variables from .env
    err := godotenv.Load()
    if err != nil {
        // Handle the error
    }

	// MongoDB connection string from environment variable
	uri := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(uri)

	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel() // Ensure the context is canceled when the function returns

	// Connect to MongoDB with the timeout context
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}

	// Check the connection with the same timeout context
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	return client, nil
}