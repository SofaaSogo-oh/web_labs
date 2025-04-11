const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const documents = [
  {
      "title": "Основы JavaScript",
      "author": "Jane Smith",
      "date": "2023-03-20",
      "type": ["Книга", "Учебник"]
  },
];
let id = 1;

app.get("/api/docs", function(_, res) {
  res.send(documents);
});

app.get("/api/docs/:id", function (req, res) {
  const id = req.params.id;
  const doc_inx = documents.findIndex(item => item.id == id);
  if (doc_inx > -1)
    res.send(documents[doc_inx]);
  else
    res.status(404).send("User nor found");
});

app.post("/api/docs", function (req, res) {
  console.log("[Received]: " + JSON.stringify(req.body));
  if (!req.body) return res.sendStatus(400);
  const document = {
    title: req.body.title,
    author: req.body.author,
    date: req.body.date,
    type: req.body.type
  };
  document.id = id++;
  documents.push(document);
  res.send(document);
});

app.delete("/api/docs/:id", function(req, res){
  const id = req.params.id;
  const doc_inx = documents.findIndex(item => item.id == id);
  if (doc_inx > -1) {
    const document = documents.splice(doc_inx, 1)[0];
    res.send(document);
  } else {
    res.status(404).send("Document not found");
  }
});

app.put("/api/docs", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const id = req.body.id;
  const new_document = {
    title: req.body.name,
    author: req.body.author,
    date: req.body.date,
    type: req.body.type
  };
  const doc_inx = documents.findIndex(item => item.id == id);
  if (doc_inx > -1) {
    const document = documents[doc_inx];
    document.name = new_document.name;
    document.author = new_document.author;
    document.date = new_document.date;
    document.type = new_document.type;
    res.send(document);
  } else {
    res.status(404).send("Document not found");
  }
});

app.listen(3000, function() {
  console.log("Server awaiting for the instructions...");
  console.log("http://localhost:3000");
});