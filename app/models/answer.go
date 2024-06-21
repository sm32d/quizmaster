package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// QuestionAnswer represents a user's answer to a specific question.
type QuestionAnswer struct {
	QuestionID primitive.ObjectID `json:"question_id" bson:"question_id"`
	Answer     string             `json:"answer" bson:"answer"`
}

// Answer represents a user's answers to a quiz.
type Answer struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	QuizID    string             `json:"quiz_id" bson:"quiz_id"`
	UserID    string             `json:"user_id" bson:"user_id"`
	Answers   []QuestionAnswer   `json:"answers" bson:"answers"`
	StartedAt time.Time          `json:"started_at" bson:"started_at"`
	EndedAt   time.Time          `json:"ended_at" bson:"ended_at"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}
