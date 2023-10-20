const Service = require('../models/Service')

const isServiceOwner = (req, res, next) => {

    Service.findById(req.params.serviceId)
        .populate('user')
        .then((foundReview) => {
            console.log('Found review ===>', foundReview)
            console.log("User in session ===>", req.user)
            if (foundReview.user._id.toString() === req.user._id) {
                console.log("Match")
                next()
            } else {
                res.status(401).json({message: 'Not authorized'})
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

}

module.exports = isServiceOwner