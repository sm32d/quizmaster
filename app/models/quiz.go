package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Quiz represents a quiz in the application.
type Quiz struct {
	ID                    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title                 string             `json:"title" bson:"title"`
	Sections              []string           `json:"sections" bson:"sections"`
	Difficulty            string             `json:"difficulty" bson:"difficulty"`
	Questions             []Question         `json:"questions" bson:"questions"`
	CollectEmail          bool               `json:"collect_email" bson:"collect_email"`
	AllowMultipleAttempts bool               `json:"allow_multiple_attempts" bson:"allow_multiple_attempts"`
	CreatedAt             time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt             time.Time          `json:"updated_at" bson:"updated_at"`
	CreatedBy             string             `json:"created_by" bson:"created_by"`
}

type QuizStats struct {
	NumberOfAttempts       int     `json:"attempts"`
	AverageScore           float64 `json:"average_score"`
	AverageAttemptsPerUser float64 `json:"average_attempts_per_user"`
}
