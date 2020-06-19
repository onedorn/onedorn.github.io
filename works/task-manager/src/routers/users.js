const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthWebToken();
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.getByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthWebToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });

        await req.user.save();

        res.send()
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/profile', auth, async (req, res) => {
 res.send(req.user)
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send('Users was not found!')
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.patch('/:id', async (req, res) => {
    const allFields = Object.keys(req.body);
    const allowedFields = ['name', 'email', 'password', 'age'];
    const isValidField = allFields.every(field => allowedFields.includes(field));

    if (!isValidField) {
        res.status(404).send({error: 'Invalid operation!'})
    }

    try {
        const user = await User.findById(req.params.id);
        allFields.forEach(update => user[update] = req.body[update]);
        await user.save();

        if (!user) {
            return res.status(404).send('User already updated')
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send('User already deleted!')
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message)
    }
});

module.exports = router;