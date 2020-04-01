/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

const jwt               = require('jsonwebtoken');
const guessbase_url     = 'mongodb://127.0.0.1:27017/music';
const queryString       = require('query-string');
const MongoClient       = require('mongodb').MongoClient;
const ObjectId          = require('mongodb').ObjectID;
const express           = require('express');
const router            = express.Router();
let   datetime          = new Date();
let   database;

MongoClient.connect(guessbase_url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err,client ) {
    database = client.db('music');
});
  
const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
    } else {
    res.sendStatus(403);
    }
}

router.get('/album',ensureToken ,function(req, res, next) {
    
    const absoluteURL   = req.protocol + '://' + req.get('host');
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const _artists_id   = req.query.artists_id;
    const _current      = req.query.current;
    const _limit        = 12;
    
    database.collection('albums').find({artists_id:ObjectId(_artists_id)}).toArray(function(err,albumAll){
        database.collection('albums').find({artists_id:ObjectId(_artists_id)}).sort({like:-1}).limit( _limit*Number(_current) ).toArray(function(err,albumData){
            database.collection('artists').find().toArray(function(err,singerData){

                albumData = albumData.map( item => {
                    const _find = singerData.find( findItem => {
                        return String(findItem['_id']) == String(item['artists_id']);
                    })
                    return { ...item, singer: _find['name'] }
                })

                res.json({
                    code     : 1,
                    msg      : '成功',
                    current  : _current,
                    limit    : _limit*Number(_current),
                    total    : albumAll.length,
                    list     : albumData,
                })
            });
        });
    });
});

module.exports = router;