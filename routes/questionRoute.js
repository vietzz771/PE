const express = require('express');
const bodyParser = require('body-parser');

const Question = require('../models/question');
var authenticate = require('../authenticate');


const questionRoute = express.Router();
questionRoute.use(bodyParser.json());

questionRoute.route('/')
    .get((req, res, next) => {
        Question.find({})
            .then((question) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        req.body.author = req.user._id;
        Question.create(req.body)
            .then((question) => {
                console.log('Question Created: ', question);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /question');
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.deleteMany()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

questionRoute.route('/:questionId')
    .get((req, res, next) => {
        Question.findById(req.params.questionId )
            
            .then((question) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end("POST operation not supported on /question/" + req.params.questionId );
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.findByIdAndUpdate(req.params.questionId , {$set: req.body}, {new: true})
           
            .then((question) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.findByIdAndRemove(req.params.questionId)
            
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


    // newsRoute.route('/status')
    // .get((req, res, next) => {
    //     News.find({status:  true })
    //         // .populate('author')
    //         .then((news) => {
    //             res.statusCode = 200;
    //             res.setHeader('Content-Type', 'application/json');
    //             res.json(news);
    //         }, (err) => next(err))
    //         .catch((err) => next(err));
    // });
module.exports = questionRoute;