package services

import (
	"context"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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

/**
* @brief Retrieve all answers from the MongoDB database for a quiz.
*
* @param client A pointer to the MongoDB client.
* @param quizId The ID of the quiz to retrieve answers for.
*
* @return A slice of pointers to the retrieved answers, or nil if no answers were found.
 */
func GetAnswersByQuiz(client *mongo.Client, quizId string) ([]models.Answer, error) {
	collection := client.Database("quizmaster").Collection("answers")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"quiz_id": quizId}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err // Handle database connection issues or other errors
	}
	defer cursor.Close(ctx)

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
func GetAnswersByQuestion(client *mongo.Client, quizId string, questionId string) ([]models.QuestionAnswer, error) {
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
