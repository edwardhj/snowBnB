const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const spotValidationErrors = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({min: -90, max: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({min: -180, max: 180})
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({max: 50})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true})
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({min:0.01})
      .withMessage('Price per day must be a positive number'),  
    handleValidationErrors
];

const spotEditValidationErrors = [
    check('address')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .optional()
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({min: -90, max: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .optional()
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({min: -180, max: 180})
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .optional()
      .exists({ checkFalsy: true })
      .isLength({max: 50})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .optional()
      .exists({ checkFalsy: true})
      .withMessage('Description is required'),
    check('price')
      .optional()
      .exists({ checkFalsy: true })
      .isFloat({min:0.01})
      .withMessage('Price per day must be a positive number'),  
    handleValidationErrors
];

const bookingValidationErrors = [
    check('startDate')
        .exists()
        .isAfter(new Date().toString())
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists()
        .custom((value, { req }) => {
            if(new Date(value) <= new Date(req.body.startDate)) {
                throw new Error ('endDate cannot be on or before startDate');
            };
            return true;
        }),
    handleValidationErrors
];

const spotQueryValidationErrors = [
    check('page')
        .optional()
        .isInt({ min: 1, max: 10})
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1, max: 20})
        .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
        .optional()
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional()
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional()
        .isDecimal()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isDecimal()
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0})
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];


// Get all Spots
router.get('/', spotQueryValidationErrors, async (req, res) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const where = {};
    if (minLat || maxLat) where.lat = { [Op.between]: [minLat, maxLat] };
    if (minLng || maxLng) where.lng = { [Op.between]: [minLng, maxLng] };
    if (minPrice || maxPrice) where.price = { [Op.between]: [minPrice, maxPrice] };

    const spots = await Spot.findAll({
        where: where,
        offset: (page - 1) * size,
        limit: size,
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

    let pageInt = parseInt(page, 10);
    let sizeInt = parseInt(size, 10);

    res.json({
        Spots: spotsList,
        page: pageInt,
        size: sizeInt
    });
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

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const spot = await Spot.findByPk(id);

    const reviews = await Review.findAll({
        where: { spotId: id},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    // Error when Spot with specified id couldn't be found
    if (!spot){
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    res.json({Reviews: reviews});
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;

    const spot = await Spot.findByPk(id, {
    });
    
    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    // if you are NOT the owner of the spot
    if (spot.ownerId !== userId){
        const bookings = await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['spotId', 'startDate', 'endDate']
        });
        res.json({Bookings: bookings})
    };

    // if you ARE the owner of the spot
    if (spot.ownerId === userId){
        const bookings = await Booking.findAll({
            where: { spotId: spotId },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
        res.json({Bookings: bookings})
    }
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

// Add Image to Spot based on Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(id);
    
    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (spot.ownerId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    // successful response
    const createdImg = await SpotImage.create({
        spotId: id,
        url: url,
        preview: preview
    });

    const resImg = {
        id: createdImg.id,
        url: createdImg.url,
        preview: createdImg.preview
    };

    res.json(resImg);
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(id, {
        include: {model: Review}
    });
    
    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    // if body isn't validated properly according to reviews parameters
    const err = new Error('Bad Request');
    err.errors = {};
    err.status = 400;
    if (!review) err.errors.review = 'Review text is required';
    if (![1, 2, 3, 4, 5].includes(stars)) err.errors.stars = 'Stars must be an integer from 1 to 5';
    if (Object.keys(err.errors)[0]) throw err;

    // if user already has a review for the Spot
    const reviewsList = [];
    spot.Reviews.forEach( review => reviewsList.push(review.toJSON()));
    reviewsList.forEach(review => {
        if (review.userId === userId) throw new Error ('User already has a review for this spot');
    });

    // successful response
    const createdReview = await Review.create({
        spotId: id,
        userId: userId,
        review: review,
        stars: stars
    });
    
    const resReview = {
        id: createdReview.id,
        userId: createdReview.userId,
        spotId: createdReview.spotId,
        review: createdReview.review,
        stars: createdReview.stars,
        createdAt: createdReview.createdAt,
        updatedAt:createdReview.updatedAt
    };

    res.status(201).json(resReview);
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, bookingValidationErrors, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(id);

    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };

    // if spot owner is the user making the booking
    if (spot.ownerId === userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const startingDate = new Date(startDate);
    const endingDate = new Date(endDate);
    const bookings = await Booking.findAll({
        where: { spotId: id }
    });
    
    // Create a POJO-filled array
    const bookingsList = [];
    bookings.forEach(booking => bookingsList.push(booking.toJSON()));

    const err = new Error('Sorry, this spot is already booked for the specified dates');
    err.errors = {};
    err.status = 403;
    // Iterate over bookingsList & check if a booking is in place 
    for (let i = 0; i < bookingsList.length; i++){
        let existingStartDate = new Date(bookingsList[i].startDate);
        let existingEndDate = new Date(bookingsList[i].endDate);
        let existingStart = existingStartDate.getTime();
        let existingEnd = existingEndDate.getTime();
        let newStart = startingDate.getTime();
        let newEnd = endingDate.getTime();

        // Check if booking is encompassed by a pre-existing booking
        if (newStart >= existingStart && newEnd <= existingEnd){
            err.errors.startDate = 'Start date conflicts with an existing booking';
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        // Check if end date conflicts with an existing booking when start date does not
        if (newStart <= existingStart && newEnd >= existingStart){
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        // Check if start date conflicts with an existing booking when end date does not
        if (newEnd >= existingEnd && newStart <= existingEnd){
            err.errors.startDate = 'Start date conflicts with an existing booking';
        };
        // Check if booking encompasses a pre-existing booking
        if (newStart <= existingStart && newEnd >= existingEnd){
            err.errors.startDate = 'Start date conflicts with an existing booking';
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        if (err.errors.startDate || err.errors.endDate) throw err;
    };

    const booking = await Booking.create({
        spotId: id,
        userId,
        startDate,
        endDate
    });

    res.json(booking);
});

// Edit a Spot
router.put('/:spotId', requireAuth, spotEditValidationErrors, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(id);
    
    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (spot.ownerId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    if (address) await spot.update(address);
    if (city) await spot.update(city);
    if (state) await spot.update(state);
    if (country) await spot.update(country);
    if (lat) await spot.update(lat);
    if (lng) await spot.update(lng);
    if (name) await spot.update(name);
    if (description) await spot.update(description);
    if (price) await spot.update(price);

    const resSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    };

    res.json(resSpot);
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const id = parseInt(spotId, 10);
    const userId = req.user.id;

    const spot = await Spot.findByPk(id);
    
    // if spot doesn't exist with specified id
    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (spot.ownerId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const deletedSpot = await Spot.destroy({ where: { id: id }});
    res.json({ message: 'Successfully deleted'});
});

module.exports = router;