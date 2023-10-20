const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json());
// theFaceAdmin
// YPNyTDjcQalCrs8f

const uri = `mongodb+srv://${process.env.TF_USER}:${process.env.TF_PASS}@cluster0.unqmcva.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const cartCollection = client.db("productDB").collection("cart");
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/product/add-to-cart", async (req, res) => {
      const cartProduct = cartCollection.find();
      const result = await cartProduct.toArray();
      res.send(result);
    });

    // Add a route to get a user's cart
    app.get("/user/cart/:userEmail", async (req, res) => {
      const userEmail = req.params.userEmail;
      const cursor = cartCollection.find({ user: userEmail });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.get("/product/brand/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const cursor = productCollection.find({ brandName: brandName });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/product/add-to-cart", async (req, res) => {
      const { user, product } = req.body;

      const result = await cartCollection.insertOne({
        user: user,
        product: product,
      });

      res.send(result);
    });

    app.delete("/user/cart/:userEmail/:itemId", async (req, res) => {
      const id = req.params.itemId;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Face Store server is running");
});

app.listen(port, () => {
  console.log(`The Face store server is running on port: ${port}`);
});
