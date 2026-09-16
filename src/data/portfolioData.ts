import { Project, SkillCategory, Experience } from '../types';

export const PERSONAL_INFO = {
  name: 'Imrul Kais Khan',
  title: 'Senior Full Stack Engineer',
  tagline: 'Specializing in scalable SaaS systems, high-concurrency microservices, and modern web architectures.',
  summary: 'Senior Software Engineer with 7+ years of experience specializing in scalable SaaS systems for global products. Skilled in Node.js, NestJS, Go, Next.js, cloud infrastructure (AWS/GCP), and subscription-based systems supporting tens of thousands of users across multiple regions.',
  location: 'Dhaka, Bangladesh',
  email: 'imrulkaiskhan@gmail.com',
  phone: '+8801777078574',
  github: 'https://github.com/imrulkk89',
  githubUsername: 'imrulkk89',
  linkedin: 'https://linkedin.com/in/imrul-kais-khan',
  linkedinUsername: 'imrul-kais-khan',
  portfolio: 'https://imrul.top',
  yearsOfExperience: '7+',
  education: {
    degree: 'B.Sc. in Electrical and Electronic Engineering (EEE)',
    institution: 'American International University-Bangladesh',
  },
  certifications: [
    {
      title: 'Google Cloud Associate Cloud Engineer',
      issuer: 'Google Cloud (Trained by Poridhi.io)',
      year: '2022',
      badge: 'GCP Certified'
    },
    {
      title: 'Docker & Kubernetes Certificate',
      issuer: 'KodeKloud',
      year: '2022',
      badge: 'Cloud Native'
    }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: 'pronto-pilates',
    title: 'Pronto Pilates Platform',
    subtitle: 'Global Fitness Subscription & Concurrent Booking Engine',
    category: 'Full Stack',
    description: 'Built and scaled a global booking and subscription SaaS platform serving 37,000+ active members across Australia, the United States, and New Zealand. Engineered high-concurrency booking engine handling 5,000+ daily reservations.',
    techStack: ['React.js', 'Next.js', 'NestJS', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Segment', 'Mixpanel', 'Snowflake', 'GrowthBook'],
    metrics: ['37,000+ Active Users', '5,000+ Daily Bookings', '3 Global Regions (AU/US/NZ)'],
    highlights: [
      'Designed subscription lifecycle system handling thousands of monthly renewals, upgrades, pauses, and credits.',
      'Built an administrative operations dashboard for real-time monitoring of 37K+ users and credit reconciliation.',
      'Engineered an analytics pipeline (Segment → Mixpanel → Snowflake) with GrowthBook feature flags and A/B testing.',
      'Provisioned and maintained production AWS infrastructure (EC2, RDS PostgreSQL, S3) with GitHub Actions CI/CD.'
    ],
    role: 'Senior Fullstack Engineer',
    clientOrCompany: 'Pronto Pilates (Australia / Remote)',
    liveUrl: 'https://prontopilates.com',
    featured: true
  },
  {
    id: 'airbyte-etl-pipeline',
    title: 'Spotify to Monstercat Airbyte ETL',
    subtitle: 'High-Performance Cloud Data Pipeline & BigQuery Analytics',
    category: 'Cloud & Data',
    description: 'Developed an enterprise-grade cloud data extraction and transformation pipeline on Google Cloud Platform to synchronize high-volume streaming metadata from Spotify into BigQuery for Monstercat business intelligence and ML models.',
    techStack: ['Airbyte', 'Python', 'DBT', 'Google Cloud Platform', 'BigQuery', 'PubSub', 'Docker', 'Kubernetes', 'Terraform'],
    metrics: ['Millions of Daily Events', 'Automated GCP Ingestion', 'Full Terraform IaC'],
    highlights: [
      'Conducted R&D on Airbyte ETL tool, authoring custom API sources and cloud destinations.',
      'Leveraged Google Container Registry (GCR) to build and deploy containerized extraction workers on GKE.',
      'Designed Python DBT data transformation models to structure raw streaming telemetry into analytic tables.',
      'Automated complete multi-environment deployment using Terraform Infrastructure as Code.'
    ],
    role: 'Fullstack & Cloud Data Engineer',
    clientOrCompany: 'Monstercat / Bitstrapped',
    featured: true
  },
  {
    id: 'carbangla-ride-sharing',
    title: 'CarBangla Ride Sharing Architecture',
    subtitle: 'Real-Time MQTT Geospatial Fleet Tracking & Scaled Backend',
    category: 'Microservices',
    description: 'Architected and implemented high-volume microservices backend and web management platform for an on-demand ride sharing service, scaling to over 100,000 requests per day with real-time geospatial driver matching.',
    techStack: ['Node.js', 'TypeScript', 'Go', 'MongoDB', 'MySQL', 'MQTT', 'Laravel', 'React.js', 'Redux', 'AWS', 'Terraform'],
    metrics: ['100,000+ Daily Requests', 'Sub-second Driver Dispatch', 'Geospatial Indexing'],
    highlights: [
      'Engineered real-time driver tracking pub/sub architecture using MQTT broker and MongoDB 2dsphere geospatial indexing.',
      'Implemented secure payment gateway integrations (PayPal, local gateways), OAuth authentication, and SMS verification.',
      'Provisioned AWS infrastructure (EC2, RDS, S3) and automated CI/CD deployment pipelines with Terraform.',
      'Built responsive progressive web app (PWA) frontend with service workers and Nginx reverse proxy.'
    ],
    role: 'Fullstack Engineer (Backend Lead)',
    clientOrCompany: 'CarBangla (Ride Sharing App)',
    liveUrl: 'https://carbangla.com',
    featured: true
  },
  {
    id: 'boston-dynamics-spot',
    title: 'Boston Dynamics Spot Robot Data Integration',
    subtitle: 'Google Smart Factory 4.0 Real-time Cloud Pipeline',
    category: 'Systems & IoT',
    description: 'Enabled autonomous telemetry and real-time vision sensor transmission from Boston Dynamics Spot robot into Google Smart Factory 4.0 cloud systems.',
    techStack: ['Python', 'Terraform', 'Google Cloud Platform', 'PubSub', 'Docker', 'Computer Vision'],
    metrics: ['Autonomous Edge Processing', 'Real-time PubSub Streaming'],
    highlights: [
      'Provisioned Google Smart Factory 4.0 infrastructure to Boston Dynamics Cloud using Terraform.',
      'Implemented edge image processing modules in Python deployed directly onto Boston Dynamics Spot robot compute.',
      'Established bi-directional low-latency PubSub data pipeline connecting robotic sensors to Google Cloud.'
    ],
    role: 'Intermediate Fullstack Engineer',
    clientOrCompany: 'Bitstrapped (Canada)',
    featured: false
  },
  {
    id: 'mhotel-pms-platform',
    title: 'mHotel Self Check-in & PMS Engine',
    subtitle: 'Contactless Hospitality Platform & Encrypted Shift4 Payments',
    category: 'Full Stack',
    description: 'Developed backend services and micro-integrations connecting hotel property management systems (PMS) to enable autonomous kiosk and mobile guest self-check-in / check-out workflows.',
    techStack: ['Node.js', 'NestJS', 'TypeScript', 'Express', 'Shift4 Payments', 'REST APIs', 'PostgreSQL'],
    metrics: ['Zero Front-Desk Wait', 'PCI-DSS Compliant Storage', 'Standardized PMS Bus'],
    highlights: [
      'Integrated multiple disparate hotel Property Management Systems (Opera, Maestro) through a unified REST gateway.',
      'Hardened payment security by integrating Shift4 and tokenized credit-card token storage for reservations.',
      'Engineered reusable frontend payment processing JavaScript SDK to eliminate code duplication across touchpoints.'
    ],
    role: 'Senior Fullstack Engineer (Backend)',
    clientOrCompany: 'MeldCx (Australia)',
    featured: false
  },
  {
    id: 'brainstation-fintech',
    title: 'Cross-Border Fintech Banking System',
    subtitle: 'International Remittance & Inter-Bank Settlement Platform',
    category: 'Full Stack',
    description: 'Engineered high-security financial technology application linking banking networks across the United States and Mexico with compliance auditing and automated currency reconciliation.',
    techStack: ['React.js', 'Node.js', 'Express', 'TypeScript', 'Swagger', 'Jest', 'PostgreSQL'],
    metrics: ['Bi-National Banking Rails', '100% Swagger API Coverage', 'Extensive Test Suites'],
    highlights: [
      'Engineered resilient banking settlement flows connecting US and Mexican financial institutions.',
      'Authored comprehensive Swagger API documentation, unit tests, and integration test suites with Jest.',
      'Mentored junior engineers and translated Figma / Adobe XD prototypes into responsive React interfaces.'
    ],
    role: 'Fullstack Engineer',
    clientOrCompany: 'BrainStation-23',
    featured: false
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    name: 'Core Backend & Architecture',
    iconName: 'Server',
    description: 'High-throughput microservices, API gateways, and distributed event systems.',
    skills: [
      { name: 'Node.js', level: 'Expert', years: '7+ yrs', featured: true },
      { name: 'TypeScript', level: 'Expert', years: '6+ yrs', featured: true },
      { name: 'NestJS', level: 'Expert', years: '5+ yrs', featured: true },
      { name: 'Golang', level: 'Advanced', years: '3+ yrs', featured: true },
      { name: 'ExpressJS', level: 'Expert', years: '7+ yrs' },
      { name: 'REST & GraphQL', level: 'Expert', years: '7+ yrs' },
      { name: 'MQTT & WebSockets', level: 'Advanced', years: '4+ yrs' },
      { name: 'OAuth & JWT', level: 'Expert', years: '6+ yrs' },
      { name: 'Jest & Unit Testing', level: 'Advanced', years: '5+ yrs' },
      { name: 'Swagger / OpenAPI', level: 'Expert', years: '6+ yrs' },
    ]
  },
  {
    id: 'databases',
    name: 'Databases & In-Memory Stores',
    iconName: 'Database',
    description: 'Relational data modeling, geospatial search, and caching strategies.',
    skills: [
      { name: 'MongoDB', level: 'Expert', years: '6+ yrs', featured: true },
      { name: 'PostgreSQL', level: 'Expert', years: '6+ yrs', featured: true },
      { name: 'Redis', level: 'Advanced', years: '5+ yrs', featured: true },
      { name: 'MySQL', level: 'Advanced', years: '7+ yrs' },
      { name: 'SQLite', level: 'Proficient', years: '5+ yrs' },
      { name: 'Geospatial (2dsphere)', level: 'Advanced', years: '4+ yrs' }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend & UI Engineering',
    iconName: 'Layout',
    description: 'Modern component-driven web applications and reactive state management.',
    skills: [
      { name: 'React.js', level: 'Expert', years: '6+ yrs', featured: true },
      { name: 'Next.js', level: 'Advanced', years: '4+ yrs', featured: true },
      { name: 'Tailwind CSS', level: 'Expert', years: '5+ yrs', featured: true },
      { name: 'Vue.js & Vuex', level: 'Advanced', years: '3+ yrs' },
      { name: 'Redux / Toolkit', level: 'Expert', years: '5+ yrs' },
      { name: 'SASS / CSS Modules', level: 'Expert', years: '7+ yrs' },
      { name: 'Material UI & Ant Design', level: 'Advanced', years: '5+ yrs' }
    ]
  },
  {
    id: 'cloud-devops',
    name: 'Cloud Infrastructure & DevOps',
    iconName: 'Cloud',
    description: 'Infrastructure as Code, container orchestration, and continuous deployment.',
    skills: [
      { name: 'AWS (EC2, S3, RDS, IAM, Route53)', level: 'Expert', years: '5+ yrs', featured: true },
      { name: 'Google Cloud (Compute, GKE, BigQuery)', level: 'Advanced', years: '4+ yrs', featured: true },
      { name: 'Docker & Containers', level: 'Expert', years: '5+ yrs', featured: true },
      { name: 'Kubernetes', level: 'Advanced', years: '3+ yrs', featured: true },
      { name: 'Terraform (IaC)', level: 'Advanced', years: '4+ yrs', featured: true },
      { name: 'Nginx & Reverse Proxies', level: 'Expert', years: '6+ yrs' },
      { name: 'GitHub Actions & CI/CD', level: 'Expert', years: '5+ yrs' },
      { name: 'Linux Server Administration', level: 'Expert', years: '7+ yrs' }
    ]
  },
  {
    id: 'data-pipelines',
    name: 'Data Engineering & Analytics',
    iconName: 'TrendingUp',
    description: 'ETL pipelines, analytical warehouses, and product experimentation telemetry.',
    skills: [
      { name: 'Airbyte ETL', level: 'Advanced', years: '3+ yrs', featured: true },
      { name: 'BigQuery', level: 'Advanced', years: '3+ yrs' },
      { name: 'Python DBT Tool', level: 'Advanced', years: '3+ yrs' },
      { name: 'Segment & Mixpanel', level: 'Advanced', years: '3+ yrs' },
      { name: 'GrowthBook (A/B Testing)', level: 'Advanced', years: '2+ yrs' },
      { name: 'Snowflake', level: 'Proficient', years: '2+ yrs' }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'pronto-pilates',
    company: 'Pronto Pilates',
    role: 'Senior Fullstack Engineer',
    location: 'Australia [Remote]',
    period: 'Jan 2024 - May 2026',
    badge: 'Latest Role',
    description: 'Architected global subscription and booking platform for 37,000+ fitness club members across 3 international regions.',
    highlights: [
      'Built a global booking & subscription platform serving 37K+ users across AU/US/NZ, handling 5K+ daily bookings, replacing manual workflows and reducing operational overhead.',
      'Designed subscription lifecycle system handling thousands of monthly renewals, including upgrades, pauses, and credits, improving retention and automation.',
      'Scaled booking system to handle 5K+ daily concurrent bookings across regions with stable, low-latency performance.',
      'Built an admin dashboard for real-time monitoring of 37K+ users, enabling support, credit adjustments, and operational analytics.',
      'Implemented an analytics & experimentation pipeline (Segment → Mixpanel → Snowflake, GrowthBook), enabling feature flags and A/B testing for product decisions.',
      'Provisioned and operated production AWS infrastructure (EC2, RDS PostgreSQL) and Node.js services with PM2; automated deployments using GitHub Actions CI/CD.',
      'Took part in architectural decisions with Senior DevOps, implemented SOLID principles and design patterns in NestJS.'
    ],
    technologies: ['NestJS', 'Node.js', 'TypeScript', 'React.js', 'PostgreSQL', 'AWS (EC2/RDS)', 'Segment', 'Snowflake', 'GrowthBook']
  },
  {
    id: 'meldcx',
    company: 'MeldCx',
    role: 'Senior Fullstack Engineer (Backend)',
    location: 'Australia [Liaison Office]',
    period: 'Aug 2022 - Jul 2023',
    description: 'Led backend microservices integration for the mHotel self-check-in hospitality platform across hotel chains.',
    highlights: [
      'Led backend development for the mHotel platform, integrating with multiple Property Management Systems (PMS) to streamline hotel check-in/check-out workflows.',
      'Built a self check-in/check-out system, reducing front-desk dependency and improving guest experience across partner hotels.',
      'Standardized API response transformation across multiple external integrations, improving consistency, maintainability, and integration speed.',
      'Strengthened payment security by integrating Shift4 and implementing encrypted credit-card attachment to reservations.',
      'Developed a reusable frontend payment processing library in JavaScript, improving reliability and reducing duplicate code.'
    ],
    technologies: ['Node.js', 'NestJS', 'Express', 'PostgreSQL', 'Shift4', 'PMS Systems', 'JavaScript']
  },
  {
    id: 'bitstrapped',
    company: 'Bitstrapped',
    role: 'Intermediate Fullstack Engineer',
    location: 'Canada [Remote]',
    period: 'Jan 2022 - Jul 2022',
    description: 'Engineered cloud infrastructure, robot telemetry integration, and custom Airbyte data extraction pipelines on GCP.',
    highlights: [
      'Provisioned Google Smart Factory 4.0 to Boston Dynamics Cloud using Terraform.',
      'Enabled real-time data transmission from Boston Dynamics Spot Robot to Google Smart Factory via PubSub channel.',
      'Developed Python-based image processing code for deployment on Boston Dynamics Spot Robot compute platform.',
      'Conducted R&D on Airbyte ETL Tool, creating custom sources and destinations.',
      'Extracted Spotify data through API using Airbyte custom source and designed SQL queries using Python DBT for data transformation in ETL.'
    ],
    technologies: ['Google Cloud Platform', 'Terraform', 'PubSub', 'Airbyte', 'Python', 'DBT', 'Docker', 'Kubernetes']
  },
  {
    id: 'brainstation',
    company: 'BrainStation-23',
    role: 'Fullstack Engineer',
    location: 'Dhaka, Bangladesh',
    period: 'May 2020 - Dec 2021',
    description: 'Developed cross-border fintech applications linking banking networks between USA and Mexico.',
    highlights: [
      'Engineered a Fintech Application linking banks in the USA and Mexico.',
      'Translated Adobe XD & Figma designs into responsive ReactJS frontend interfaces.',
      'Documented all APIs using Swagger and wrote comprehensive Unit Tests and Integration Tests with Jest.',
      'Assisted in project management and mentored junior software engineers in best practices.'
    ],
    technologies: ['ReactJS', 'Node.js', 'Express', 'PostgreSQL', 'Swagger', 'Jest', 'Figma']
  },
  {
    id: 'carbangla',
    company: 'CarBangla (Ride Sharing App)',
    role: 'Fullstack Engineer (Backend)',
    location: 'Dhaka, Bangladesh',
    period: 'Nov 2018 - Mar 2020',
    description: 'Scaled ride-sharing microservices, real-time driver tracking engine, and AWS infrastructure to 100K daily requests.',
    highlights: [
      'Developed ride-sharing backend and AWS infrastructure (EC2, RDS, S3), scaling to 100K requests/day.',
      'Implemented payments (PayPal), OAuth, email verification, and REST APIs.',
      'Developed Frontend with ReactJS & Redux, enabled PWA capabilities with Service Worker and configured Nginx for both ReactJS and NodeJS App.',
      'Implemented real-time driver tracking (MQTT) and geospatial search (MongoDB); automated CI/CD and Terraform IaC.'
    ],
    technologies: ['Node.js', 'MongoDB (2dsphere)', 'MySQL', 'MQTT', 'ReactJS', 'Redux', 'AWS', 'Terraform', 'Nginx']
  },
  {
    id: 'korbyt',
    company: 'Korbyt (Digital Signage)',
    role: 'Junior Node.js Engineer',
    location: 'USA [Contract]',
    period: 'Feb 2018 - Oct 2018',
    description: 'Developed desktop and kiosk signage runtime using ElectronJS and real-time Socket.IO communications.',
    highlights: [
      'Developed a Digital Signage app using ElectronJS for Embedded Windows Machines.',
      'Added features for rendering animations, playing Ads, videos, and slideshows on schedule.',
      'Worked on core Windows features like Windows registry and low-level Windows API.',
      'Designed a Real-Time Communication Portal named RMG InView using ElectronJS and Socket.IO.'
    ],
    technologies: ['Node.js', 'ElectronJS', 'Socket.IO', 'Windows API', 'Laravel', 'PostgreSQL']
  }
];

export const VIRTUAL_FILES: Record<string, string> = {
  'resume.md': `# IMRUL KAIS KHAN
**Senior Full Stack Engineer**  
Dhaka, Bangladesh — imrulkaiskhan@gmail.com  
GitHub: github.com/imrulkk89 | LinkedIn: linkedin.com/in/imrul-kais-khan | Portfolio: imrul.top | Phone: +8801777078574

---
### SUMMARY
Senior Software Engineer with 7+ years of experience specializing in scalable SaaS systems for global products. Skilled in Node.js, NestJS, Go, cloud infrastructure, and subscription-based systems, supporting tens of thousands of users across multiple regions.

---
### CORE EXPERTISE
- **Backend:** Node.js, TypeScript, Express, NestJS, Go, MQTT, REST, GraphQL
- **Databases:** MongoDB, PostgreSQL, Redis, MySQL, SQLite
- **Frontend:** React.js, Next.js, Tailwind CSS, Vue.js, Redux, SASS
- **Cloud & DevOps:** AWS (EC2, RDS, S3), GCP (GKE, BigQuery), Docker, Kubernetes, Terraform, CI/CD
- **Data & Analytics:** Airbyte ETL, Python DBT, Segment, Mixpanel, GrowthBook
`,

  'mongo-schema.json': `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PortfolioMessageCollection",
  "collection": "messages",
  "database": "portfolio_db",
  "validator": {
    "$jsonSchema": {
      "bsonType": "object",
      "required": ["name", "email", "message", "createdAt"],
      "properties": {
        "_id": { "bsonType": "objectId" },
        "name": { "bsonType": "string", "minLength": 2, "maxLength": 100 },
        "email": { "bsonType": "string", "pattern": "^.+@.+\\\\..+$" },
        "subject": { "bsonType": "string", "maxLength": 200 },
        "message": { "bsonType": "string", "minLength": 5, "maxLength": 5000 },
        "source": { "enum": ["form", "terminal", "api"] },
        "createdAt": { "bsonType": "date" },
        "ipHash": { "bsonType": "string" },
        "status": { "enum": ["received", "read", "archived"] }
      }
    }
  },
  "indexes": [
    { "key": { "createdAt": -1 } },
    { "key": { "email": 1 } },
    { "key": { "status": 1 } }
  ]
}`,

  'backend-go/main.go': `package main

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

type Message struct {
	ID        primitive.ObjectID \`bson:"_id,omitempty" json:"id"\`
	Name      string             \`bson:"name" json:"name" binding:"required"\`
	Email     string             \`bson:"email" json:"email" binding:"required,email"\`
	Subject   string             \`bson:"subject,omitempty" json:"subject"\`
	Message   string             \`bson:"message" json:"message" binding:"required"\`
	Source    string             \`bson:"source" json:"source"\`
	CreatedAt time.Time          \`bson:"createdAt" json:"createdAt"\`
}

var messageCollection *mongo.Collection

func main() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/portfolio_db"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Printf("[Go Backend] Warning: Failed to connect to MongoDB: %v", err)
	} else {
		messageCollection = client.Database("portfolio_db").Collection("messages")
		log.Println("[Go Backend] Successfully connected to MongoDB database")
	}

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "online",
			"engine":   "Golang v1.22 + Gin Framework",
			"database": "MongoDB 6.0+",
			"uptime":   time.Now().Format(time.RFC3339),
		})
	})

	router.POST("/api/messages", handleCreateMessage)
	router.GET("/api/messages", handleGetMessages)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}

func handleCreateMessage(c *gin.Context) {
	var msg Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg.CreatedAt = time.Now()
	if msg.Source == "" {
		msg.Source = "web"
	}

	if messageCollection != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		res, err := messageCollection.InsertOne(ctx, msg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save to MongoDB"})
			return
		}
		msg.ID = res.InsertedID.(primitive.ObjectID)
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Message successfully saved to MongoDB",
		"data":    msg,
	})
}

func handleGetMessages(c *gin.Context) {
	var messages []Message
	if messageCollection != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}).SetLimit(50)
		cursor, err := messageCollection.Find(ctx, bson.M{}, opts)
		if err == nil {
			cursor.All(ctx, &messages)
		}
	}
	c.JSON(http.StatusOK, gin.H{"messages": messages})
}`
};
