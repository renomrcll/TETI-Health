const isEmpty = require('is-empty');
const validator = require('validator');

module.exports.loginValidator=(data) => {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    } else if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    } 
}

module.exports.registerValidator=(data) => {
    let errors = {};
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
    if(validator.isEmpty(data.firstName)){
        errors.firstName = 'First Name field is required';
    }
    if(validator.isEmpty(data.lastName)){
        errors.lastName = 'Last Name field is required';
    }

    if(validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    } else if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }

    if(validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    } else if(!validator.isLength(data.password, { min: 6 })){
        errors.password = 'Password must be at least 6 characters';
    }
    if(validator.isEmpty(data.confirmPassword)){
        errors.confirmPassword = 'Confirm Password field is required';
    } else if(!validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    } 
}