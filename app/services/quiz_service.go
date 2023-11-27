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

/**
* @brief Retrieve all quizzes from the MongoDB database for the user.
*
* @param client A pointer to the MongoDB client.
* @param userId The ID of the user to retrieve quizzes for.
*
* @return A slice of pointers to the retrieved quizzes, or nil if no quizzes were found.
 */
func ListQuizzes(client *mongo.Client, userId string) ([]models.Quiz, error) {
	collection := client.Database("quizmaster").Collection("quizzes")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

	filter := bson.M{"created_by": userId}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

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

/**
* @brief Insert a quiz into the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param quiz The quiz to insert.
*
* @return An error if the operation failed, nil otherwise.
 */
func InsertQuiz(client *mongo.Client, quiz models.Quiz) error {
	collection := client.Database("quizmaster").Collection("quizzes")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, quiz)
	if err != nil {
		return err
	}

	return nil
}

/**
* @brief Retrieve a quiz by its ID for the quiz owner from the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to retrieve.
* @param providerAccountId The ID of the user who created the quiz.
*
* @return A pointer to the retrieved quiz, or nil if no quiz was found.
 */
func GetQuizByID(client *mongo.Client, quizID string, providerAccountId string) (*models.Quiz, error) {

	quiz, err := GetQuizByIdForEU(client, quizID)
	if err != nil {
		return nil, err
	}

	if quiz.CreatedBy != providerAccountId {
		return nil, nil
	}

	return quiz, err
}

/**
* @brief Retrieve a quiz by its ID from the MongoDB database without ownership check.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to retrieve.
*
* @return A pointer to the retrieved quiz, or nil if no quiz was found.
 */
func GetQuizByIdForEU(client *mongo.Client, quizID string) (*models.Quiz, error) {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": quizObjectID}

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

/**
* @brief Update a quiz by its ID in the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to update.
* @param updatedQuiz The updated quiz.
*
* @return An error if the operation failed, nil otherwise.
 */
func UpdateQuiz(client *mongo.Client, quizID string, updatedQuiz models.Quiz) error {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": quizObjectID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.ReplaceOne(ctx, filter, updatedQuiz)
	if err != nil {
		return err
	}

	return nil
}

/**
* @brief Delete a quiz by its ID from the MongoDB database.
* @note This function will not delete the answers for the quiz.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to delete.
*
* @return An error if the operation failed, nil otherwise.
 */
func DeleteQuiz(client *mongo.Client, quizID string) error {
	collection := client.Database("quizmaster").Collection("quizzes")

	quizObjectID, err := primitive.ObjectIDFromHex(quizID)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": quizObjectID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}
