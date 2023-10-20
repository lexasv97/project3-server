var express = require('express');
var router = express.Router();

const User = require('../models/User')
const isAuthenticated = require('../middleware/isAuthenticated')

router.get('/details/:UserId', isAuthenticated, (req, res, next) => {

  const { userId } = req.params

  User.find(userId)
    .then((foundUser) => {
      const { _id, email, name, addresses, profileImage } = foundUser

      res.json({ _id, email, name, addresses, profileImage })
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
      next(err)
    })
})

router.post('/update-profile', isAuthenticated, (req, res, next) => {

  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true }
  )
    .then((updatedUser) => {
      const { _id, email, name, addresses, profileImage } = updatedUser
      const user = { _id, email, name, addresses, profileImage }
      const authToken = jwt.sign(user, process.env.SECRET, {
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
