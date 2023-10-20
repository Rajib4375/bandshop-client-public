const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleWare 
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjmj59i.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


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
    await client.connect();

    const productsCollection = client.db('productsDB').collection('products');

    app.get('/bands/:brand_name', async(req, res)=>{
        const bandName = req.params.brand_name;
        const cursor = productsCollection.find({band_name:bandName});
        const result = await cursor.toArray();
        res.send(result); 
    })
    
   app.get('/products/:id', async(req, res)=>{
    const id =req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await productsCollection.findOne(query);
    res.send(result)
   })

    app.post('/products', async(req, res)=>{
        const newProducts = req.body;
        console.log(newProducts);
       const result = await productsCollection.insertOne(newProducts);
       res.send(result)
    })

    app.put('/products/:id', async(req, res)=>{
        const id= req.params.id;
        const filtar ={_id: new ObjectId(id)}
        const options ={upsert: true};
        const updatedProduct = req.body;
        const product ={
            $set:{
                name:updatedProduct.name,
                category:updatedProduct.category, 
                image:updatedProduct.image, 
                price:updatedProduct.price, 
                description:updatedProduct.description, 
                reating :updatedProduct.reating, 
                band_name :updatedProduct.band_name
            }

        }
        const result = await productsCollection.updateOne(filtar, product, options);
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Technology and Electronics Server is Running')
})
app.listen(port, ()=>{
    console.log(`Technology and Electronics Server is Running on port:${port} `)
})
