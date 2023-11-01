package services

import (
    "context"
    "log"
    "time"
    "quizmaster/app/models"
    "go.mongodb.org/mongo-driver/bson"
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
    defer cancel() // Cancel the context when the function returns

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
func InsertUser(client *mongo.Client, user models.User) error {
    collection := client.Database("quizmaster").Collection("users")

    _, err := collection.InsertOne(context.TODO(), user)
    if err != nil {
        log.Println("Error inserting user:", err)
        return err
    }

    return nil
}
