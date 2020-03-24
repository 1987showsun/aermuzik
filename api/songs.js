/*
 *   Copyright (c) 2019 
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

MongoClient.connect(guessbase_url,{ useNewUrlParser: true }, function(err,client ) {
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

router.get('/rankings',ensureToken ,function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const type          = req.query.actionType   || "";
    const sortKey       = req.query.sortKey      || 'like';
    const sortVal       = req.query.sortVal      || '-1';
    const limit         = req.query.limit        || 10;

    database.collection('songs').find({}).sort({[sortKey]:Number(sortVal)}).limit( Number(limit) ).toArray(function(err,songDataAll){
        database.collection('albums').find().toArray(function(err,albumData){
            database.collection('artists').find().toArray(function(err,artistsData){

                songDataAll = songDataAll.map( item => {
                    const albums  = albumData.filter( aItem => {
                        if( String(aItem['_id'])==String(item['album_id']) ){
                            return aItem['cover'];
                        }
                    })

                    const artists = artistsData.filter( aItem => {
                        if( String(aItem['_id'])==String(item['artists_id']) ){
                            return aItem['name'];
                        }
                    })

                    if( loginStatus!=undefined ){
                        delete item['src_general'];
                    }else{
                        item = { ...item, src: item['src_general'] }
                        delete item['src_general'];
                    }
                    return item = { ...item, cover: albums[0]['cover'] || "",album: albums[0]['name'], artists: artists[0]['name'] || ""  };
                });

                res.json({
                    code    : 1,
                    msg     : "成功",
                    type    : type,
                    list    : songDataAll
                });

            });
        });
    });
});

router.get('/',ensureToken ,function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const artists_id    = req.query.artists_id;
    const current       = req.query.current;
    const limit         = 10;
    let   find          = {};

    if( artists_id!=undefined ){
        find = {
            artists_id : ObjectId(artists_id)
        }
    }

    database.collection('songs').find( find ).toArray(function(err,songDataAll){
        database.collection('songs').find( find ).sort({like:-1}).skip(0).limit( limit*Number(current) ).toArray(function(err,songData){
            database.collection('albums').find().toArray(function(err,albumData){

                songData = songData.map( item => {
                    const albums = albumData.filter((aItem)=>{
                        if( String(item['album_id'])==String(aItem['_id']) ){
                            return aItem['cover'];
                        }
                    });
                    if( loginStatus!=undefined ){
                        delete item['src_general'];
                    }else{
                        item = { ...item, src: item['src_general'] }
                        delete item['src_general'];
                    }

                    return item = { ...item, cover:albums[0]['cover'], album: albums[0]['name'] }
                })
                
                res.json({
                    code     : 1,
                    msg      : '成功',
                    current  : current,
                    limit    : limit*current,
                    total    : songDataAll.length,
                    list     : songData
                })
            });
        });
    });
});

module.exports = router;