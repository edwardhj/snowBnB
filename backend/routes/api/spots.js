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

    // Remove SpotImages & create previewImage key
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) spot.previewImage = image.url;
        })
        if (!spot.previewImage) spot.previewImage = 'no preview image available';
        delete spot.SpotImages;
    })

    // Remove Reviews & create avgRating key
    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            
        })
    })

    res.json({Spots: spotsList})
})




module.exports = router;