require('dotenv').config()
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')
var User = require('../models/user')
var bcrypt = require('bcrypt')
// return 
// error if error
// token if user exist or not exist
exports.gooleLogin = (req, res) => {
    const { tokenId } = req.body
    if (!tokenId) {
        res.json({ error: "Please provide a token" })
    }
    const client = new OAuth2Client(process.env.CLIENTID)
    client.verifyIdToken({ idToken: tokenId, audience: process.env.CLIENTID }).then(response => {
        const { email, email_verified, name, picture, given_name, family_name } = response.payload
        if (email_verified) {
            User.findOne({ email: email }, (err, user) => {
                if (err) {
                    console.log("Error in googleLogin", err)
                    res.json({ error: "Something went wrong" })
                }
                else {
                    if (user) {
                        let payload = { id: user._id, email: user.email }
                        let token = jwt.sign(payload, process.env.JWTSECRETKEY, {
                            expiresIn: "24h"
                        })
                        res.json({ token })
                    }
                    else {
                        let newuser = new User({ name, email, firstname: given_name, lastname: family_name, picture: picture })
                        newuser.save((err, registeredUser) => {
                            if (err) {
                                console.log("Error in googleLogin", err)
                                res.json({ error: "Something went wrong" })
                            }
                            else {
                                console.log("successfully user registered!");
                                let payload = { id: registeredUser._id, email: registeredUser.email }
                                let token = jwt.sign(payload, process.env.JWTSECRETKEY, {
                                    expiresIn: "24h"
                                })
                                res.json({ token })
                            }
                        })
                    }
                }
            })
        } else {
            res.json({ error: "Your email is not verified" })
        }
    }).catch(er => {
        console.log("Error in googleLogin", er)
        res.json({ error: "Something went wrong" })
    })
}


exports.setPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            res.json({ error: "All fields are required" })
        }
        _ = await User.updateOne({ _id: req.userid }, { password: User.hashPassword(password) })
        return res.json({ message: 'successfully updated password' });

    } catch (error) {
        return res.json({ error: 'Somthing went wrong' });
    }
}

exports.Login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ error: "All fields are required" })
    }
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            res.json({ error: "Something went wrong" })
        } else {
            if (!user) {
                res.json({ error: "User doesn't exist" })
            }
            else {
                if (!user.password) {
                    res.json({ error: "You haven't set your password" })
                }
                else {
                    bcrypt.compare(password, user.password).then(match => {
                        if (match) {
                            let payload = { id: user._id, email: user.email }
                            let token = jwt.sign(payload, process.env.JWTSECRETKEY, {
                                expiresIn: "24h"
                            })
                            res.json({ token })
                        }
                        else {
                            res.json({ error: 'Incorrect password!!' })
                        }
                    }).catch(err => {
                        res.json({ error: "Something went wrong" })
                    })
                }

            }

        }
    })


}
