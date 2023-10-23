var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

const Item = require('../models/Item')
const User = require('../models/User')
const isAuthenticated = require('../middleware/isAuthenticated');
const isItemOwner = require('../middleware/isItemOwner')
const isBusiness = require('../middleware/isBusiness')


router.get('/', (req, res, next) => {
    Item.find()
        .populate('user')
        .populate('reviews')
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

router.post('/new', isAuthenticated, isBusiness, (req, res, next) => {

    Item.create({
        ...req.body,
        owner: req.user._id
    })
        .then((createdItem) => {
            User.findByIdAndUpdate(
                req.params.itemId,
                {
                    $push: { items: createdItem._id }
                },
                { new: true }
            )
        })
        .then((newItem) => {
            res.json(newItem)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })

})

router.get('/:itemId', (req, res, next) => {
    const { itemId } = req.params

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Item.findById(itemId)
        .populate('reviews')
        .then((item) => {
            res.status(200).json(item)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

router.put('/:itemId', isAuthenticated, isItemOwner, (req, res, next) => {
    const { itemId } = req.params

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Item.findByIdAndUpdate(itemId, req.body, { new: true })
        .then((updatedItem) => {
            return updatedItem.populate('reviews')
        })
        .then((populatedItem) => {
            res.json(populatedItem)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

router.delete('/:itemId', isAuthenticated, isItemOwner, (req, res, next) => {
    const { itemId } = req.params

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Item.findByIdAndRemove(itemId)
        .then((deletedItem) => {
            res.json({
                deletedItem,
                message: `Item ${itemId} was successfully deleted`
            })
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

module.exports = router;