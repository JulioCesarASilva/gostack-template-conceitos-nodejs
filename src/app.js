const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4")

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositorieId(req, res, next) {
  const {id} = req.params;

  if (!isUuid(id)) 
    return res.status(400).json({error: "Invalid project ID"})

  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {url,title,techs} = request.body

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository)

  response.json(repository)
});

app.put("/repositories/:id", validateRepositorieId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0) return response.status(400).json({error: 'Repository not found.'});

  const { likes } = repositories[repositoryIndex];
  const repository = {
    id, 
    title, 
    url, 
    techs, 
    likes
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositorieId, (request, response) => {
  const {id} = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repositorieIndex < 0) 
    return response.status(400).json({error: "Repositorie not found"})

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", validateRepositorieId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0 ) return response.status(400).json({error: 'Repository not found.'});

  const repository = repositories[repositoryIndex];
  
  repository.likes += 1;

  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

module.exports = app;
