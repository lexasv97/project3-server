var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

const Service = require('../models/Service')
const User = require('../models/User')
const isBusiness = require('../middleware/isBusiness')
const isAuthenticated = require('../middleware/isAuthenticated')
const isServiceOwner = require('../middleware/isServiceOwner')
const axios = require('axios')

router.get('/', (req, res, next) => {
    Service.find()
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

router.post('/new', isAuthenticated, isBusiness, (req, res, next) => { // async

    if (!req.body.category) {
        res.status(400).json({ message: "Provide a category." });
        return;
    }

// const saveServiceLocation = async (serviceData) => {
//     const { location } = serviceData

//     const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//         params: {
//             location,
//             key: 'AIzaSyCRTE2lYv81Hmqzw9SKKF2bRUflzjFQOTI'
//         }
//     })

//   const { results } = response.data;
//   if (results.length > 0) {
//     const { lat, lng } = results[0].geometry.location;

   
//     return [lat,lng]
//   } else return
// }

    Service.create({
        ...req.body,
        // latitude: await saveServiceLocation(req.body)[0],
        // longitude: await saveServiceLocation(req.body)[1],
        user: req.user._id
    })
// const saveServiceLocation = async (serviceData) => {
//     const { location } = serviceData;

//     try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
//             params: {
//                 address: location,  // Use 'address' instead of 'location'
//                 key: 'AIzaSyCRTE2lYv81Hmqzw9SKKF2bRUflzjFQOTI'
//             }
//         });

//         const { results } = response.data;
//         if (results.length > 0) {
//             const { lat, lng } = results[0].geometry.location;
//             return [lat, lng];
//         } else {
//             return [null, null]; // Handle cases where no results are found
//         }
//     } catch (error) {
//         console.error('Error during geocoding:', error);
//         return [null, null];
//     }
// };

// // Use the function within an async context to await its response
// const coordinates = await saveServiceLocation(req.body);
// console.log("coordinates ===>", coordinates)

// Service.create({
//     ...req.body,
//     latitude: coordinates[0],
//     longitude: coordinates[1],
//     user: req.user._id
// })
        .then((createdService) => {
            User.findByIdAndUpdate(
                req.params.serviceId,
                {
                    $push: { services: createdService._id }
                },
                { new: true }
            )
                .then((newService) => {
                    console.log("New service", newService)
                })
                .catch((err) => {
                    console.log(err)
                    res.json(err)
                    next(err)
                })
            res.json(createdService)
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
        // .populate('reviews')
        .populate({
            path: 'reviews',
            populate: {
                path: 'user'
            }
        })
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