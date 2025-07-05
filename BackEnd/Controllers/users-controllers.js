const { v4: uuid } = require('uuid');
const {validationResult} = require('express-validator');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require('../models/http-error');



const getUsers = async(req, res, next) => {
  
  let users;

  try
  {
    users = await User.find({} , '-password');// gets everything just not the password
  }
  catch
  {
    return next(new HttpError("cant extract users",404));
  }

  res.status(201).json({users:users.map(users=>users.toObject({getters:true}))});

};

const signup = async(req, res, next) => {
  const { name, email, password} = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed' , 422));
  }

  
  let existinguser;

  try
  {
    existinguser = await User.findOne({email : email});
  }
  catch
  {
    return next(new HttpError('Signup failed try again!!' , 422));
  }

  if(existinguser)
  {
    return next(new HttpError("user already exists",422));
  }

  let hashedPassword; 

  try
  {
    hashedPassword = await bcrypt.hash(password , 12);

  }
  catch(err)
  {
    return next(new HttpError("could not create user please try again",500))
  }


  const createdUser = new User(
    {
      name,
      email,
      password : hashedPassword,
      image:req.file.path,
      place:[]

    }
  )

  try{await createdUser.save()}
  catch{return next(new HttpError("failed to create new place" , 422))};

  let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async(req, res, next) => {
  const { email, password } = req.body;

  let existinguser;

  try
  {
    existinguser = await User.findOne({email : email});
  }
  catch
  {
    return next(new HttpError('Signup failed try again!!' , 422));
  }

  if (!existinguser) {
    return next(new HttpError('Could not identify user, credentials seem to be wrong.', 401));
  }

  let isValidPassword = false;

  try
  {
    isValidPassword = await bcrypt.compare(password , existinguser.password)
  }
  catch(err)
  {
    return next(new HttpError('couldnt log you in wrong credentials', 500));
  }

  if(!isValidPassword)
  {
    return next(new HttpError('couldnt log you in wrong credentials', 500));
  }
  

  let token;
    try {
      token = jwt.sign(
        { userId: existinguser.id, email: existinguser.email },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res.json({
      userId: existinguser.id,
      email: existinguser.email,
      token: token
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
