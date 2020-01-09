const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

let people = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/api/people", (request, response) => {
  response.json(people);
});

app.get("/api/people/:id", (request, response) => {
  const personId = parseInt(request.params.id, 10);
  const person = people.find(person => person.id === personId);

  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/people/:id", (request, response) => {
  const personId = parseInt(request.params.id, 10);
  people = people.filter(person => person.id !== personId);

  response.status(204).end();
});

app.post("/api/people", (request, response) => {
  const { body } = request;
  const { name, number } = body;

  if (!name || !number) {
    return response.status(400).json({ error: "content missing" });
  }

  const personId = Math.floor(Math.random() * 1000000000000000000001);

  const person = {
    id: personId,
    name,
    number
  };

  people = people.concat(person);
  response.json(people);
});

app.get("/info", (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info for ${people.length} people</p>
      <p>${new Date()}</p>
    </div>`
  );
});

const PORT = 7001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
