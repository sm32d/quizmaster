package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID                primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username          string             `json:"username" bson:"username"`
	Name              string             `json:"name" bson:"name"`
	Email             string             `json:"email" bson:"email" validate:"required,email"`
	Role              string             `json:"role" bson:"role"`
	Provider          string             `json:"provider" bson:"provider"`
	ProviderAccountId string             `json:"providerAccountId" bson:"providerAccountId"`
	CreatedAt         time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt         time.Time          `json:"updated_at" bson:"updated_at"`
}
