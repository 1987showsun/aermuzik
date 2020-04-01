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
const dayjs             = require('dayjs');
const router            = express.Router();
let   datetime          = new Date();
let   database;

const milliseconds      = dayjs().valueOf();

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

router.get('/artists',ensureToken, function(req, res, next) {

    const { t_type, id, v_crrent, limit } = req.query;

    database.collection('mv').find({ [`${t_type}_id`]:ObjectId(id) }).sort({count:-1}).toArray(function(err,videoData){
        database.collection('albums').find().sort({count:-1}).toArray(function(err,albumData){
            
            videoData = videoData.map( item => {
                const findAlbum =  albumData.find( findItem => String(findItem['_id'])==String(item['album_id']));
                return{
                    ...item,
                    albums : Object.keys(findAlbum).length>0? findAlbum['name'] : ''
                }
            });

            res.json({
                code      : 1,
                msg       : "成功",
                t_type    : t_type,
                id        : id,
                current   : v_crrent,
                limit     : limit,
                list      : videoData
            })
        });
    });
});

router.get('/albums',ensureToken, function(req, res, next) {
    const {  t_type, id, v_crrent, limit } = req.query;

    database.collection('mv').find({ [`${t_type}_id`]:ObjectId(id) }).sort({count:-1}).toArray(function(err,videoData){
        if( videoData.length!=0 ){
            const { album_id } = videoData[0];
            database.collection('mv').find({ album_id:ObjectId(album_id) }).sort({count:-1}).toArray(function(err,videoData){
                database.collection('albums').find({ _id:ObjectId(id) }).sort({count:-1}).toArray(function(err,albumData){
                    res.json({
                        code      : 1,
                        msg       : "成功",
                        class     : t_type,
                        class_id  : id,
                        current   : v_crrent,
                        limit     : limit,
                        list      : videoData.map( item => {
                            return {
                                ...item,
                                albums : albumData[0]['name']
                            }
                        }),
                        albumInfo : albumData[0]
                    })
                });
            });
        }else{
            res.json({
                code      : 1,
                msg       : "成功",
                class     : t_type,
                class_id  : id,
                current   : v_crrent,
                limit     : limit,
                list      : [],
                albumInfo : {}
            })
        }
    });
});

router.put('/count',ensureToken, function(req, res, next) {
    const _v_id = req.body.v;
    
    database.collection('mv').find({ v_id:_v_id }).toArray(function(err,videoData){
        if( videoData.length!=0 ){
            const _id    = videoData[0]['_id'];
            let   _count = videoData[0]['count']+1;
            database.collection('mv').update({ _id : ObjectId(_id)},{$set:{ count:_count }},( err,result )=>{
                res.json({
                    code : 1,
                    msg  : "修改成功",
                    data : {}
                })
            });
        }
    });
});

router.post('/',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            list    : null
        })
    }else{
        
    }
});

router.put('/',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const body          = req.body;
    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            list    : null
        })
    }else{

    }
});

router.delete('/',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const body          = req.body;
    if( loginStatus==undefined ){
        res.json({
            code    : 0,
            msg     : "尚未登入",
            list    : null
        })
    }else{

    }
});

module.exports = router;