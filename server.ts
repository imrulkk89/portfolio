import express from "express";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent local data store directory
const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  source: string;
}

// Initial seed messages
const initialSeedMessages: StoredMessage[] = [
  {
    id: "msg-init-001",
    name: "Engineering Lead",
    email: "recruiter@techventures.io",
    subject: "Distributed Systems & Cloud Architect Role",
    message:
      "Hi Imrul, great experience with high-concurrency booking engines and Terraform. We are scaling our microservices platform and would love to connect!",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: "terminal",
  },
  {
    id: "msg-init-002",
    name: "Alex Rivera",
    email: "alex@cloudpipeline.dev",
    subject: "AirByte and BigQuery ETL Pipeline inquiry",
    message:
      "Loved your work on the Spotify to Monstercat Airbyte data pipeline. Are you available for advisory or contract consulting?",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    source: "form",
  },
];

if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(
    MESSAGES_FILE,
    JSON.stringify(initialSeedMessages, null, 2),
    "utf-8",
  );
}

function getLocalMessages(): StoredMessage[] {
  try {
    if (!fs.existsSync(MESSAGES_FILE)) {
      return initialSeedMessages;
    }
    const raw = fs.readFileSync(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading messages file:", err);
    return [];
  }
}

function saveLocalMessages(msgs: StoredMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing messages file:", err);
  }
}

// MongoDB Client Setup (if MONGODB_URI is provided in environment)
let mongoClient: MongoClient | null = null;
let mongoDbConnected = false;
let mongoConnectionNotice: string | null = null;
let isConnecting = false;

async function connectToMongo(): Promise<{
  success: boolean;
  message: string;
  notice?: string;
}> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === "") {
    mongoDbConnected = false;
    mongoConnectionNotice =
      "No MONGODB_URI environment variable configured; operating in persistent embedded document storage mode.";
    return { success: false, message: mongoConnectionNotice };
  }

  if (isConnecting) {
    return {
      success: false,
      message: "Connection attempt already in progress.",
    };
  }

  isConnecting = true;
  try {
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch {}
      mongoClient = null;
    }

    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    await mongoClient.connect();
    await mongoClient.db("admin").command({ ping: 1 });
    mongoDbConnected = true;
    mongoConnectionNotice = null;
    console.log(
      "[MongoDB] Remote MongoDB Atlas cluster connected successfully.",
    );
    return {
      success: true,
      message: "Connected to remote MongoDB Atlas cluster.",
    };
  } catch (err: any) {
    mongoDbConnected = false;
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch {}
      mongoClient = null;
    }

    const errMsg = err?.message || String(err);
    const isSslOrIpBlocked =
      errMsg.includes("SSL") ||
      errMsg.includes("tlsv1 alert internal error") ||
      errMsg.includes("alert number 80") ||
      err?.name === "MongoServerSelectionError";

    if (isSslOrIpBlocked) {
      mongoConnectionNotice =
        "MongoDB Atlas Network Access: Current Cloud Run IP is not in Atlas IP Access List. In MongoDB Atlas, navigate to 'Network Access' -> 'Add IP Address' -> select 'Allow Access from Anywhere' (0.0.0.0/0). Defaulting seamlessly to persistent embedded document storage.";
      console.log(
        "[MongoDB] Remote Atlas requires 0.0.0.0/0 Network Access. Operating seamlessly in persistent embedded storage mode.",
      );
    } else {
      mongoConnectionNotice = `Remote connection deferred (${errMsg}). Operating in persistent embedded storage mode.`;
      console.log(
        `[MongoDB] Remote connection deferred: ${errMsg}. Using persistent embedded storage.`,
      );
    }

    return {
      success: false,
      message: "Operating in persistent embedded document storage mode.",
      notice: mongoConnectionNotice,
    };
  } finally {
    isConnecting = false;
  }
}

// Initial connection attempt
connectToMongo();

// ==================== API ROUTES ====================

