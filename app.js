// package  imports
const express = require("express");
const bodyParser = require("body-parser");

// local imports
const parameters = require("./config/params");
const apiRoute = require("./routes/api");

// imports initialization
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", apiRoute);

const PORT = process.env.PORT || parameters.LOCAL_PORT;
app.listen( PORT, () => {
    console.log(`server started on port ${PORT}`);
});
