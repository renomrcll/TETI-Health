const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: Object,
        required: false,
        contains: {
            url: {
                type: String,
                required: false
            },
            public_id: {
                type: String,
                required: false
            }
        }
    },
    deleted: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('User', UserSchema);