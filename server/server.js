const express = require("express");
const redis = require("redis");
const app = express();
let redisClient;
app.use(express.json());

// Redis connection
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.log("redis error" + error));
  await redisClient.connect();
  console.log("connect success");
})();

app.get("/get", async (req, res) => {
  const cachedData = await redisClient.get("food");
  if (cachedData != null) {
    res.send(JSON.parse(cachedData));
    return;
  } else {
    const response = {};
    await redisClient.set("food", JSON.stringify(response));
    setTimeout(() => {
      res.send(response);
    }, 3000);
  }
});

app.post("/create", async (req, res) => {
  const requestData = req.body;
  if (!requestData) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  await redisClient.set("food", JSON.stringify(requestData));
  setTimeout(() => {
    res.send(requestData);
  }, 3000);
});

app.listen(1102, () => {
  console.log("server started port 1102");
});
