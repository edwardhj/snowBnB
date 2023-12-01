const express = require('express');
const { Spot, SpotImage, Review } = require('../../db/models');
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
            }
        })
        if (!spot.avgRating) spot.avgRating = 'no ratings available'
        delete spot.Reviews
    })

    // Remove SpotImages & create previewImage key
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) spot.previewImage = image.url;
        })
        if (!spot.previewImage) spot.previewImage = 'no preview image available';
        delete spot.SpotImages;
    })

    res.json({Spots: spotsList})
})




module.exports = router;