var express = require('express');
var router = express.Router();

const isBAuthenticated = require('../middleware/isBAuthenticated');
const Business = require('../models/Business');

/* GET users listing. */
router.get('/business-details/:businessId', (req, res, next) => {

  const { businessId } = req.params

  Business.find(businessId)
    .populate('services')
    .populate('items')
    .then((foundBusiness) => {
      const { _id, email, name, location, image, items, services } = foundBusiness

      res.json({ _id, email, name, location, image, items, services })
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
      next(err)
    })
})

router.post('/update-business-profile', isBAuthenticated, (req, res, next) => {

  Business.findByIdAndUpdate(
    req.business._id,
    req.body,
    { new: true }
  )
    .then((updatedBusiness) => {
      return updatedBusiness.populate('services').populate('items')
    })
    .then((populatedBusiness) => {
      const { _id, email, name, location, image, items, services } = populatedBusiness
      const business = { _id, email, name, location, image, items, services }
      const authToken = jwt.sign(business, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      })
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
      next(err);
    });
})

module.exports = router;
