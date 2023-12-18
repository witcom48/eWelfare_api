const base64url = require('base64url');
const { AuthenticationError  } = require('../errors/authentication.error');
const bcrypt = require("../utilities/bcrypt");


const authenBasic = async (req, res, next) => {
    try {

        //console.log(req.headers)

        const { headers } = req;
        if (!headers) {            
            throw new Error("Failed to authenticate token.")
        }

        const { authorization } = req.headers
        if (!!!authorization) {            
            throw new Error("Failed to authenticate token.")
        }
        if (!authorization.startsWith('Bearer ')) {           
            throw new Error("Failed to authenticate token.")
        }

        const token = authorization.substring(7, authorization.length)
        const verify = bcrypt.doValidateToken(token)

        if(verify.status_code != 1){           
            throw new Error("Failed to authenticate token.")
        }

        return next()

    } catch (error) {
        //next(error)

        res.status(201).send({
            success:false,
            message:
            error.message || "Failed to authenticate token."
        });

    }

}

module.exports = authenBasic
