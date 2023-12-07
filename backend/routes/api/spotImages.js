const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const id = parseInt(imageId, 10);
    const userId = req.user.id;

    const spotImage = await SpotImage.findByPk(id, {
        include: {model: Spot}
    });
    
    // if spot doesn't exist with specified id
    if (!spotImage){
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        throw err;
    };
    // if spot's owner doesn't match the logged in user
    if (spotImage.Spot.ownerId !== userId){
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    };

    const deletedSpotImage = await SpotImage.destroy({ where: { id: id }});
    res.json({ message: 'Successfully deleted'});
});


module.exports = router;