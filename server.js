require('dotenv').config();

const express= require("express");
const app=express();

const jwt=require("jsonwebtoken");

app.use(express.json());



const posts=[
    {
        username: "kavya",
        age:21
    },
    {
        username: "lolla",
        age: 21
    },
];

// passed the middleware
app.get("/posts",authenticateToken,(req,res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

app.post("/login",(req,res) => {
    // authenticate the user
    const username=req.body.username;
    const user={name: username};
    // serialize user wuth access token
    const accesstoken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accesstoken});
})


// middleware
function authenticateToken(req,res,next){
    const authHeader= req.headers['authorization'];
    // want to get the Token portion of BEARER Token<number>
    // therefore split at space
    const token= authHeader && authHeader.split(' ')[1];

    // header token not sent
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);//do not have access
        req.user= user;
        next();//move on from middleware
    })



}

app.listen(3000, (req,res) => {
    console.log("app listening on port 3000!");
    
})