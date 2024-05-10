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

/**
* @brief Retrieves a user by their email from the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param email The email of the user to retrieve.
*
* @return A pointer to the retrieved user, or nil if no user was found.
 */
func GetUserByEmail(client *mongo.Client, email string) (*models.User, error) {
	collection := client.Database("quizmaster").Collection("users")

	filter := bson.M{"email": email}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

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

/**
* @brief Retrieves a user by their ID from the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param id The ID of the user to retrieve.
*
* @return A pointer to the retrieved user, or nil if no user was found.
 */
func GetUserByProviderAccountId(client *mongo.Client, provider string, providerAccountId string) (*models.User, error) {
	collection := client.Database("quizmaster").Collection("users")

	filter := bson.M{"provider": provider, "providerAccountId": providerAccountId}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()                                                          // Cancel the context when the function returns

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

/**
* @brief Inserts a user into the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param user The user to insert.
*
* @return The ID of the inserted user, or nil if the user could not be inserted.
 */
func InsertUser(client *mongo.Client, user models.User) (primitive.ObjectID, error) {
	collection := client.Database("quizmaster").Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()

	insertedUser, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Println("Error inserting user:", err)
		return primitive.NilObjectID, err
	}

	return insertedUser.InsertedID.(primitive.ObjectID), nil
}

/**
* @brief Updates a user in the MongoDB database.
*
* @param client A pointer to the MongoDB client.
* @param updatedUser The updated user.
*
* @return An error if the user could not be updated.
 */
func UpdateUserByProviderAccountID(client *mongo.Client, updatedUser models.User) error {
	collection := client.Database("quizmaster").Collection("users")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // A 5-second timeout
	defer cancel()

	filter := bson.M{"providerAccountId": updatedUser.ProviderAccountId}

	// Define the update operation. Use $set to update specific fields.
	update := bson.M{"$set": updatedUser}

	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println("Error updating user:", err)
		return err
	}

	return nil
}
