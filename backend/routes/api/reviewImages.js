const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const id = parseInt(imageId, 10);
    const userId = req.user.id;

    const reviewImage = await ReviewImage.findByPk(id, {
        include: {model: Review}
    });
    
    // if spot doesn't exist with specified id
    if (!reviewImage){
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        throw err;
    };
    // if review's owner doesn't match the logged in user
    if (reviewImage.Review.userId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const deletedReviewImage = await ReviewImage.destroy({ where: { id: id }});
    res.json({ message: 'Successfully deleted'});
});


module.exports = router;