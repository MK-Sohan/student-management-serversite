const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7dvg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("students-container");
    const allStudentsCollection = database.collection("studentslist");

    app.get("/allstudents", async (req, res) => {
      const query = {};
      const result = await allStudentsCollection.find(query).toArray();

      res.send(result);
    });
    app.get("/detail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allStudentsCollection.findOne(query);
      res.send(result);
    });
    app.post("/addstudent", async (req, res) => {
      const info = req.body;
      console.log(info);
      const result = await allStudentsCollection.insertOne(info);
      res.send(result);
    });
    app.put("/updatestudent/:id", async (req, res) => {
      const id = req.params.id;
      const info = req.body;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: info,
      };
      const result = await allStudentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.delete("/deltestudent/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allStudentsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("student project is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
