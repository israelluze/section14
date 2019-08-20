const userModel = require('../_models/UserModel');
const bcrypt = require('bcryptjs');
const consts = require('../consts');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async function(req, res) {
        try {
            let u = await userModel.findOne({email: req.body.email});

            if (!u) {
                const user = new userModel(req.body);  
                console.log('antes', req.body);        
                const hash = bcrypt.hashSync(user.password, consts.bcryptSalts);
                user.password = hash;
                console.log(user);
                await user.save();
                delete user.password;
                res.status(200).json(user);
            } else {
                res.status(403).json({message: 'Email already registered', error: {}});
            }
        } catch (e) {
            res.status(500).json({message: 'Error while saving the user', error: e})
        }
       
    },
    login: function(req, res) {
        const password = req.body.password;
        const email = req.body.email;

        userModel.findOne({email: req.body.email}).lean().exec(function(err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Server error', error: err});
            }
            const auth_err = (password == '' || password ==null);            
            
            if (!auth_err) {                
                let result = bcrypt.compareSync(password, user.password);
                if (result) {
                    let token = jwt.sign({id: user.id}, consts.keyJWT, {expiresIn: consts.expiresJWT})
                    delete user.password;
                    return res.json({...user, token: token});
                }
            }
            return res.status(404).json({
                message: 'Wrong e-mail or password'})
        } );
    },

    check_token: function(req, res, next) {
        const token = req.get('Authorization');
        
        if (!token) {            
            return res.status(401).json({message: 'Token not found'});
        }
        jwt.verify(token, consts.keyJWT, 
            (err, decoded) => {
                if (err || !decoded) {
                    return res.status(401).json({message: 'Wrong token. Authentication error'});
                }
                next();
            }
        )
    },

    user_data: function(req, res) {
        const token = req.get('Authorization');
        jwt.verify(token, consts.keyJWT, 
            (err, decoded) => {
                const id = decoded._id;
                userModel.findById(id).lean().exec(function(err, user) {
                    if (err || !user) {
                        return res.status(500).json({message: 'Error when trying to fetch user data', error: err})
                    }
                    let token = jwt.sign({id: user.id}, consts.keyJWT, {expiresIn: consts.expiresJWT})
                    delete user.password;
                    return res.json({...user, token: token});
                });
            }
        )
    }
}