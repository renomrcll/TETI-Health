const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const {loginValidator, registerValidator} = require('../validators/validators');


const loginUser = async (req,res)=>{
    const {errors, isValid} = loginValidator(req.body);
    if(!isValid){
        res.json({success: false, errors});
    } else {
        Users.findOne({email: req.body.email})
        .then(user=>{
            if(!user){
                res.json({success: false, error: 'User not found'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                        const payload = {
                            id: user.id,
                            name: user.firstName
                        };
                        jwt.sign(payload, process.env.APP_SECRET, {expiresIn: 2155926}, (err, token)=>{
                            res.json({
                                user,
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    } else {
                        res.json({success: false, error: 'Password incorrect'});
                    }
                })
                .catch(err=>{
                    res.json({success: false, error: err});
                });
            }
        })
        .catch(err=>{
            res.json({success: false, error: err});
        });
    }
}

const createUser = async (req, res)=>{
    const {errors, isValid} = registerValidator(req.body);
    if(!isValid){
        res.json({success: false, errors});
    } else {
        const {firstName, lastName, email, password} = req.body;
        const registerUser = new Users({
            firstName,
            lastName,
            email,
            password,
            createdAt: Date.now()
        });

        try {
            const salt = await bcrypt.genSalt(10);
            registerUser.password = await bcrypt.hash(password, salt);
            await registerUser.save();
            res.json({success: true, message: 'User registered successfully'});
        } catch (error) {
            res.json({success: false, message: error.message});
        }
    }
}

const getUser = (req,res)=>{
    Users.findOne({_id: req.params.id})
    .then(user=>{
        if(!user){
            res.json({success: false, error: 'User not found'});
        } else {
            res.json({success: true, user});
        }
    })
    .catch(err=>{
        res.json({success: false, error: err});
    });
}

const uploadAvatar = async(req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr);
        Users.findOne({ _id: req.body._id }).then(user => {
            user.avatar = { url: uploadedResponse.url, publicId: uploadedResponse.public_id };
            user.save();
            if (user.images) {
                user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id });
            } else {
                user.images = [];
                user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id })
            }
            res.json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: 'Something went wrong, try again.' })
    }
}

const updateUser = async (req, res)=>{
    const {errors, isValid} = registerValidator(req.body);
    if(!isValid){
        res.json({success: false, errors});
    } else {
        const {firstName, lastName, email, password} = req.body;
        const updateUser = {
            firstName,
            lastName,
            email,
            password,
            createdAt: Date.now()
        };
        try {
            const salt = await bcrypt.genSalt(10);
            updateUser.password = await bcrypt.hash(password, salt);
            await Users.findOneAndUpdate({_id: req.params.id}, updateUser);
            res.json({success: true, message: 'User updated successfully'});
        } catch (error) {
            res.json({success: false, message: error.message});
        }
    }
}


module.exports = {loginUser, createUser, getUser, uploadAvatar,updateUser};