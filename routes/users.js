var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/User')
const isAuthenticated = require('../middleware/isAuthenticated')

const saltRounds = 10;

// router.get('/details/:UserId', isAuthenticated, (req, res, next) => {

//   const { userId } = req.params

//   User.find(userId)
//     .then((foundUser) => {
//       const { _id, email, name, phone, addresses, profileImage } = foundUser

//       res.json({ _id, email, phone, name, addresses, profileImage })
//     })
//     .catch((err) => {
//       console.log(err)
//       res.json(err)
//       next(err)
//     })
// })

router.put('/update-profile', isAuthenticated, (req, res, next) => {

  const { user, name, email, phone, addresses, password, profileImage, isBusiness } = req.body

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  User.findById(user._id)
    .then((foundProfile) => {
      if (password) {

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.findByIdAndUpdate(
          foundProfile._id,
          {
            name,
            email,
            phone,
            profileImage,
            isBusiness,
            password: hashedPassword
          },
          { new: true })

          .then((updatedUser) => {
            const { email, name, phone, addresses, profileImage, isBusiness } = updatedUser
            console.log("Updated ====>", updatedUser)
            res.json(updatedUser)
          })
          .catch((err) => {
            console.log(err)
            next(err)
          })

      } else {

        User.findByIdAndUpdate(
          user._id,
          {
            name,
            phone,
            addresses,
            profileImage,
            isBusiness
          },
          { new: true }
        )
          .then((updatedUser) => {
            const { email, name, phone, addresses, profileImage, isBusiness } = updatedUser
            res.json(updatedUser)
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
            next(err);
          })
      }
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
})

module.exports = router;
