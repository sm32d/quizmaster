package models

// Question represents a question in a quiz.
type Question struct {
	Text       string   `json:"text" bson:"text"`
	Choices    []string `json:"choices" bson:"choices"`
	Correct    string   `json:"correct" bson:"correct"`
	Difficulty string   `json:"difficulty" bson:"difficulty"`
	Section    string   `json:"section" bson:"section"`
}
