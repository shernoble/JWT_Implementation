require('dotenv').config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshTokens = [];

const posts = [
    { username: "kavya", age: 21 },
    { username: "lolla", age: 21 },
];

app.post("/token", (req, res) => {
    const refreshtoken = req.body.token;

    if (refreshtoken == null) return res.sendStatus(401); // Unauthorized

    if (!refreshTokens.includes(refreshtoken)) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token verification failed" });

        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const accesstoken = generateAccessToken(user);
    const refreshtoken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshtoken);

    res.json({ accessToken: accesstoken, refreshToken: refreshtoken });
});

app.delete("/logout", (req, res) => {
    const refreshtoken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshtoken);
    res.sendStatus(204); // No content
});

// Middleware function to generate access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

app.listen(4000, () => {
    console.log("App listening on port 4000!");
});
