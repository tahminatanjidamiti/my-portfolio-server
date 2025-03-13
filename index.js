require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://my-portfolio-website-51c67.web.app',
    'https://my-portfolio-website-51c67.firebaseapp.com',
  ],
  credentials: true
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxfhf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db('portfolioDb').collection('userClient');
    const projectCollection = client.db('portfolioDb').collection('projects');

    // new userClient
    app.post('/userClient', async (req, res) => {
        const newUserClient = req.body;
        const result = await userCollection.insertOne(newUserClient);
        res.send(result);
    });
    
    //get latest projects
    app.get('/latestProjects', async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
  });
  // Get details of a specific project by ID
  app.get('/project_details/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await projectCollection.findOne(query);
    res.send(result);
});


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('My portfolio server is running')
})

app.listen(port, () => {
    // console.log(`My portfolio server is waiting on port: ${port}`)
})