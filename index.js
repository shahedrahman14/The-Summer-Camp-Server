const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ekmhn7.mongodb.net/?retryWrites=true&w=majority`;

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
    const classCollection = client.db("summerCamp").collection("class");
    const instructorsCollection = client
      .db("summerCamp")
      .collection("instructors");
    const selectedCollection = client.db("summerCamp").collection("selected");

    // getting class data 
    app.get("/class", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });
    // getting instructors data
    app.get("/instructors", async (req, res) => {
      const result = await instructorsCollection.find().toArray();
      res.send(result);
    });

    app.get('/selected',async(req,res)=>{
      const email =req.query.email
      
      if(!email){
        res.send([])
      }
      const query = { email: email };
      const result=await selectedCollection.find(query).toArray()
      res.send(result)
    })
    // delete method
    app.delete('/selected/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id: new ObjectId(id)}
      const result=await selectedCollection.deleteOne(query)
      return res.send(result)
    })

    // sending selected class data to mongodb 
    app.post("/selected", async (req, res) => {
      const selectedItem = req.body;
      const result = await selectedCollection.insertOne(selectedItem);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
