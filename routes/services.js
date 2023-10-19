var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

const Service = require('../models/Service')
const User = require('../models/User')
const Business = require('../models/Business')

const isBAuthenticated = require('../middleware/isBAuthenticated')

router.get('/services', (req, res, next) => {
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

router.post('/services/new/:serviceId', (req, res, next) => {

    Service.create({
        ...req.body,
        owner: req.business._id
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

router.get('/services/:serviceId', (req, res, next) => {
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

router.put('/services/:serviceId', (req, res, next) => {
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

router.delete('/services/:serviceId', (req, res, next) => {
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