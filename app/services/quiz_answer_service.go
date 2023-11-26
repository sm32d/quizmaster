package services

import (
	"context"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateAnswer inserts a new answer into the database.
func CreateAnswer(client *mongo.Client, answer models.Answer) (*mongo.InsertOneResult, error) {
	// Access the MongoDB collection containing answer data
	collection := client.Database("quizmaster").Collection("answers")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert the answer into the database
	result, err := collection.InsertOne(ctx, answer)
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}

	return result, nil
}

// GetAnswersByQuiz retrieves all answers for a quiz.
func GetAnswersByQuiz(client *mongo.Client, quizId string) ([]models.Answer, error) {
	// Access the MongoDB collection containing answer data
	collection := client.Database("quizmaster").Collection("answers")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Define a filter to match answers by quiz ID
	filter := bson.M{"quiz_id": quizId}

	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, filter) // You can add filters if needed
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

	// Define a slice to store the answers
	var answers []models.Answer

	// Iterate through the cursor and decode documents into the slice
	for cursor.Next(ctx) {
		var answer models.Answer
		if err := cursor.Decode(&answer); err != nil {
			return nil, err // Handle decoding errors
		}
		answers = append(answers, answer)
	}

	if err := cursor.Err(); err != nil {
		return nil, err // Handle any cursor errors
	}

	return answers, nil
}

// GetAnswerForQuizByUser retrieves the answer for a quiz by a user.
func GetAnswerForQuizByUser(client *mongo.Client, quizId string, userId string) (*models.Answer, error) {
	// Access the MongoDB collection containing answer data
	collection := client.Database("quizmaster").Collection("answers")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Define a filter to match answers by quiz ID and user ID
	filter := bson.M{"quiz_id": quizId, "user_id": userId}

	// Find the document that matches the filter
	var answer models.Answer
	err := collection.FindOne(ctx, filter).Decode(&answer)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // Return nil if no matching document was found
		}
		return nil, err // Handle database connection issues or other errors
	}

	return &answer, nil
}

// GetAnswersByUser retrieves all answers for a user.
func GetAnswersByUser(client *mongo.Client, userId string) ([]models.Answer, error) {
	// Access the MongoDB collection containing answer data
	collection := client.Database("quizmaster").Collection("answers")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Define a filter to match answers by user ID
	filter := bson.M{"user_id": userId}

	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, filter) // You can add filters if needed
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

	// Define a slice to store the answers
	var answers []models.Answer

	// Iterate through the cursor and decode documents into the slice
	for cursor.Next(ctx) {
		var answer models.Answer
		if err := cursor.Decode(&answer); err != nil {
			return nil, err // Handle decoding errors
		}
		answers = append(answers, answer)
	}

	if err := cursor.Err(); err != nil {
		return nil, err // Handle any cursor errors
	}

	return answers, nil
}

// GetAnswersByQuestion retrieves all answers for a question.
func GetAnswersByQuestion(client *mongo.Client, quizId string, questionId string) ([]models.QuestionAnswer, error) {
	// Access the MongoDB collection containing answer data
	collection := client.Database("quizmaster").Collection("answers")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Define a filter to match answers by user ID
	filter := bson.M{"quiz_id": quizId, "answers.question_id": questionId}

	// Find all documents that match the filter
	cursor, err := collection.Find(ctx, filter) // You can add filters if needed
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

	// Define a slice to store the question answers
	var questionAnswers []models.QuestionAnswer

	// Iterate through the cursor and decode documents into the slice
	for cursor.Next(ctx) {
		var answer models.Answer
		if err := cursor.Decode(&answer); err != nil {
			return nil, err // Handle decoding errors
		}
		for _, qa := range answer.Answers {
			if qa.QuestionID == questionId {
				questionAnswers = append(questionAnswers, qa)
			}
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err // Handle any cursor errors
	}

	return questionAnswers, nil
}
