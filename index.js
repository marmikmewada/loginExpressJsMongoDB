const express = require("express");
const app = require("express")();
const port = 3000;
const bodyParser = require("express").json;

// addig router here in the name of userRouter variable to use it in the middleware below
const UserRouter = require("./api/User");
//mongo db file
require("./config/db");

// for accepting post form data

app.use(express.json());

app.use("/user", UserRouter);

app.listen(port, ()=>{
    console.log(`app running on port ${port}`);
})

