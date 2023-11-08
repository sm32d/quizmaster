package services

import (
	"context"
	"log"
	"quizmaster/app/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetUserByEmail retrieves a user by their email from the MongoDB database.
func GetUserByEmail(client *mongo.Client, email string) (*models.User, error) {
	// Access the MongoDB collection containing user data
	collection := client.Database("quizmaster").Collection("users")

	// Define a filter to find the user by email
	filter := bson.M{"email": email}

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

	// Find one document that matches the filter
	var user models.User
	err := collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No matching user found, return nil
		}
		return nil, err // Handle other errors, e.g., database connection issues
	}

	return &user, nil
}

// GetUserByProviderAccountId retrieves a user by their provider accountID from the MongoDB database.
func GetUserByProviderAccountId(client *mongo.Client, providerAccountId string) (*models.User, error) {
	// Access the MongoDB collection containing user data
	collection := client.Database("quizmaster").Collection("users")

	// Define a filter to find the user by email
	filter := bson.M{"providerAccountId": providerAccountId}

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

	// Find one document that matches the filter
	var user models.User
	err := collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No matching user found, return nil
		}
		return nil, err // Handle other errors, e.g., database connection issues
	}

	return &user, nil
}

// InsertUser inserts a user into the database.
func InsertUser(client *mongo.Client, user models.User) (primitive.ObjectID, error) {
	collection := client.Database("quizmaster").Collection("users")

	// Create a context for the database operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()

	insertedUser, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Println("Error inserting user:", err)
		return primitive.NilObjectID, err
	}

	return insertedUser.InsertedID.(primitive.ObjectID), nil
}

// UpdateUserByProviderAccountID updates a user by their ID in the database.
func UpdateUserByProviderAccountID(client *mongo.Client, updatedUser models.User) error {
    collection := client.Database("quizmaster").Collection("users")

    // Create a context for the database operation
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
    defer cancel()

    // Define the filter to match the user by ID
    filter := bson.M{"providerAccountId": updatedUser.ProviderAccountId}

    // Define the update operation. You can use $set to update specific fields.
    update := bson.M{"$set": updatedUser}

    _, err := collection.UpdateOne(ctx, filter, update)
    if err != nil {
        log.Println("Error updating user:", err)
        return err
    }

    return nil
}
