const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE || "Heroes";
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = process.env.LOCALSTACK_HOST || 'localhost'
  dynamoDbClientParams.endpoint = `http://${process.env.LOCALSTACK_HOST}:${process.env.DYNAMODB_PORT}` || 'http://localhost:4566' 
  dynamoDbClientParams.accessKeyId = 'AKIANAQ2VOMFQBNO7KXE',  // needed if you don't have aws credentials at all in env
  dynamoDbClientParams.secretAccessKey = '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' // needed if you don't have aws credentials at all in env
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

app.use(express.json());

app.get("/users/:id", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      id: req.params.id,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
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
  const params = {
    TableName: USERS_TABLE
  };

  try {
    const  Item  = await dynamoDbClient.scan(params).promise();
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
  console.log("get user post");
  const { nome, poder, skills } = req.body;
  if (typeof nome !== "string") {
    res.status(400).json({ error: '"nome" must be a string' });
  } else if (typeof poder !== "string") {
    res.status(400).json({ error: '"poder" must be a string' });
  } else if (!Array.isArray(skills)) {
    res.status(400).json({ error: '"skills" must be an array' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      nome,
      poder,
      skills
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ nome, poder });
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
