import express, { response } from 'express'; // importing epxress
import { MongoClient } from 'mongodb';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }))

const PORT = process.env.PORT;


//create connections
const MONGO_URL = process.env.MONGO_URL;//server db
const dbase = "webscrapping";
const client = new MongoClient(MONGO_URL);

//fetching function
app.get('/', async (req, res) => {
    try {
        await client.connect();
        const data = await client.db(dbase).collection("ecommerce").find({}).toArray();
        if (data.length > 0) {
            res.send(data);
        }
        else {
            res.send({
                statusCode: 404,
                message: "Data not found"
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        client.close();
    }
});

// fetching by type 
app.get('/:val', async (req, res) => {
    try {
        await client.connect();
        if (req.params.val) {
            const data = await client.db(dbase).collection("ecommerce").find({ type: req.params.val }).toArray();
            if (data.length > 0) {
                res.send(data);
            }
            else {
                res.send({
                    statusCode: 404,
                    message: "Data not found"
                });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        await client.close();
    }
});

//inserting data
app.post('/scrap', async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        const result = await client.db(dbase).collection("ecommerce").insertMany(data);
        res.status(201).send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await client.close();
    }
});


app.listen(PORT, () => {
    console.log(`server is listening to the port ${PORT}`);
});