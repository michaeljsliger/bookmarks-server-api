/* eslint-disable indent */
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BOOKMARKS = require('./dataStore');
const {v4: uuid} = require('uuid');


const logger = require('./logger');


bookmarkRouter 
    .route('/bookmarks')
    .get((req, res) => {
        res.json(BOOKMARKS);
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, description } = req.body;
        if (!title || !url || !rating) {
            return res.status(406).send('Title, URL, and Rating must be included in POST request');
        }
        const id = uuid();
        const newBookmark = {
            id, title, url, rating, description
        };
        BOOKMARKS.push(newBookmark);
        console.log(BOOKMARKS);
        res.status(201).json(newBookmark);

    });

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = BOOKMARKS.find(el => el.id === id);

        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found in data.`);
            return res.status(404).send('Bookmark Not Found');
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = BOOKMARKS.findIndex(el => el.id === id);

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found to be deleted`);
            return res.status(404).send('not found');
        }

        BOOKMARKS.splice(bookmarkIndex, 1);
        logger.info(`Bookmark with id ${id} deleted.`);

        res.status(204).end();
    });




module.exports = bookmarkRouter;