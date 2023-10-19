var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

const Item = require('../models/Item')
const User = require('../models/User')
const Business = require('../models/Business')

const isBAuthenticated = require('../middleware/isBAuthenticated')

router.get('/items', (req, res, next) => {
    Item.find()
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

router.post('/items/new/:itemId', (req, res, next) => {

    Item.create({
        ...req.body,
        owner: req.business._id
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

router.get('/items/:itemId', (req, res, next) => {
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

router.put('/items/:itemId', (req, res, next) => {
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

router.delete('/items/:itemId', (req, res, next) => {
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