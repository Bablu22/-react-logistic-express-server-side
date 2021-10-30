const express = require('express')
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqmxk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()

        // create database
        const database = client.db("Assignment-11");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("ordes")

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray()
            res.send(orders)
        })

        // GET Orders by single email address
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const orders = await ordersCollection.find(query).toArray()
            res.send(orders)
        })

        //Detele API
        app.delete('/orders/:email/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: ObjectId(id), }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)

        })
        app.delete('/services/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: ObjectId(id), }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
            console.log('deleted')
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: ObjectId(id), }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)

        })

        // GET Single data API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.find(query).toArray()
            res.send(service)
        })

        // POST API
        app.post('/orders', async (req, res) => {
            const info = req.body
            const result = await ordersCollection.insertOne(info)
            res.json(result)
        })
        // POST SERVICE API
        app.post('/services', async (req, res) => {
            const info = req.body
            const result = await servicesCollection.insertOne(info)
            res.send(result)
        })
        // UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "approved",
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})