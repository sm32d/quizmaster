// services/quiz_service.go

package services

import (
	"context"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// ListQuizzes retrieves a list of all quizzes from the database.
func ListQuizzes(client *mongo.Client, userId string) ([]models.Quiz, error) {
	// Access the MongoDB collection containing quiz data
	collection := client.Database("quizmaster").Collection("quizzes")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

	// Define a filter to match quizzes by user ID
	filter := bson.M{"created_by": userId}

	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, filter) // You can add filters if needed
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

// GetQuizByID retrieves a quiz by ID from the database
func GetQuizByID(client *mongo.Client, quizID string, providerAccountId string) (*models.Quiz, error) {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return nil, err
	}

	// Define a filter to find the quiz by ID
	filter := bson.M{"_id": quizObjectID, "created_by": providerAccountId}

	var quiz models.Quiz

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, filter).Decode(&quiz)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No matching quiz found, return nil
		}
		return nil, err
	}

	return &quiz, nil
}

// UpdateQuiz updates a quiz by ID in the database
func UpdateQuiz(client *mongo.Client, quizID string, updatedQuiz models.Quiz) error {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return err
	}

	// Define a filter to find the quiz by ID
	filter := bson.M{"_id": quizObjectID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.ReplaceOne(ctx, filter, updatedQuiz)
	if err != nil {
		return err
	}

	return nil
}

// DeleteQuiz deletes a quiz by ID from the database
func DeleteQuiz(client *mongo.Client, quizID string) error {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return err
	}

	// Define a filter to find the quiz by ID
	filter := bson.M{"_id": quizObjectID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}
