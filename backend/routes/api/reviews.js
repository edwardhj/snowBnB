const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: { model: SpotImage }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewsList = [];
    reviews.forEach( review => reviewsList.push(review.toJSON()) );

    reviewsList.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) review.Spot.previewImage = image.url;
        });
        if (!review.Spot.previewImage) review.Spot.previewImage = 'no preview image available';
        delete review.Spot.SpotImages;
    });

     res.json({Reviews: reviewsList});
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const id = parseInt(reviewId, 10);
    const { url } = req.body;
    const review = await Review.findByPk(id,{
        include: ReviewImage
    });

    // If review with specified Id doesn't exist
    if (!review){
        const err = new Error ("Review couldn't be found");
        err.status = 404;
        throw err;
    };

    // If review isn't owend by current user
    if (review.userId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    // If review already has 10 images
    const imageList = [];
    review.ReviewImages.forEach(image => imageList.push(image.toJSON()));
    if (imageList.length >= 10){
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        throw err;
    };

    // successful response
    const image = await ReviewImage.create({
        url: url,
        reviewId: id
    });

    const resImg = {
        id: image.id,
        url: image.url
    };

    res.json(resImg);
});


// Delete a Spot
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const id = parseInt(reviewId, 10);
    const userId = req.user.id;

    const review = await Review.findByPk(id);
    
    // if spot doesn't exist with specified id
    if (!review){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (review.userId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const deletedReview = await Review.destroy({ where: { id: id }});
    res.json({ message: 'Successfully deleted'});
});

module.exports = router;