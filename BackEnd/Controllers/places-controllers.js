const { v4: uuid } = require('uuid');
const fs = require('fs');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const Place = require("../models/Place");
const getCoordsForAddress = require('../util/getCoordsForAddress');
const User = require("../models/user");
const { default: mongoose } = require('mongoose');



const getPlaceById = async(req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;

  try{
    place =  await Place.findById(placeId);
  }
  catch(err)
  {
    return next(err);
  }
  



  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404)); // works for sync
  }

  res.json({place: place.toObject({getters:true})}); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async(req, res, next) => {
   const userId = req.params.userid;
  console.log("Incoming userId:", userId); // ✅ step 1

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
    console.log("User found:", userWithPlaces); // ✅ step 2
  } catch (err) {
    console.error("DB error:", err); // ✅ step 3
    return next(new HttpError('Could not fetch user places.', 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('No places found for this user.', 404));
  }

  res.json({
    places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
  });
};



const createPlace = async(req , res , next)=>
{
  const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed' , 422));
  }
  const {title , description , address} = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address); // ⬅️ Your converted lat/lng
  } catch (error) {
    return next(error);
  }

  console.log("req.file:", req.file); 

  const createdPlace = new Place(
    {
    title,
    description,
    image:req.file ?  req.file.path.replace(/\\/g, '/') : req.body.image,
    location:coordinates,
    address,
    creator : req.userData.userId
  }
  )
  // only if we have the user created with the corresponding id we are allowed to create places

  let user;

  try
  {
    user = await User.findById(req.userData.userId);// we want to check that if the creator of the place exists in the user collection or not
  }
  catch
  {
    return next(new HttpError("Creating place failed, Please try again",500));
  }

  if(!user)
  {
    return next(new HttpError("Cannot find user for the provided id"),404);
  }
  // now here we are working with transactions which ensures that every thing runs or none
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({session : sess});// Saves the new place inside the transaction.
    //This change won’t be final until commitTransaction() is called.


    user.places.push(createdPlace)//remember this only sends the object id of the created place this push extracts the object id specifically.
    await user.save({session : sess});//Saves the updated user (with the new place ID in its array) inside the same transaction.
    await sess.commitTransaction();//Commits the whole transaction. Now:

    //The Place is saved.

    //The User is updated.

    //If any of the above steps fail, nothing will be saved.

}
catch(err)
{
  console.log(err);
  return next(err);
}

  res.status(201).json({createdPlace});
}

const updatePlace = async(req , res , next)=>
{
  const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    console.log(errors);
    throw new HttpError('Invalid inputs passed' , 422);
  }

  const{title , description} = req.body;
  const placeId = req.params.pid;

  let place;

  try
  {
    place = await Place.findById(placeId);
  }
  catch
  {
    return next(new HttpError("Place has not been updated Successfully" , 404));
  }

  if (place.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
        'You are not allowed to edit this place.',
        401
      );
      return next(error);
    }
  
  place.title = title;
  place.description = description;

  await place.save();

  res.status(200).send({place : place.toObject({getters:true})});
}

const deletePlace = async(req , res , next)=>
{
  const PlaceId = req.params.pid;

  let place;

  try
  {
    place = await Place.findById(PlaceId).populate('creator');
  }
  catch
  {
    return next(new HttpError("place not deleted",500));
  }
  if(!place)
    {
      return next(new HttpError("place notee deleted",500));
    }

    if(place.creator.id !== req.userData.userId)
    {
       const error = new HttpError(
        'You are not allowed to edit this place.',
        401
      );
      return next(error);
    }
    
    const imagePath = place.image;

    try
    {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await place.deleteOne({_id : place._id},{session:sess});
      place.creator.places.pull(place);// again this pull only sends the object id and pull means removing that id from that document
      await place.creator.save({session:sess});
      await sess.commitTransaction();
    }

  
  catch
  {
    return next(new HttpError("place not deleted",500));
  }
  fs.unlink(imagePath , err=>
  {
    console.log(err);
  })

  res.status(200).json({place:place});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;