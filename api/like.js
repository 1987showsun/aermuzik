/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

const jwt               = require('jsonwebtoken');
const dayjs             = require('dayjs');
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

router.get('/', ensureToken, function(req, res, next) {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.json({
            status      : 400,
            status_text : '尚未登入'
        });
    }else{

        const { _id  }     = loginStatus;
        const { type, id } = req['query'];

        database.collection(`${type}like`).find({[`${type}_id`]: ObjectId(id)}).toArray(function(err, data){
            res.json({
                type       : type.toUpperCase(),
                likeStatus : data[0]['list'].some( someItem => String(someItem['user_id'])==String(_id)),
                count      : data[0]['count']
            });
        });
    }    
});

router.put('/plural', ensureToken, function(req, res, next) {
    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.json({
            status      : 400,
            status_text : '尚未登入'
        });
    }else{
        const { _id }  = loginStatus;
        const { type, current=1, limit=30 } = req['query'];
        const { id }   = req['body'];

        //console.log( 'type:',type, 'current:',current, 'limit:',limit, 'id:',id );
        database.collection(`${type}like`).find({[`${type}_id`]: ObjectId(id)}).toArray(function(err, data){

            const likeId      = data[0]['_id'];
            let   afterList   = [];
            let   afterCount  = 0;
            let   beforeCount = data[0]['count'];
            let   beforeList  = [...data[0]['list']];
            const status      = beforeList.some( item => String(item['user_id'])==String(_id) );

            if( !status ){
                afterList  = [ 
                    ...beforeList, 
                    {
                        user_id : ObjectId(_id),
                        date    : dayjs().valueOf()
                    }
                ];
                afterCount = beforeCount+1;
            }else{
                afterList = beforeList.filter( item => String(item['user_id'])!=String(_id));
                afterCount = beforeCount-1;
            }

            database.collection(`${type}like`).update({
                _id : ObjectId(likeId)
            },{
                $set:{ 
                    'list'  : [...afterList],
                    'count' : afterCount
                }
            },() => {
                res.json({
                    status          : 'success',
                    status_text     : 'update completed'
                })
            });
        });
    }
});

router.put('/', ensureToken, function(req, res, next) {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.json({
            status      : 400,
            status_text : '尚未登入'
        });
    }else{

        const { _id }  = loginStatus;
        const { type } = req['query'];
        const { id }   = req['body'];

        database.collection(`${type}like`).find({[`${type}_id`]: ObjectId(id)}).toArray(function(err, data){

            const likeId      = data[0]['_id'];
            let   afterList   = [];
            let   afterCount  = 0;
            let   beforeCount = data[0]['count'];
            let   beforeList  = [...data[0]['list']];
            const status      = beforeList.some( item => String(item['user_id'])==String(_id) );

            if( !status ){
                afterList  = [ 
                    ...beforeList, 
                    {
                        user_id : ObjectId(_id),
                        date    : dayjs().valueOf()
                    }
                ];
                afterCount = beforeCount+1;
            }else{
                afterList = beforeList.filter( item => String(item['user_id'])!=String(_id));
                afterCount = beforeCount-1;
            }

            database.collection(`${type}like`).update({
                _id : ObjectId(likeId)
            },{
                $set:{ 
                    'list'  : [...afterList],
                    'count' : afterCount
                }
            },() => {
                database.collection(`${type}like`).find({[`${type}_id`]: ObjectId(id)}).toArray(function(err, data){
                    res.json({
                        type        : type.toUpperCase(),
                        likeStatus  : status? false:true,
                        count       : data[0]['count']
                    });
                });
            });
        });
    }  
});

module.exports = router;