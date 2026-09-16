package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Message represents the MongoDB schema for contact messages
type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Email     string             `bson:"email" json:"email" binding:"required,email"`
	Subject   string             `bson:"subject,omitempty" json:"subject"`
	Message   string             `bson:"message" json:"message" binding:"required"`
	Source    string             `bson:"source" json:"source"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}

var messageCollection *mongo.Collection

func main() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/portfolio_db"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Printf("[Go Backend] Warning: MongoDB connect error: %v", err)
	} else {
		messageCollection = client.Database("portfolio_db").Collection("messages")
		log.Println("[Go Backend] Successfully initialized MongoDB connection")
	}

	router := gin.Default()

	// CORS configuration for portfolio frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":      "online",
			"service":     "golang-microservice",
			"engine":      "Golang v1.22 + Gin Framework",
			"database":    "MongoDB 6.0+",
			"timestamp":   time.Now().UTC().Format(time.RFC3339),
			"collections": []string{"messages", "projects", "visitors"},
		})
	})

	// Message endpoints
	router.POST("/api/messages", handleCreateMessage)
	router.GET("/api/messages", handleGetMessages)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Golang microservice listening on :%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func handleCreateMessage(c *gin.Context) {
	var msg Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg.CreatedAt = time.Now().UTC()
	if msg.Source == "" {
		msg.Source = "web-portfolio"
	}

	if messageCollection != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		res, err := messageCollection.InsertOne(ctx, msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to persist document to MongoDB"})
			return
		}
		msg.ID = res.InsertedID.(primitive.ObjectID)
	} else {
		// Mock ID if running standalone
		msg.ID = primitive.NewObjectID()
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Message successfully saved to MongoDB database",
		"data":    msg,
	})
}

func handleGetMessages(c *gin.Context) {
	var messages []Message = []Message{}
	if messageCollection != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(50)
		cursor, err := messageCollection.Find(ctx, bson.M{}, opts)
		if err == nil {
			defer cursor.Close(ctx)
			_ = cursor.All(ctx, &messages)
		}
	}
	c.JSON(http.StatusOK, gin.H{"messages": messages})
}
