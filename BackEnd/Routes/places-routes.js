const express = require("express");
const {check} = require('express-validator');

const router = express.Router();
const checkAuth = require("../middleware/check-auth")
const placeControllers = require('../Controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');


router.get('/:pid' , placeControllers.getPlaceById)

router.get('/user/:userid' , placeControllers.getPlacesByUserId)

router.use(checkAuth);

router.post('/' ,
    fileUpload.single('image'),
    [check('title').not().isEmpty(),
        check('description').isLength({min:5}),
        check('address').not().isEmpty()
    ] ,  placeControllers.createPlace);

router.patch('/:pid', [check('title').not().isEmpty(),
    check('description').isLength({min:5})
], placeControllers.updatePlace)

router.delete('/:pid',placeControllers.deletePlace)

module.exports = router;