const db = require('../config/db.config');
const config = require('../config/config');
const User = db.user;
const PurchaseCode = db.purchase_code;
var jwt = require('jsonwebtoken');


checkUserAlreadyExist = (req, res, next) => {
    User.findOne({
        where : {
            rut : req.body.rut
        }
    }).then(user => {
            if(user){
                var token = jwt.sign({p_code: user.p_code}, config.secret, {
                expiresIn: 86400 // 24 hours
                });

                res.status(200).send({
                    auth: true,
                    accessToken: token,
                    message: 'RUT already exist',
                });
            }
            
            User.findOne({
                where : {
                    email : req.body.email
                }
            }).then(user => {
                if(user){
                    var token = jwt.sign({p_code: user.p_code}, config.secret, {
                    expiresIn: 86400 // 24 hours
                    });
    
                    return res.status(200).send({
                        auth: true,
                        accessToken: token,
                        message: 'Email already exist',
                    });
                   
                }else{
                    next();
                }
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
}

checkPurchaseCodeAlreadyExist = (req, res, next) => {
    // Check Purchase code already exist
    PurchaseCode.findOne({
        where : {
            p_code : req.body.p_code
        }
    }).then(user => {
            if(user){
                if(user.userRut) {
                    var token = jwt.sign({p_code: user.p_code}, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
    
                    res.status(200).send({
                        auth: true,
                        accessToken: token,
                        message: 'User alredy registered'
                    });
                }else{
                    var token = jwt.sign({p_code: user.p_code}, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
    
                    res.status(200).send({
                        auth: true,
                        accessToken: token,
                        message:'Purchase code alredy registered',
                    });
                }
                
                return true;
            }

            next();
    }).catch(err => {
        res.status(500).send(err);
    });
}


const verifyUser = {};
verifyUser.checkUserAlreadyExist = checkUserAlreadyExist;
verifyUser.checkPurchaseCodeAlreadyExist = checkPurchaseCodeAlreadyExist;
module.exports = verifyUser;
