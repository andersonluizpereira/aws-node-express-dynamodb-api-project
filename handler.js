const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const hateoas = require("hateoas")({ baseUrl: "http://localhost:3000" });
const setupDynamoDBClient = require("./src/core/util/setupDynamoDB");
setupDynamoDBClient();

const HeroFactory = require("./src/core/factories/heroFactory");

hateoas.registerLinkHandler("root", function () {
  return {
    self: "/",
    users: "/users",
  };
});

const app = express();

app.use(express.json());

app.get("/users/:id", async function (req, res) {
  console.log("GET /users/:id", req.params.id);
  let hero = await HeroFactory.createInstance();
  try {
    const Item = JSON.parse(JSON.stringify(await hero.findOne(req.params.id)));
    if (Item) {
      const usersWithLinks = hateoas.link(Item, [
        { rel: "self", href: "/users" },
        { rel: "create", href: "/users", method: "POST" },
      ]);
      res.json(usersWithLinks);
    } else {
      res.status(404).json({ error: 'Could not find user with provided "id"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.get("/users", async function (req, res) {
  let hero = await HeroFactory.createInstance();
  try {
    const Item = JSON.parse(JSON.stringify(await hero.findAll()))[0];
    console.log(Item);
    if (Item) {
      const itemWithLinks = hateoas.link(Item, [
        { rel: "self", href: `/users/${Item.id}` },
        { rel: "update", href: `/users/${Item.id}`, method: "PUT" },
        { rel: "delete", href: `/users/${Item.id}`, method: "DELETE" },
      ]);
      res.json(itemWithLinks);
    } else {
      res.status(404).json({ error: 'Could not find user with provided "id"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  let hero = await HeroFactory.createInstance();
  const { name, skills } = req.body;

  if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (!Array.isArray(skills)) {
    res.status(400).json({ error: '"skills" must be an array' });
  }

  try {
    const newItem = JSON.parse(
      JSON.stringify(await hero.create({ name, skills }))
    );
    const itemWithLinks = hateoas.link(newItem, [
      { rel: "self", href: `/users/${newItem.id}` },
      { rel: "update", href: `/users/${newItem.id}`, method: "PUT" },
      { rel: "delete", href: `/users/${newItem.id}`, method: "DELETE" },
    ]);
    res.json(itemWithLinks);
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
