var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated')

router.get('/verify', isAuthenticated, (req, res, next) => {      

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log("req.user", req.user);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.user);
});

module.exports = router;
