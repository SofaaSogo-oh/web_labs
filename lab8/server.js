const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Схема Mongoose
const documentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    type: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.every(item => typeof item === 'string' && item.trim() !== "");
            },
            message: 'Type must be a non-empty array of strings'
        }
    }
});

const Document = mongoose.model("Document", documentSchema);

// Подключение к MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/librarydb");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectToDatabase();

// Routes

// GET all documents
app.get("/api/docs", async function(_, res) {
    try {
        const documents = await Document.find();
        res.send(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents");
    }
});

// GET a document by ID
app.get("/api/docs/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        if (document) {
            res.send(document);
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).send("Error fetching document");
    }
});

// POST a new document
app.post("/api/docs", async function (req, res) {
    console.log("[Received]: " + JSON.stringify(req.body));
    if (!req.body) return res.sendStatus(400);

    const documentData = {
        title: req.body.title,
        author: req.body.author,
        date: req.body.date, // Mongoose будет преобразовывать строку в Date, если формат правильный
        type: req.body.type
    };

    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
        res.status(201).send(newDocument); // Отправляем статус 201 (Created)
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(400).send(error.message); // Отправляем сообщение об ошибке валидации
    }
});

// DELETE a document by ID
app.delete("/api/docs/:id", async function(req, res){
    const id = req.params.id;
    try {
        const document = await Document.findByIdAndDelete(id);
        if (document) {
            res.send(document);
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).send("Error deleting document");
    }
});

// PUT (update) a document
app.put("/api/docs/:id", async function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const id = req.params.id;
    const updateData = {
        title: req.body.title,
        author: req.body.author,
        date: req.body.date,
        type: req.body.type
    };

    try {
        const updatedDocument = await Document.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }); // runValidators: true для проверки валидации при обновлении
        if (updatedDocument) {
            res.send(updatedDocument);
        } else {
            res.status(404).send("Document not found");
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(400).send(error.message); // Отправляем сообщение об ошибке валидации
    }
});


// Start server
const port = 3000;
app.listen(port, function() {
    console.log(`Server awaiting for instructions on port ${port}...`);
    console.log(`http://localhost:${port}`);
});