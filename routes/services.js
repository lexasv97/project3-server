var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

const Service = require('../models/Service')
const User = require('../models/User')
const isBusiness = require('../middleware/isBusiness')
const isAuthenticated = require('../middleware/isAuthenticated')
const isServiceOwner = require('../middleware/isServiceOwner')


router.get('/', (req, res, next) => {
    Service.find()
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

    Service.create({
        ...req.body,
        owner: req.user._id
    })
    .then((createdService) => {
        User.findByIdAndUpdate(
            req.params.serviceId,
            {
                $push: {services: createdService._id}
            },
            {new: true}
        )
    })
        .then((newService) => {
            res.json(newService)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })

})

router.get('/:serviceId', (req, res, next) => {
    const { serviceId } = req.params

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Service.findById(serviceId)
        .populate('reviews')
        .then((service) => {
            res.status(200).json(service)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

router.put('/:serviceId', isAuthenticated, isServiceOwner, (req, res, next) => {
    const { serviceId } = req.params

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Service.findByIdAndUpdate(serviceId, req.body, { new: true })
        .then((updatedService) => {
            return updatedService.populate('reviews')
        })
        .then((populatedService) => {
            res.json(populatedService)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

router.delete('/:serviceId', isAuthenticated, isServiceOwner, (req, res, next) => {
    const { serviceId } = req.params

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Service.findByIdAndRemove(serviceId)
        .then((deletedService) => {
            res.json({
                deletedService,
                message: `Service ${serviceId} was successfully deleted`
            })
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
            next(err)
        })
})

module.exports = router;