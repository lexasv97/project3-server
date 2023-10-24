const Service = require('../models/Service')

const isServiceOwner = (req, res, next) => {

    console.log("REQ>PARAMS ======>", req.params)

    Service.findById(req.params.serviceId)
        .populate('user')
        .then((foundService) => {
            console.log('Found service ===>', foundService)
            console.log("User in session ===>", req.user)
            if (foundService.user._id.toString() === req.user._id) {
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