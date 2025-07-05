const express = require("express");
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");
const placesRoutes = require("./Routes/places-routes");
const usersRoutes = require("./Routes/users-routes")
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads/images' , express.static(path.join('uploads' , 'images')));
app.use( express.static(path.join('public')));

app.get('/' , (req , res , next)=>
    {
        
        res.send("<h1>Welcome Page<h1/>");
        
    })
app.use('/api/places' , placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req , res , next)=>
{
    res.sendFile(path.resolve(__dirname , 'public' , 'index.html'));
})

// app.use((req , res , next)=>
// {
//     const error = new HttpError("Something fishy you just typed doesnt exist",404);
//     throw error;
// })

app.use((error , req , res , next)=> // this comes into play if any middleware above it goes in error state
{
    if(req.file)
    {
        fs.unlink(req.file.path , err =>
        {
            console.log(err);
        }
        )
    }
    if(res.headerSent) // helps us check that if any resposnse is send before hand or not
    {
        return next(error);
    }

    res.status(error.code || 500).json({message:error.message || 'Bad Request'});

})

mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vf6dwbk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    app.listen(process.env.PORT || 5000);
  })
.catch(err=>console.log(err));
