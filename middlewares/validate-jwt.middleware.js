const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    
    // Get Token
    const token = req.header('x-token');
    // console.log(token);
    
    if (!token) {
        // Unauthorized
        return res.status(401).json({
            ok: false,
            msg: 'Could not validate token'
        })
    }

    try {
        // Validate Token
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        
        // Send current user uid with within request
        req.uid = uid;
        
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }
}


module.exports = {
    validateJWT
}