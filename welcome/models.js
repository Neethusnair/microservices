const mongoose = require('mongoose');
const express = require('express');

const loginSchema = mongoose.Schema({

    "name": String,
    "email": String,
    "password": String

});

module.exports = mongoose.model('Login', loginSchema);