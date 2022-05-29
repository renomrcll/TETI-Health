const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String, 
        required: true
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