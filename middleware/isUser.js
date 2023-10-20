const isUser = (req, res, next) => {
    if (req.user.isBusiness === false) {
        next()
    } else {
        res.status(401).json({message: "Not authorized"})
    }
}

module.exports = isUser