const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2o6q0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database connection successful.");
    const database = client.db("mr-watch-house");
    const productsCollection = database.collection("products");

    // Get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      return res.json(products);
    });

    const ordersCollection = database.collection("orders");
    app.post("/order", async (req, res) => {
      const order = req.body;
      // console.log(order);
      order.status = "pending";
      const cursor = await ordersCollection.insertOne(order);
      res.json({
        message: "your order successfully placed. We will notify you soon.",
      });
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the MR Watch House Server!!!");
});

app.listen(port, () => {
  console.log("Server listening at port ", port);
});
