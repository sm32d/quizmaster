package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Question represents a question in a quiz.
type Question struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Text       string             `json:"text" bson:"text"`
	Choices    []string           `json:"choices" bson:"choices"`
	Correct    string             `json:"correct" bson:"correct"`
	Difficulty string             `json:"difficulty" bson:"difficulty"`
	Section    string             `json:"section" bson:"section"`
}
