const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send('Users was not found!')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.patch('/:id', async (req, res) => {
    const allFields = Object.keys(req.body);
    const allowedFields = ['description', 'completed'];
    const isValidField = allFields.every(field => allowedFields.includes(field));

    if (!isValidField) {
        res.status(404).send({error: 'Invalid operation!'})
    }

    try {
        const task = await Task.findById(req.params.id);

        allFields.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            return res.status(404).send('Users was not found!')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).send('Task already deleted!')
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e.message)
    }
});

module.exports = router;