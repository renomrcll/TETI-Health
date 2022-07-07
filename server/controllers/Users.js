const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const {loginValidator, registerValidator, newPasswordValidator} = require('../validators/validators');
const cloudinary = require('../config/cloudinary');



const loginUser = async (req,res)=>{
    const {errors, isValid} = loginValidator(req.body);
    if(!isValid){
        res.status(401).json({success: false, errors});
    } else {
        const {email, password} = req.body;
        Users.findOne({email})
        .then(user=>{
            if(!user){
                errors.email = 'User not found';
                res.status(401).json({success: false, errors});
            } else {
                bcrypt.compare(password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                        const payload = {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            avatar: user.avatar,
                            createdAt: user.createdAt
                        };
                        const token = jwt.sign(payload, process.env.APP_SECRET, {
                            expiresIn: '1h'
                        });
                        res.json({success: true, user_id:user._id, token: 'Bearer '+token, message: 'User logged in successfully'});
                    } else {
                        errors.password = 'Password incorrect';
                        res.status(401).json({success: false, errors : error.message});
                    }
                })
                .catch(err=>{
                    res.status(401).json({success: false, error: err.message});
                });
            }
        })
        .catch(err=>{
            res.status(401).json({success: false, error: err.message});
        });
    }
}

const createUser = async (req, res)=>{
    const {errors, isValid} = registerValidator(req.body);
    if(!isValid){
        res.status(401).json({success: false, errors});
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
            res.json({success: true, message: 'User created successfully'});
        } catch (error) {
            errors.email = 'Email already exists';
            res.status(401).json({success: false, errors});
        }
    }
}

const getUser = (req,res)=>{
    Users.findOne({_id: req.params.id})
    .then(user=>{
        if(!user){
            res.status(401).json({success: false, error: 'User not found'});
        } else {
            res.json({success: true, user,message:"User found"});
        }
    })
    .catch(err=>{
        res.status(401).json({success: false, error: err});
    });
}

//upload avatar from url to cloudinary 
const uploadAvatar = async(req, res) => {
    try{
        const upload = await cloudinary.uploader.upload(req.body.url);
        const user = await Users.findOneAndUpdate({_id: req.params.id}, {avatar: upload.url});
        res.json({success: true, user});
        
    } catch(err){
        res.status(401).json({success: false, error: err.message});
    }
    



    // try {
    //     const fileStr = req.body.data;
    //     const uploadedResponse = await cloudinary.uploader.upload(fileStr);
    //     Users.findOne({ _id: req.params.id }).then(user => {
    //         user.avatar = { url: uploadedResponse.url, publicId: uploadedResponse.public_id };
    //         user.save();
    //         if (user.images) {
    //             user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id });
    //         } else {
    //             user.images = [];
    //             user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id })
    //         }
    //         res.json({ success: true });
    //     })
    // } catch (err) {
    //     console.log(err);
    //     res.status(401).json({ success: false, message: 'Something went wrong, try again.' })
    // }
}

const updateUser = async (req, res)=>{
    const {firstName, lastName, email} = req.body;
    const updateUser = {
        firstName,
        lastName,
        email,
        updatedAt: Date.now()
    };
    try {
        await Users.findOneAndUpdate({_id: req.params.id}, updateUser);
        res.json({success: true, message: 'User updated successfully'});
    } 
    catch (error) {
        res.status(401).json({success: false, error: error.message});

}
}

const changePassword = async (req, res)=>{
    const {errors, isValid} = newPasswordValidator(req.body);
    if(!isValid){
        res.status(401).json({success: false, errors});
    } else {
        const {password, newPassword} = req.body;
        Users.findOne({_id: req.params.id})
        .then(user=>{
            if(!user){
                res.status(401).json({success: false, error: 'User not found'});
            } else {
                bcrypt.compare(password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                        const salt = bcrypt.genSaltSync(10);
                        user.password = bcrypt.hashSync(newPassword, salt);
                        user.save();
                        res.json({success: true, message: 'Password changed successfully'});
                    } else {
                        res.status(401).json({success: false, error: 'Password incorrect'});
                    }
                })
                .catch(err=>{
                    res.status(401).json({success: false, error: err});
                });
            }
        })
        .catch(err=>{
            res.status(401).json({success: false, error: err});
        });
    }
}

const deleteUser = async (req, res)=>{
    try {
        await Users.findOneAndDelete({_id: req.params.id});
        res.json({success: true, message: 'User deleted successfully'});
    } catch (error) {
        res.status(401).json({success: false, message: error.message});
    }
}

const getAllUsers = async (req, res)=>{
    try {
        const users = await Users.find();
        res.json({success: true, users});
    } catch (error) {
        res.status(401).json({success: false, error: error.message, users});
    }
}


module.exports = {getAllUsers, loginUser, createUser, getUser, uploadAvatar,updateUser,changePassword,deleteUser};