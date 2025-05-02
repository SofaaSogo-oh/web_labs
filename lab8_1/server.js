// const express = require("express");
// const mysql = require("mysql2");

// const app = express();
// app.use(express.json());
// app.use(express.static("public"));

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "bookdb",
// }).promise();

// const documentsTableName = 'documents';
// (async ()=> {
//     await db.query("select 1 + 1 as sltn")
//         .then(([row, fields]) => {
//             console.log(row);
//         }).catch(err => {
//             console.log(err);
//         });
// })();
// (async () => {
//     await db.query(
//         `CREATE TABLE IF NOT EXISTS ${documentsTableName} (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           title VARCHAR(255) NOT NULL,
//           author VARCHAR(255) NOT NULL,
//           date DATE,
//           type VARCHAR(255)
//         )`)
//         .then(_ => {
//          console.log('Documents table created (or already exists)');
//         }).catch(([error, _]) => {
//             console.error('Error creating documents table:', error);
//         })
// })();

// app.get("/api/docs", async function (_, res) {
//     await db.query(`select * from ${documentsTableName}`)
//         .then(([row, _]) => {
//             res.send(row);                
//             console.log(row);
//         }).catch(err => {
//             console.error("Error fetching documents:", err);
//             res.status(500).send("Error fetching documents");
//         })
// })

// app.post("/api/docs", async function(req, resp) {
//     console.log("[Received]: " + JSON.stringify(req.body));
//     if (!req.body) return res.sendStatus(400);

//     const {title, author, date, type} = req.body;
//     const typeString = Array.isArray(type) ? type.join(',') : type;

//     await db.query(`INSERT INTO ${documentsTableName} (title, author, date, type) VALUES (?, ?, ?, ?)`, 
//     [title, author, date, typeString])
//         .then(([res, _]) => {
//             resp.status(201).send(res);
//             console.log(res);
//         }).catch(err => {
//             console.error("Error creating document:", err);
//             res.status(400).send(err.message); // Отправляем сообщение об ошибке валидации
//         });
// })

// // // Start server
// const port = 3000;
// app.listen(port, function() {
//     console.log(`Server awaiting for instructions on port ${port}...`);
//     console.log(`http://localhost:${port}`);
// });

//////////////////////////////////////////////////////////////////////////
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is correctly set


// Sequelize connection
const sequelize = new Sequelize("bookdb", "root", null, { // Replace 'password' with your actual password if you have one
  host: "localhost",
  dialect: "mysql",
  logging: false, // Disable logging SQL queries to console
});

// Define the Document model
const Document = sequelize.define("Document", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('type');
        return rawValue ? rawValue.split(',') : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('type', value.join(','));
        } else {
          this.setDataValue('type', value);
        }
      }
    },
  }, {
    timestamps: false,  // Disable createdAt and updatedAt
  });

// Test the database connection and sync the model
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate the table (use with caution!) or { alter: true } to update table schema
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Routes
app.get("/api/docs", async function (req, res) {
  try {
    const documents = await Document.findAll();
    res.json(documents); // Send as JSON
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Error fetching documents");
  }
});

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
    const newDocument = await Document.create(documentData);
    res.status(201).json(newDocument); // Send the created document
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(400).send(error.message); // Send the validation error message
  }
});


// Example route for rendering EJS template
app.get('/view', async (_, res) => {
  try {
    const documents = await Document.findAll();
    res.render('index', { documents }); // Render the 'index.ejs' template with the documents
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Error fetching documents");
  }
});


// Start server
const port = 3000;
app.listen(port, function () {
  console.log(`Server awaiting for instructions on port ${port}...`);
  console.log(`http://localhost:${port}`);
}); 