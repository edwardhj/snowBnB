const express = require('express');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [{model: SpotImage,}, {model: Review}]
    });

    // Create an array of Spots & convert spots to a POJO
    const spotsList = [];
    spots.forEach( spot => spotsList.push(spot.toJSON()) );

    // Remove Reviews & create avgRating key
    spotsList.forEach(spot => {
        let sum = 0;
        let spots = 0;
        spot.Reviews.forEach(review => {
            if (review.stars){
                sum += review.stars;
                spots ++;
                spot.avgRating = (sum / spots);
            };
        });
        if (!spot.avgRating) spot.avgRating = 'no ratings available';
        delete spot.Reviews;
    });

    // Remove SpotImages & create previewImage key
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) spot.previewImage = image.url;
        });
        if (!spot.previewImage) spot.previewImage = 'no preview image available';
        delete spot.SpotImages;
    });

    res.json({Spots: spotsList});
});

router.get('/current', requireAuth, async (req, res) => {
    // requireAuth middleware is used to require Authentication
    const userId = req.user.id;

    // Finding spots owned by the userId
    const spots = await Spot.findAll({
        where: { ownerId: userId },
        include: [{model: SpotImage,}, {model: Review}]
    });

    // Create an array of Spots & convert spots to a POJO
    const spotsList = [];
    spots.forEach( spot => spotsList.push(spot.toJSON()) );

    // Remove Reviews & create avgRating key
    spotsList.forEach(spot => {
        let sum = 0;
        let spots = 0;
        spot.Reviews.forEach(review => {
            if (review.stars){
                sum += review.stars;
                spots ++;
                spot.avgRating = (sum / spots);
            };
        });
        if (!spot.avgRating) spot.avgRating = 'no ratings available';
        delete spot.Reviews;
    });

    // Remove SpotImages & create previewImage key
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) spot.previewImage = image.url;
        });
        if (!spot.previewImage) spot.previewImage = 'no preview image available';
        delete spot.SpotImages;
    });

    res.json({Spots: spotsList});
});

// Get details for a Spot from an id
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    const id = parseInt(spotId, 10);

    const spot = await Spot.findByPk(id, 
        {
            include: [
                {model: SpotImage, attributes: ['id', 'url', 'preview']}, 
                {model: Review}, 
                {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}
            ]
        }
    );

    // Error when Spot with specified id couldn't be found
    if (!spot){
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    // Create an array of Spots & convert spots to a POJO
    const spotsList = [];
    spotsList.push(spot.toJSON());
    
    // Remove Reviews & create avgRating key
    spotsList.forEach(spot => {
        let sum = 0;
        let spots = 0;
        spot.numReviews = 0;
        spot.Reviews.forEach(review => {
            spot.numReviews++;
            if (review.stars){
                sum += review.stars;
                spots ++;
                spot.avgStarRating = (sum / spots);
            };
        });
        if (!spot.avgStarRating) spot.avgStarRating = 'no ratings available';
        delete spot.Reviews;
    });

    const theSpot = spotsList[0];

    res.json(theSpot);
});

// Create a spot
router.post('/', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpotData = {
        ownerId: userId,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    };

    const err = new Error('Bad Request');
    err.errors = {};
    err.status = 400;

    if (!address) err.errors.address = 'Street address is required';
    if (!city) err.errors.city = 'City is required';
    if (!state) err.errors.state = 'State is required';
    if (!country) err.errors.country = 'Country is required';
    if (!lat) err.errors.lat = 'Latitude must be within -90 and 90';
    if (!lng) err.errors.lng = 'Longitude must be within -180 and 180';
    if (!name) err.errors.name = 'Name must be less than 50 characters';
    if (!description) err.errors.description = 'Description is required';
    if (!price) err.errors.price = 'Price per day must be a positive number';

    if (Object.keys(err.errors)[0]) throw err;


    const newSpot = await Spot.create(newSpotData);

    return res.status(201).json(newSpot);

});


module.exports = router;