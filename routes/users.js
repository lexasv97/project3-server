var express = require('express');
var router = express.Router();

const User = require('../models/User')
const isUAuthenticated = require('../middleware/isUAuthenticated');

/* GET users listing. */
router.get('/user-details/:UserId', (req, res, next) => {

  const { userId } = req.params

  User.find(userId)
    .populate('addresses')
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

router.post('/update-user-profile', isUAuthenticated, (req, res, next) => {

  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true }
  )
    .then((updatedUser) => {
      return updatedUser.populate('addresses')
    })
    .then((populatedUser) => {
      const { _id, email, name, addresses, profileImage } = populatedUser
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
