const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: [{
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include: SpotImage
        }]
    });

    // Create an array of Bookings & convert to POJO
    const bookingsList = [];
    bookings.forEach(booking => bookingsList.push(booking.toJSON()));

    // Remove SpotImages & create previewImage key
    bookingsList.forEach(booking => {
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) booking.Spot.previewImage = image.url;
        });
        if (!booking.Spot.previewImage) booking.Spot.previewImage = 'no preview image available';
        delete booking.Spot.SpotImages;
    });

    res.json({Bookings: bookingsList});
});










module.exports = router;