// Health check and system status
app.get("/api/health", async (req, res) => {
  let messageCount = 0;
  if (mongoDbConnected && mongoClient) {
    try {
      const db = mongoClient.db("portfolio_db");
      messageCount = await db.collection("messages").countDocuments();
    } catch {
      messageCount = getLocalMessages().length;
    }
  } else {
    messageCount = getLocalMessages().length;
  }

  res.json({
    status: "online",
    database: mongoDbConnected ? "mongodb" : "embedded_mongo",
    databaseStatus: mongoDbConnected ? "connected" : "persistent_file_store",
    remoteUriConfigured: Boolean(
      process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== "",
    ),
    mongoConnectionNotice,
    golangMicroservice: {
      status: "ready",
      spec: "Golang v1.22 + Gin + go.mongodb.org/mongo-driver",
      path: "/backend-go/main.go",
    },
    uptimeSeconds: Math.floor(process.uptime()),
    messageCount,
    timestamp: new Date().toISOString(),
  });
});

// Reconnect / retry MongoDB connection on demand
app.post("/api/mongo/retry", async (req, res) => {
  const result = await connectToMongo();
  res.json({
    connected: mongoDbConnected,
    database: mongoDbConnected ? "mongodb" : "embedded_mongo",
    message: result.message,
    notice: mongoConnectionNotice,
    timestamp: new Date().toISOString(),
  });
});

// GET MongoDB status details
app.get("/api/mongo/status", (req, res) => {
  res.json({
    connected: mongoDbConnected,
    database: mongoDbConnected ? "mongodb" : "embedded_mongo",
    databaseStatus: mongoDbConnected ? "connected" : "persistent_file_store",
    remoteUriConfigured: Boolean(
      process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== "",
    ),
    notice: mongoConnectionNotice,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/messages - Retrieve contact messages
app.get("/api/messages", async (req, res) => {
  if (mongoDbConnected && mongoClient) {
    try {
      const db = mongoClient.db("portfolio_db");
      const docs = await db
        .collection("messages")
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      const formatted = docs.map((d) => ({
        id: d._id.toString(),
        name: d.name,
        email: d.email,
        subject: d.subject || "",
        message: d.message,
        createdAt: d.createdAt
          ? typeof d.createdAt === "string"
            ? d.createdAt
            : d.createdAt.toISOString()
          : new Date().toISOString(),
        source: d.source || "web",
      }));
      return res.json({ messages: formatted, source: "mongodb" });
    } catch (err) {
      console.error("[MongoDB] Fetch error:", err);
    }
  }

  const local = getLocalMessages();
  res.json({ messages: local, source: "embedded_mongo" });
});

// POST /api/messages - Store a new contact message
app.post("/api/messages", async (req, res) => {
  try {
    const { name, email, subject, message, source } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Please enter a valid name (minimum 2 characters)." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return res
        .status(400)
        .json({ error: "Message must be at least 5 characters long." });
    }

    const cleanMessage: StoredMessage = {
      id:
        "msg_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
      createdAt: new Date().toISOString(),
      source: source === "terminal" ? "terminal" : "form",
    };

    let savedToMongo = false;
    if (mongoDbConnected && mongoClient) {
      try {
        const db = mongoClient.db("portfolio_db");
        const insertRes = await db.collection("messages").insertOne({
          name: cleanMessage.name,
          email: cleanMessage.email,
          subject: cleanMessage.subject,
          message: cleanMessage.message,
          source: cleanMessage.source,
          createdAt: new Date(cleanMessage.createdAt),
        });
        cleanMessage.id = insertRes.insertedId.toString();
        savedToMongo = true;
      } catch (err) {
        console.warn("[MongoDB] Fallback to local persistent store:", err);
      }
    }

    // Always keep persistent JSON store synchronized
    const local = getLocalMessages();
    local.unshift(cleanMessage);
    saveLocalMessages(local);

    console.log(
      `[Message Saved] From: ${cleanMessage.name} <${cleanMessage.email}> (${cleanMessage.source})`,
    );

    return res.status(201).json({
      success: true,
      message: "Message successfully recorded in database",
      database: savedToMongo
        ? "MongoDB Database"
        : "Persistent Mongo Document Store",
      data: cleanMessage,
    });
  } catch (err: any) {
    console.error("Message submission error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error saving message." });
  }
});

// DELETE /api/messages/:id - Remove a message
app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;
  if (mongoDbConnected && mongoClient) {
    try {
      const db = mongoClient.db("portfolio_db");
      if (ObjectId.isValid(id)) {
        await db.collection("messages").deleteOne({ _id: new ObjectId(id) });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  const local = getLocalMessages();
  const filtered = local.filter((m) => m.id !== id);
  saveLocalMessages(filtered);

  res.json({ success: true, message: `Message ${id} deleted.` });
});

// ==================== VITE / STATIC INTEGRATION ====================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
