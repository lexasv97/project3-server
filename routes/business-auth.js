var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Business = require('../models/Business')

const isBAuthenticated = require('../middleware/isBAuthenticated')

const saltRounds = 10;

router.post("/business-signup", (req, res, next) => {
    const { email, password, name } = req.body;

    // Check if the email or password or name is provided as an empty string
    if (email === "" || password === "" || name === "") {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
    }

    // Use regex to validate the password format
    // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // if (!passwordRegex.test(password)) {
    //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    //   return;
    // }

    // Check the businesses collection if a business with the same email already exists
    Business.findOne({ email })
        .then((foundBusiness) => {
            // If the business with the same email already exists, send an error response
            if (foundBusiness) {
                res.status(400).json({ message: "Business already exists." });
                return;
            }

            // If the email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create a new business in the database
            // We return a pending promise, which allows us to chain another `then`
            Business.create({ email, password: hashedPassword, name })
                .then((createdBusiness) => {
                    // Deconstruct the newly created business object to omit the password
                    // We should never expose passwords publicly
                    const { email, name, _id } = createdBusiness;

                    // Create a new object that doesn't expose the password
                    const payload = { _id, email, name };

                    // Create and sign the token
                    const authToken = jwt.sign(payload, process.env.SECRET, {
                        algorithm: "HS256",
                        expiresIn: "6h",
                    });

                    // Send the token as the response
                    res.status(200).json({ authToken });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: "Internal Server Error" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        });
});

router.post("/business-login", (req, res, next) => {
    const { email, password } = req.body;

    // Check if email or password are provided as empty string
    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }

    // Check the businesses collection if a business with the same email exists
    Business.findOne({ email })
        .populate('items')
        .populate('services')
        .then((foundBusiness) => {
            if (!foundBusiness) {
                // If the business is not found, send an error response
                res.status(401).json({ message: "Business not found." });
                return;
            }

            // Compare the provided password with the one saved in the database
            const passwordCorrect = bcrypt.compareSync(password, foundBusiness.password);

            if (passwordCorrect) {
                // Deconstruct the business object to omit the password
                const { _id, email, name, pets, location, image } = foundBusiness;

                // Create an object that will be set as the token payload
                const payload = { _id, email, name, pets, location, image };

                // Create and sign the token
                const authToken = jwt.sign(payload, process.env.SECRET, {
                    algorithm: "HS256",
                    expiresIn: "6h",
                });

                // Send the token as the response
                res.status(200).json({ authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }
        })
        .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

router.get('/business-verify', isBAuthenticated, (req, res, next) => {       

    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log("req.business", req.business);

    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.business);
});


module.exports = router;