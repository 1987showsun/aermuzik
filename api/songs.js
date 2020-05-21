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

MongoClient.connect(guessbase_url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err,client ) {
    database = client.db('music');
});

const checkLoginStatus = (token, res) => {
    const loginStatus   = jwt.verify(token, ' ',(err, data)=>{return data});
    if(loginStatus==undefined){
        res.status(400).json({
            status : 200,
            status_text : 'you are not logged on'
        });
        return false;
    }
    return loginStatus;
}
  
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

router.get('/rankings',ensureToken , (req, res, next) => {

    const { actionType="", sortKey="like", sortVal=-1, limit=10 } = req['query'];
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
                    delete item['src'];
                    delete item['src_general'];
                    return item = { ...item, cover: albums[0]['cover'] || "",album: albums[0]['name'], artists: artists[0]['name'] || ""  };
                });

                res.json({
                    code    : 1,
                    msg     : "成功",
                    type    : actionType,
                    list    : songDataAll
                });

            });
        });
    });
});

router.get('/', ensureToken, (req, res, next) => {

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
            database.collection('albums').find({}).toArray(function(err,albumData){

                songData = songData.map( item => {
                    const albums = albumData.filter((aItem)=>{
                        if( String(item['album_id'])==String(aItem['_id']) ){
                            return aItem['cover'];
                        }
                    });
                    delete item['src'];
                    delete item['src_general'];
                    return item = { ...item, cover:albums[0]['cover'], album: albums[0]['name'] }
                });

                
                
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

router.get('/src', ensureToken , (req, res, next) => {
    const token = checkLoginStatus(req.token, res);
    if( token ){
        const { songs_id } = req['query'];
        database.collection('songs').find({ _id: ObjectId(songs_id) }).toArray(function(err, data){
            if( data.length>0 ){
                const { src="" } = data[0];
                res.json({
                    src: src
                })
            }else{
                res.json({
                    src: ""
                })
            }
        });
    }
});

router.get('/lrc', ensureToken , (req, res, next) => {
    const token = checkLoginStatus(req.token, res);
    if( token ){
        const { songs_id } = req['query'];
        database.collection('songLyric').find({ songs_id: ObjectId(songs_id) }).toArray(function(err, data){
            if( data.length>0 ){
                const { src="" } = data[0];
                res.json({
                    src: src
                })
            }else{
                res.json({
                    src: ""
                })
            }
        });
    }
});


module.exports = router;