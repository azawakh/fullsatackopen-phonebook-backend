const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(
  // morgan(
  //   ":date[web] :http-version :referrer :remote-addr :remote-user :method :url :status :req[header] :user-agent :res[header] :res[content-length] - :response-time ms"
  // )
  // morgan("tiny")
  morgan((tokens, req, res) => {
    // Object.keys(tokens).forEach((key) => {
    //   console.log(`${key}: ${typeof tokens[key]}`);
    // });

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.use(bodyParser.json());

let people = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (request, response) => {
  response.send(
    `
    <html>
      <head></head>
      <body>
        <div>
          <h1>Home</h1>
          <form id="myForm" action="api/people" method="post">
            <ul>
              <li>name: <input type="text" name="name"></li>
              <li>number: <input type="phone" name="number"></li>
            </ul>
            <button>submit</button>
          </form>
        </div>
        <script>
const formEl = document.getElementById("myForm");
formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const XHR = new XMLHttpRequest();
  const form = event.target;

  const action = form.getAttribute("action");

  const FD = new FormData(form);

  const reqBody = Object.fromEntries([...FD.entries()]);

  // データが正常に送信された場合に行うことを定義します
  XHR.addEventListener("load", function(event) {
    alert(event.target.responseText);
  });

  // エラーが発生した場合に行うことを定義します
  XHR.addEventListener("error", function(event) {
    alert('Oups! Something goes wrong.');
  });

  // リクエストをセットアップします
  XHR.open("POST", action);

  XHR.setRequestHeader("Content-Type", "application/json");

  // 送信したデータは、ユーザーがフォームで提供したものです
  XHR.send(JSON.stringify(reqBody));
});
        </script>
     </body>
`
  );
});

app.get("/api/people", (request, response) => {
  response.json(people);
});

app.get("/api/people/:id", (request, response) => {
  const personId = parseInt(request.params.id, 10);
  const person = people.find((person) => person.id === personId);

  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/people/:id", (request, response) => {
  const personId = parseInt(request.params.id, 10);
  people = people.filter((person) => person.id !== personId);

  response.status(204).end();
});

app.post("/api/people", (request, response) => {
  const { body } = request;

  const { name, number } = body;

  if (!name || !number) {
    return response.status(400).json({ error: "content missing" });
  }

  if (people.some((person) => person.name === name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const personId = Math.floor(Math.random() * 1000000000000000000001);

  const person = {
    id: personId,
    name,
    number,
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
