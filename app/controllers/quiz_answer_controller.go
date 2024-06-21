package controllers

import (
	"math/rand"
	"quizmaster/app/models"
	"quizmaster/app/services"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CreateAnswerRequest struct {
	Email          string                `json:"email" validate:"required,email"`
	AnswerID       primitive.ObjectID    `json:"answer_id" bson:"answer_id" validate:"required"`
	QuestionAnswer models.QuestionAnswer `json:"questionAnswer" bson:"questionAnswer" validate:"required"`
}

func CheckEligibilityHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")

	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	quiz, err := services.GetQuizByIdForEU(client, quizId)
	if err != nil {
		log.Error("Failed to retrieve quiz to validate creator:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	if quiz == nil {
		log.Error("Quiz not found:", quizId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	log.Info("Getting answer for quiz: ", quizId, "by user: ", user.Email, ", trackingID:", trackingID)
	answer, err := services.GetAnswerForQuizByUser(client, quizId, user.Email)
	if err != nil {
		log.Error("Failed to verify eligibility for quiz: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if answer == nil {
		log.Info("Answer not found for quiz: ", quizId, "by user: ", user.Email, ", trackingID:", trackingID)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"eligible": true,
		})
	}
	log.Info("Answer found for quiz: ", quizId, "by user: ", user.Email, ", trackingID:", trackingID)
	// if quiz wasn't ended
	if answer.EndedAt.IsZero() {
		// check if quiz is timed
		if quiz.Timer > 0 {
			// check if time limit has not reached, eligible for quiz and return answer
			if time.Since(answer.StartedAt).Minutes() < float64(quiz.Timer) {
				return c.Status(fiber.StatusOK).JSON(fiber.Map{
					"eligible": true,
					"answer":   answer,
				})
			} else { // time limit reached; check if quiz allows multiple attempts
				if quiz.AllowMultipleAttempts {
					return c.Status(fiber.StatusOK).JSON(fiber.Map{
						"eligible": true,
					})
				}
			}
		}
		// quiz is not timed, return existing answer
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"eligible": true,
			"answer":   answer,
		})
	} else { // quiz was ended; check if quiz allows multiple attempts
		if quiz.AllowMultipleAttempts {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"eligible": true,
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"eligible": false,
	})
}

func InitAnswerHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")

	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	quiz, err := services.GetQuizByIdForEU(client, quizId)
	if err != nil {
		log.Error("InitAnswerHandler: Failed to retrieve quiz:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	if quiz == nil {
		log.Error("InitAnswerHandler: Quiz not found:", quizId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	// init models.Answer.Answers with the questions in the quiz but empty answers
	log.Info("Initializing answer for quiz: ", quizId, "by user: ", user.Email, ", trackingID:", trackingID)
	questionAnswers := []models.QuestionAnswer{}

	if quiz.RandomiseQuestions {
		rand.Shuffle(len(quiz.Questions), func(i, j int) {
			quiz.Questions[i], quiz.Questions[j] = quiz.Questions[j], quiz.Questions[i]
		})
	}
	for _, question := range quiz.Questions {
		questionAnswers = append(questionAnswers, models.QuestionAnswer{
			QuestionID: question.ID,
			Answer:     "",
		})
	}

	answer := models.Answer{
		ID:        primitive.NewObjectID(),
		QuizID:    quizId,
		UserID:    user.Email,
		Answers:   questionAnswers,
		StartedAt: time.Now(),
		EndedAt:   time.Time{},
		CreatedAt: time.Now(),
	}

	_, err = services.CreateAnswer(client, answer)
	if err != nil {
		log.Error("InitAnswerHandler: Failed to create answer:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	log.Info("Answer initialized successfully for quiz: ", quizId, "by user: ", user.Email, ", trackingID:", trackingID)
	return c.Status(fiber.StatusOK).JSON(answer)
}

func CreateAnswerHandler(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	var request CreateAnswerRequest

	log.Info("CreateAnswerHandler : Parsing answer body", ", trackingID:", trackingID)
	if err := c.BodyParser(&request); err != nil {
		log.Error("CreateAnswerHandler : Error parsing answer body : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad request")
	}

	log.Info("CreateAnswerHandler : Fetching Answer by ID", ", trackingID:", trackingID)
	answer, err := services.GetAnswerById(client, request.AnswerID)
	if err != nil {
		log.Error("CreateAnswerHandler : Error retrieving answer : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if answer == nil {
		log.Error("CreateAnswerHandler : Answer not found : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Answer not found",
		})
	}

	log.Info("CreateAnswerHandler : Checking if answer is already completed", ", trackingID:", trackingID)
	if !answer.EndedAt.IsZero() {
		log.Error("CreateAnswerHandler : Answer already completed : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Answer already completed",
		})
	}

	log.Info("CreateAnswerHandler : Checking if answer belongs to user", ", trackingID:", trackingID)
	if answer.UserID != request.Email {
		log.Error("CreateAnswerHandler : Answer does not belong to user : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Answer does not belong to user",
		})
	}

	log.Info("CreateAnswerHandler : Checking if quiz exists", ", trackingID:", trackingID)
	quiz, err := services.GetQuizByIdForEU(client, answer.QuizID)
	if err != nil {
		log.Error("CreateAnswerHandler : Error retrieving quiz : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if quiz == nil {
		log.Error("CreateAnswerHandler : Quiz not found : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Quiz not found",
		})
	}

	if quiz.Timer > 0 && time.Since(answer.StartedAt).Minutes() > float64(quiz.Timer) {
		log.Error("CreateAnswerHandler : Quiz timer expired : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Quiz timer expired",
		})
	}

	for i, answers := range answer.Answers {
		if answers.QuestionID == request.QuestionAnswer.QuestionID {
			for j, questions := range quiz.Questions {
				if questions.ID == answers.QuestionID {
					found := false
					for _, choice := range quiz.Questions[j].Choices {
						if choice == request.QuestionAnswer.Answer {
							found = true
							break
						}
					}
					if !found {
						log.Error("CreateAnswerHandler : Answer not in choices : ", err, ", trackingID:", trackingID)
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"error": "Answer not in choices",
						})
					}
				}
			}
			answer.Answers[i].Answer = request.QuestionAnswer.Answer
		}
	}

	_, err = services.UpdateAnswer(client, answer)
	if err != nil {
		log.Error("CreateAnswerHandler : Error updating answer : ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("CreateAnswerHandler : Answer created successfully", ", trackingID:", trackingID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuiz retrieves all answers for a quiz.
func GetAnswersByQuiz(c *fiber.Ctx, client *mongo.Client, trackingID string, page, perPage int) error {
	quizId := c.Params("quizId")

	quiz, err := services.GetQuizByIdForEU(client, quizId)
	if err != nil {
		log.Error("Failed to retrieve quiz to validate creator:", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).SendString("Server error")
	}

	if quiz == nil {
		log.Error("Quiz not found:", quizId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).SendString("Quiz not found")
	}

	// proceed to fetch answers
	log.Info("Retrieving answers for quiz: ", quizId, ", trackingID:", trackingID)
	// log retrival of answers by page number
	log.Info("Retrieving answers by page number: ", page, ", per page: ", perPage, ", trackingID:", trackingID)

	answers, pages, err := services.GetAnswersByQuizPaginated(client, quizId, page, perPage)
	if err != nil {
		log.Error("Failed to get answers for quiz: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("Retrieved ", len(answers), " answers for quiz: ", quizId, ", trackingID:", trackingID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
		"pages":   pages,
	})
}

// GetAnswerForQuizByUser retrieves the answer for a quiz by a user.
func GetAnswerForQuizByUser(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")
	userId := c.Params("userId")

	log.Info("Getting answer for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
	answer, err := services.GetAnswerForQuizByUser(client, quizId, userId)
	if err != nil {
		log.Error("Failed to get answer for quiz: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if answer == nil {
		log.Error("Answer not found for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Answer not found",
		})
	}

	log.Info("Answer retrieved successfully for quiz: ", quizId, "by user: ", userId, ", trackingID:", trackingID)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answer": answer,
	})
}

// GetAnswersByQuestion retrieves all answers for a question.
func GetAnswersByQuestion(c *fiber.Ctx, client *mongo.Client, trackingID string) error {
	quizId := c.Params("quizId")
	questionId := c.Params("questionId")

	questionIDObject, err := primitive.ObjectIDFromHex(questionId)
	if err != nil {
		log.Error("Failed to convert questionId to ObjectID: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid questionId",
		})
	}

	log.Info("Getting answers for question: ", questionId, "in quiz: ", quizId, ", trackingID:", trackingID)
	answers, err := services.GetAnswersByQuestion(client, quizId, questionIDObject)
	if err != nil {
		log.Error("Failed to get answers for question: ", err, ", trackingID:", trackingID)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	log.Info("Retrieved ", len(answers), " answers for question: ", questionId, "in quiz: ", quizId, ", trackingID:", trackingID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"answers": answers,
	})
}
