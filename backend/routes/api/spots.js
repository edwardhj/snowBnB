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
// router.post('/', requireAuth)


module.exports = router;