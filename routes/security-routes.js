const router = require('express').Router();
const userDAO = require('../models/user-dao');
const photoUploadManager = require('../middlewares/upload-middleware');
const csrfProtection = require('csurf')();

const bcrypt = require('bcrypt');
const validateRegister = async (req, errors) => {

    if (req.body.email != req.body.confirm_email) {

        errors.push("Email and Confirm Email must be the same");

    }
    if (req.body.user_password != req.body.confirm_password) {

        errors.push("Pasword and Confirm Password must be the same");
    }

    if (!req.body.user_password) {

        errors.push("Enter a password");
    } else if (req.body.user_password.length < 3 || req.body.user_password.length > 15) {
        errors.push("Password too short");
    }

    if (!req.body.user_name) {
        errors.push("Vous devez entrer un nom")
    } else if (req.body.user_name.length < 3) {
        errors.push("Nom invalid");
    }


    if (await userDAO.checkIfEmailIsUnique(req.body.email)) {
        // console.log(req.body.email);
        errors.push("Email alreayd exists");
    }

    return errors.length === 0;
}
const checkIfUserIsLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.flash('info', 'You need to be log to view this page')
    res.redirect('/login');
}

router.get('/secure/home', checkIfUserIsLoggedIn, (req, res) => {

    console.log(req.session.user);
    res.render('security/home')
})

router.all('/register', photoUploadManager, async (req, res, next) => {
    let errors = [];


    if (req.method === 'POST' && await validateRegister(req, errors)) {
        const salt = await bcrypt.genSalt(1)
        let hashPassword = await bcrypt.hash(req.body.user_password, salt);
        delete req.body.password;
        delete req.body.confirm_password;
        delete req.body.confirm_email;
        if (req.uploadedFileName) {
            req.body.photo = req.uploadedFileName;
        }
        req.body.user_password = hashPassword;
        try {
            const result = await userDAO.insertOne(req.body);
            req.flash('info', 'Register complete')
            req.session.user = req.body;
            return res.redirect('/secure/home');
        } catch (err) {
            next(err)
        }

    }
    res.render('security/register', {
        title: "Register Form",
        errors: errors
    })



})

router.get('/login', (req, res) => {
    res.render('security/login')
})

router.post('/login', async (req, res) => {

    let authenticate = false;
    const user = await userDAO.findOneBy('email', req.body.email);
    

    if (await user && 'user_password' in user) {
        console.log(user);
        authenticate = await bcrypt.compare(req.body.user_password, user.user_password)
    }
    if (authenticate) {
        req.flash('info', "You're now logged in")
        delete user.user_password;
        req.session.user = user;
        res.redirect('/secure/home');
    } else {
        req.flash('info', "Password or Email incorrect")
        res.redirect('/login');
    }
})




module.exports = router;


