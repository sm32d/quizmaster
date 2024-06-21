package services

import (
	"context"
	"math"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/**
* @brief Insert an answer into the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param answer The answer to insert.
*
* @return A pointer to the result of the insert operation, or nil if an error occurred.
 */
func CreateAnswer(client *mongo.Client, answer models.Answer) (*mongo.InsertOneResult, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert the answer into the database
	result, err := collection.InsertOne(ctx, answer)
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}

	return result, nil
}

func UpdateAnswer(client *mongo.Client, answer *models.Answer) (*mongo.UpdateResult, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": answer.ID}
	update := bson.M{"$set": answer}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func GetAnswerById(client *mongo.Client, answerId primitive.ObjectID) (*models.Answer, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": answerId}

	var answer models.Answer
	err := collection.FindOne(ctx, filter).Decode(&answer)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &answer, nil
}

/** GetAnswersByQuiz retrieves all answers from the MongoDB database for a quiz.
*
* Parameters:
* - client: A pointer to the MongoDB client.
* - quizID: The ID of the quiz to retrieve answers for.
* - limit (optional): The maximum number of answers to retrieve.
*
* Returns:
* - answers: A slice of models.Answer containing the retrieved answers.
* - error: An error if the retrieval fails.
 */
func GetAnswersByQuiz(client *mongo.Client, quizID string, limit ...int) ([]models.Answer, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"quiz_id": quizID}

	// Create options to sort the answers by creation time in descending order
	// and limit the number of answers returned
	opts := options.Find()
	if len(limit) > 0 {
		opts.SetSort(bson.M{"created_at": -1}).SetLimit(int64(limit[0]))
	}

	// Execute the find operation and retrieve the cursor
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Declare a slice to store the answers
	var answers []models.Answer

	// Iterate through the cursor and decode the documents into the answers slice
	for cursor.Next(ctx) {
		var answer models.Answer
		if err := cursor.Decode(&answer); err != nil {
			return nil, err
		}
		answers = append(answers, answer)
	}

	return answers, nil
}

// GetAnswersByQuizPaginated retrieves paginated answers for a quiz.
//
// Parameters:
// - client: A pointer to the MongoDB client.
// - quizID: The ID of the quiz to retrieve answers for.
// - page: The current page number for pagination.
// - perPage: The number of answers per page for pagination.
// Returns:
// - A slice of models.Answer containing the paginated answers.
// - An error if the retrieval fails.
func GetAnswersByQuizPaginated(client *mongo.Client, quizID string, page, perPage int) ([]models.Answer, pages, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"quiz_id": quizID}

	// Calculate the skip value based on the page and perPage parameters
	skip := (page - 1) * perPage

	// Count the total number of answers
	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, pages{}, err
	}

	// Calculate the number of pages
	pages := pages{
		TotalPages:  int(math.Ceil(float64(count) / float64(perPage))),
		CurrentPage: page,
	}

	// Create options to sort the answers by creation time in descending order
	// and limit the number of answers returned
	opts := options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(int64(perPage)).SetSkip(int64(skip))

	// Execute the find operation and retrieve the cursor
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, pages, err
	}
	defer cursor.Close(ctx)

	// Declare a slice to store the answers
	var answers []models.Answer

	// Iterate through the cursor and decode the documents into the answers slice
	for cursor.Next(ctx) {
		var answer models.Answer
		if err := cursor.Decode(&answer); err != nil {
			return nil, pages, err
		}
		answers = append(answers, answer)
	}

	return answers, pages, nil
}

type pages struct {
	TotalPages  int `json:"total_pages"`
	CurrentPage int `json:"current_page"`
}

/**
* @brief Retrieve an answer from the MongoDB database for a quiz by a user.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to retrieve answers for.
* @param userId The ID of the user to retrieve answers for.
*
* @return A pointer to the retrieved answer, or nil if no answer was found.
 */
func GetAnswerForQuizByUser(client *mongo.Client, quizId string, userId string) (*models.Answer, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"quiz_id": quizId, "user_id": userId}

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

/**
* @brief Retrieve all answers for a specific question in a quiz from the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to retrieve answers for.
* @param questionId The ID of the question to retrieve answers for.
*
* @return A slice of pointers to the retrieved answers, or nil if no answers were found.
 */
func GetAnswersByQuestion(client *mongo.Client, quizId string, questionId primitive.ObjectID) ([]models.QuestionAnswer, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"quiz_id": quizId, "answers.question_id": questionId}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

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
