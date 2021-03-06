const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=> {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false})
    }
    res.status(200).send(categoryList);
})

router.get('/:id', async (req, res)=> {
    let category = await Category.findById(req.params.id).catch(err => {
        res.status(404).json({
            error: err,
            success: false
        });
    });

    if (!category) {
        return res.status(404).json({ success: false});
    }
    res.status(200).send(category);
})

router.post('/', async (req, res)=> {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
    return res.status(400).send('category not created');

    res.send(category);
})

router.put('/:id', async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }
    )

    if(!category)
    return res.status(400).send('category not created');

    res.send(category);
})

router.delete('/:id', async (req, res)=> {
    let category = await Category.findByIdAndRemove(req.params.id);

    if (!category) {
        return res.status(404).send('category not found')
    }

    res.send(category);
})

module.exports = router;