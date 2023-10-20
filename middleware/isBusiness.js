const isBusiness = (req, res, next) => {
    if (req.user.isBusiness === true) {
        next()
    } else {
        res.status(401).json({message: "Not authorized"})
    }
}

module.exports = isBusiness