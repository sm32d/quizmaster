// services/quiz_service.go

package services

import (
	"context"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ListQuizzes retrieves a list of all quizzes from the database.
func ListQuizzes(client *mongo.Client) ([]models.Quiz, error) {
	// Access the MongoDB collection containing quiz data
	collection := client.Database("quizmaster").Collection("quizzes")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, bson.M{}) // You can add filters if needed
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

	// Define a slice to store the quizzes
	var quizzes []models.Quiz

	// Iterate through the cursor and decode documents into the slice
	for cursor.Next(ctx) {
		var quiz models.Quiz
		if err := cursor.Decode(&quiz); err != nil {
			return nil, err // Handle decoding errors
		}
		quizzes = append(quizzes, quiz)
	}

	if err := cursor.Err(); err != nil {
		return nil, err // Handle any cursor errors
	}

	return quizzes, nil
}

func InsertQuiz(client *mongo.Client, quiz models.Quiz) error {
	// Access the MongoDB collection for quizzes
	collection := client.Database("quizmaster").Collection("quizzes")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert the quiz into the database
	_, err := collection.InsertOne(ctx, quiz)
	if err != nil {
		return err
	}

	return nil
}
