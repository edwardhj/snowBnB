const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const editBookingErrors = [
    check('startDate')
        .optional()
        .exists()
        .isAfter(new Date().toString())
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .optional()
        .exists()
        .custom((value, { req }) => {
            if(new Date(value) <= new Date(req.body.startDate)) {
                throw new Error ('endDate cannot be on or before startDate');
            };
            return true;
        }),
    handleValidationErrors
];

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

// Edit a Booking
router.put('/:bookingId', requireAuth, editBookingErrors, async (req, res) => {
    const { bookingId } = req.params;
    const id = parseInt(bookingId, 10);
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(id);

    // if booking doesn't exist with specified id
    if (!booking){
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        throw err;
    };

    // if booking's owner doesn't match the logged in user
    if (booking.userId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };
    
    // Can't edit a booking that's past the end date
    const existingEnd = new Date(booking.endDate).getTime();
    const today = new Date().getTime();
    if (today > existingEnd){
        const err = new Error('Past bookings can\'t be modified');
        err.status = 403;
        throw err;
    };

    // Booking Conflict Error
    const bookings = await Booking.findAll({where: { spotId: booking.spotId }});
    const bookingsList = [];
    bookings.forEach(book => bookingsList.push(book.toJSON()));

    const err = new Error('Sorry, this spot is already booked for the specified dates');
    err.errors = {};
    err.status = 403;

    // Iterate over bookingsList & check if a booking is in place 
    for (let i = 0; i < bookingsList.length; i++){
        if (bookingsList[i].id === booking.id) continue;
        
        let newStartDate;
        let newEndDate;
        let existingStart = new Date(bookingsList[i].startDate).getTime();
        let existingEnd = new Date(bookingsList[i].endDate).getTime();

        if (startDate) newStartDate = new Date(startDate).getTime();
        else { newStartDate = new Date(booking.startDate).getTime()};
        if (endDate) newEndDate = new Date(endDate).getTime();
        else { newEndDate = new Date(booking.endDate).getTime()};

        // Check if booking is encompassed by a pre-existing booking
        if (existingStart <= newStartDate && existingEnd >= newEndDate){
            err.errors.startDate = 'Start date conflicts with an existing booking';
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        // Check if end date conflicts with an existing booking when start date does not
        if (existingStart >= newStartDate && newEndDate >= existingStart){
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        // Check if start date conflicts with an existing booking when end date does not
        if (existingEnd <= newEndDate && newStartDate <= existingEnd){
            err.errors.startDate = 'Start date conflicts with an existing booking';
        };
        // Check if booking encompasses a pre-existing booking
        if (newStartDate <= existingStart && newEndDate >= existingEnd){
            err.errors.startDate = 'Start date conflicts with an existing booking';
            err.errors.endDate = 'End date conflicts with an existing booking';
        };
        if (err.errors.startDate || err.errors.endDate) throw err;
    };

    if (startDate) booking.update({startDate});
    if (endDate) booking.update({endDate});

    res.json(booking);
});

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const id = parseInt(bookingId, 10);
    const userId = req.user.id;

    const booking = await Booking.findByPk(id, {
        include: {model: User}
    });

    // if spot doesn't exist with specified id
    if (!booking){
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user || booking's owner doesn't match logged in user
    if (booking.userId !== userId || booking.User.id !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    // if booking has already been started
    let startDate = new Date(booking.startDate).getTime();
    let today = new Date();
    if (today >= startDate){
        const err = new Error('Bookings that have been started can\'t be deleted');
        err.status = 403;
        throw err;
    };

    const deletedBooking = await Booking.destroy({ where: { id: id }});
    res.json({ message: 'Successfully deleted'});
});


module.exports = router;