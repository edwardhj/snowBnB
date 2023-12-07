const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const reviewValidationErrors = [
    check('review')
        .optional()
        .exists({ checkFalsy: true})
        .withMessage('Review text is required'),
    check('stars')
        .optional()
        .exists({ checkFalsy: true})
        .isInt({ min:0, max:5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

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

// Edit a Review
router.put('/:reviewId', requireAuth, reviewValidationErrors, async (req, res) => {
    const { reviewId } = req.params;
    const id = parseInt(reviewId, 10);
    const userId = req.user.id;
    const { review, stars } = req.body;

    const rev = await Review.findByPk(id);
    
    // if review doesn't exist with specified id
    if (!rev){
        const err = new Error("Review couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (rev.userId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    // check for bad update requests (invalid params)
    // if (review || stars){
    //     const err = new Error('Bad Request');
    //     err.errors = {};
    //     err.status = 400;

    //     if (review === undefined) err.errors.review = 'Review text is required';
    //     if (stars && ![1, 2, 3, 4, 5].includes(stars)) err.errors.stars = 'Stars must be an integer from 1 to 5';
    //     if (Object.keys(err.errors).length > 0) throw err;
    // };

    // successful response
    if (review) await rev.update({review: review});
    if (stars) await rev.update({stars: stars});

    res.json({
        id: rev.id,
        userId: rev.userId,
        spotId: rev.spotId,
        review: rev.review,
        stars: rev.stars,
        createdAt: rev.createdAt,
        updatedAt: rev.updatedAt
    });
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