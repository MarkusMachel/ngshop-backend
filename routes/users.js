const {User} = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', async (req, res)=> {
    const userList = await User.find().select('name phone email');

    if (!userList) {
        res.status(500).json({ success: false})
    }
    res.send(userList);
})

router.get('/:id', async (req, res)=> {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found!'})
    }
    res.status(200).send(user);
})

router.post('/', async (req, res)=> {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('user not created');

    res.send(user);
})

router.put('/:id', async (req, res)=> {
    const userExist =  await User.findById(req.params.id);
    let newPassword;

    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            isAdmin: req.body.isAdmin,
            phone: req.body.phone,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }
    )

    if(!user)
    return res.status(400).send('User cannot be updated!');

    res.send(user);
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user) {
        res.status(400).send('The user was not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: "1d"
            }
            
        )

        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('password is wrong');
    }
})

router.post('/register', async (req, res)=> {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('user not created');

    res.send(user);
})

router.get('/get/count', async (req, res)=> {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(500).json({success: false})
    }
    res.send({
        count: userCount
    });
})

module.exports = router;