const express = require("express");
const morgan = require("morgan");
//const path = require('path');
const app = express();
require("dotenv").config();

app.use(express.static("build"));

console.log("hi");
app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    let body = req.body;
    return [
      JSON.stringify(body),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);


const Person = require("./models/person");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      console.log(persons);
      response.json(persons);
    })
    .catch((error) => next(error));
});
app.get("/info", (request, response) => {
  response.send(prepareInfo());
});
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  console.log(id);

  findPerson(id, response, next);
});
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const person = request.body;
  console.log(id);

  updatePerson(id, person, response, next);
});
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  deletePerson(id, response, next);
});
app.post("/api/persons", (request, response, next) => {
  const person = request.body;
  addPerson(person, response, next);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function prepareInfo() {
  let date = new Date();

  let peopleInBook = persons.length;

  let html1 = "<p>Phonebook has info for " + peopleInBook + " people </p>";
  let html2 = "<p>" + date + "</p>";

  return html1 + html2;
}
function findPerson(id, response, next) {
  return Person.findById(id)
    .then((person) => {
      response.status(200);
      response.json(person);
    })
    .catch((error) => next(error));
}
function deletePerson(id, response, next) {
  return Person.findByIdAndDelete(id)
    .then(() => {
      let code = 204;
      console.log(code);
      response.status(code);
      response.end();

      return;
    })
    .catch((error) => next(error));
}
function updatePerson(id, person, response, next) {
  return Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      let code = 200;
      console.log(code);
      response.status(code);
      response.json(result);

      return;
    })
    .catch((error) => next(error));
}

function addPerson(personObj, response, next) {
  let responseText = "";
  let code = 400;


  if (personObj === undefined) {
    console.log(code);
    response.status(code);
    response.json(responseText);
    return;
  }

  if (!personObj.name) {
    responseText = "Error: name is required";

    console.log(code);
    response.status(code);
    response.json(responseText);
    return;
  }
  if (!personObj.number) {
    console.log(code);
    response.status(code);
    response.json(responseText);
    return;
  }

  let nameObj = {};
  persons.forEach((person) => {
    nameObj[person.name] = person;
  });

  if (nameObj[personObj.name]) {
    responseText = "Error: That person already exists in the phonebook";
    console.log(code);
    response.status(code);
    response.json(responseText);
    return;
  }



  const person = new Person({
    name: personObj.name,
    number: personObj.number,
  });

  return person
    .save()
    .then((saveText) => {
      console.log(saveText);
      responseText = saveText;
      code = 200;
      console.log(code);
      response.status(code);
      response.json(responseText);
      return;
    })
    .catch((error) => next(error));
}
