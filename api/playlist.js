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

router.get('/folder',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if(loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            user_id : "",
            list    : []
        })
    }else{
        const user_id  = loginStatus['_id'];
        database.collection('playlist').find({user_id:ObjectId(user_id)}).toArray((err,collectionData)=>{

            collectionData = collectionData.map( item => {
                delete item['user_id'];
                delete item['date'];
                return item;
            })

            res.json({
                code    : 1,
                msg     : "成功",
                user_id : user_id,
                list    : collectionData
            })
            
        });
    }
});

router.post('/folder',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const bodyData      = req.body;

    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            user_id : "",
            list    : []
        })
    }else{
        const user_id  = loginStatus['_id'];
        database.collection('playlist').insert({
            user_id : ObjectId(user_id),
            name    : bodyData['name'],
            list    : [],
            date    : datetime.valueOf()
        },(err, afterData)=>{
            database.collection('playlist').find({user_id:ObjectId(user_id)}).toArray((err,playlistData)=>{
                res.json({
                    code    : 1,
                    msg     : "成功",
                    user_id : user_id,
                    list    : playlistData
                })
            })
        })
    }
})

router.put('/folder',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            user_id : "",
            list    : []
        })
    }else{
        const user_id   = loginStatus['_id'];
        const bodyData  = req.body;
        database.collection('playlist').update({_id:ObjectId(bodyData['playlist_id'])},{$set:{ "name":bodyData['name'] }},()=>{
            database.collection('playlist').find({user_id:ObjectId(user_id)}).toArray((err,playlistData)=>{
                res.json({
                    code    : 1,
                    msg     : "成功",
                    user_id : user_id,
                    list    : playlistData
                })
            })
        });
    }
})

router.delete('/folder',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const bodyData      = req.body;

    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            user_id : "",
            list    : []
        })
    }else{
        const user_id   = loginStatus['_id'];
        database.collection('playlist').remove({_id:ObjectId(bodyData['_id'])},(err,data)=>{
            database.collection('playlist').find({user_id:ObjectId(user_id)}).toArray((err,playlistData)=>{
                res.json({
                    code    : 1,
                    msg     : "成功",
                    user_id : user_id,
                    list    : playlistData
                })
            });
        })
    }
});

router.delete('/info',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const playlist_id   = req.body.playlist_id;
    const reqSongList   = req.body.songList;

    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            id      : "",
            name    : "",
            user_id : "",
            list    : []
        })
    }else{
        const user_id      = loginStatus['_id'];
        database.collection('playlist').find({'_id':ObjectId(playlist_id)}).toArray(function(err,playlistData){

            const filterData = playlistData[0]['list'].filter( filterItem => {
                return reqSongList.some( someItem => {
                    return String( filterItem )==String( someItem['_id'] );
                })!=true;
            })
            
            database.collection('playlist').update({_id : ObjectId(playlist_id)},{$set:{ 'list':filterData }},()=>{
                database.collection('songs').find().toArray(function(err,songData){
                    database.collection('albums').find().toArray(function(err,albumData){
                        songData = songData.filter( filterItem => {
                            return filterData.some( someItem => {
                                return String(someItem)==String(filterItem['_id']);
                            })
                        }).map( item => {
                            const albums = albumData.filter((aItem)=>{
                                if( String(item['album_id'])==String(aItem['_id']) ){
                                    return aItem['cover'];
                                }
                            });
                            return item = { ...item,"cover":albums[0]['cover'] }
                        })

                        res.json({
                            code    : 1,
                            msg     : "成功",
                            id      : playlist_id,
                            name    : playlistData[0]['name'],
                            user_id : user_id,
                            list    : songData
                        })
                    });
                });
            });
        });
    }
});

module.exports = router;