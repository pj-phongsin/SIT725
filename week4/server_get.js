const express= require("express");
const app= express();
const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://jphongsin:xa7jjaPBiQm3t1PC@cluster0.gsqsjgi.mongodb.net/"
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('public'));
app.use(express.json());

const addTwoNumber= (n1,n2) => {
    return n1+n2;
}
app.get("/addTwoNumber", (req,res)=>{
    // const n1= parseInt(req.query.n1);
    // const n2= parseInt(req.query.n2);
    const n1=5;
    const n2=10;
    const result = addTwoNumber(n1,n2);
    res.json({statuscocde:200, data: result }); 
});         
app.get("/Display", (req, res) => {
    const n1 = "<html><body><H1>HELLO THERE </H1></body></html>";
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(n1));     
})

app.post("/getMoviesByYear", async (req, res) => {
    const startYear = parseInt(req.query.startYear);
    const endYear = parseInt(req.query.endYear);

    if (isNaN(startYear) || isNaN(endYear)) {
        return res.json({ statusCode: 400, message: "Invalid year range" });
    }

    try {
        await client.connect();
        const database = client.db('sample_mflix');
        const movies = database.collection('movies');
        const query = { year: { $gte: startYear, $lte: endYear } };
        const movieList = await movies.find(query).limit(20).toArray();
        res.json({ statusCode: 200, data: movieList });
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, message: "Internal Server Error" });
    } finally {
        await client.close();
    }
});

console.log (addTwoNumber(19,12));
const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port "+port);
})