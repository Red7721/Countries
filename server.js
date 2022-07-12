const express = require("express");
const mongo = require("mongodb").MongoClient;
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());


const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());


var uri = "mongodb+srv://newUser:1234@countries.dfqnaff.mongodb.net/?retryWrites=true&w=majority";

var database, collection;
const options = {
useNewUrlParser: true,
}

app.listen(PORT, () => {
    mongo.connect(uri, options, (error, client) => {

        if(error) {
            throw error;
        }
        database = client.db('countries_db');
        collection = database.collection("countries");
        console.log("Database connection establisted!");

    console.log(`Server listening on ${PORT}`);
});
});
    
app.get("/countries", (req, res) => {
    collection.find().sort({ID: 1}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send({result: result});
    })
})
