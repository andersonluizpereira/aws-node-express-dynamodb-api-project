const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const setupDynamoDBClient = require('./src/core/util/setupDynamoDB');
setupDynamoDBClient();

const HeroFactory = require('./src/core/factories/heroFactory');

const app = express();

app.use(express.json());

app.get("/users/:id", async function (req, res) {
  console.log("GET /users/:id", req.params.id);
  let hero = await HeroFactory.createInstance()
  try {
    const Item = await hero.findOne(req.params.id);
    if (Item) {
      res.json({ Item });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "id"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.get("/users", async function (req, res) {
  let hero = await HeroFactory.createInstance()
  try {
    const  Item  = await hero.findAll();
    if (Item) {
      res.json({ Item });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "id"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  let hero = await HeroFactory.createInstance()
  const { name, skills } = req.body;

  if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (!Array.isArray(skills)) {
    res.status(400).json({ error: '"skills" must be an array' });
  }
 

  try {
    await hero.create({ name, skills });
    res.json({ name, skills });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
