var express = require('express');
var router = express.Router();

const Review = require('../models/Review')

const isUAuthenticated = require('../middleware/isUAuthenticated');

router.post('/items/reviews/new/:itemId', (req, res, next) => {
    // console.log("REQ.BODY ====>", req.body) 
    // console.log("ITEM ID ====> ", req.params.itemId)   

    Review.create({
        user: req.session.user._id,   // IS IT CORRECT WITH SESSION ???
        comment: req.body.comment,
        rating: req.body.rating
    })
        .then((newReview) => {
            //console.log("NEW REVIEW ===>", newReview)
            return Item.findByIdAndUpdate(
                req.params.itemId,
                {
                    $push: { reviews: newReview._id }
                },
                { new: true }
            )
        })
        .then((response) => {
            return response.populate('reviews')
        })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.delete("/:reviewId", (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Review.findByIdAndRemove(reviewId)
        .then((deletedReview) =>
            res.json({
                deletedReview,
                message: `Review with ${reviewId} is removed successfully.`,
            })
        )
        .catch((error) => res.json(error));
})

router.post('/services/reviews/new/:serviceId', (req, res, next) => {
    // console.log("REQ.BODY ====>", req.body) 
    // console.log("SERVICE ID ====> ", req.params.serviceId)   

    Review.create({
        user: req.session.user._id,   // IS IT CORRECT WITH SESSION ???
        comment: req.body.comment,
        rating: req.body.rating
    })
        .then((newReview) => {
            //console.log("NEW REVIEW ===>", newReview)
            return Service.findByIdAndUpdate(
                req.params.serviceId,
                {
                    $push: { reviews: newReview._id }
                },
                { new: true }
            )
        })
        .then((response) => {
            return response.populate('reviews')
        })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;
