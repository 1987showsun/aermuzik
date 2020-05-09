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

router.get('/', ensureToken, function(req, res, next) {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.json({
            status      : 400,
            status_text : '尚未登入'
        });
    }else{
        const { _id }       = loginStatus;
        const { type, id  } = req['query'];
        database.collection('collection').find({ user_id: ObjectId(_id) }).toArray(function(err,data){
            res.json({
                type : type.toUpperCase(),
                list : data[0][type]
            })
        });
    }    
});

router.put('/', ensureToken, function(req, res, next) {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.status(400).json({
            status      : 400,
            status_text : '尚未登入'
        });
    }else{

        const { _id }   = loginStatus;
        const { type }  = req['query'];
        const { id }    = req['body'];

        database.collection('collection').find({ user_id: ObjectId(_id) }).toArray(function(err,data){
            database.collection(type).find({ _id: ObjectId(id) }).toArray(function(err,typeData){

                const COLLECTION_ID = data[0]['_id'];
                let   typCount      = Number(typeData[0]['collectionCount'] || 0);
                let   collectionIds = data[0][type].filter( item => String(item)!=String(id) );
                const collectionStatus = data[0][type].some( idItem => String(idItem)==String(id));
                if( !collectionStatus ){
                    collectionIds = [ ...collectionIds, ObjectId(id) ];
                    typCount      = typCount+1;
                }else{
                    typCount      = typCount>0? typCount-1 : 0;
                }

                database.collection(type).update({
                    _id : ObjectId(id)
                },{
                    $set:{ 
                        'collectionCount': typCount
                    }
                },() => {
                    database.collection('collection').update({ 
                        _id : ObjectId(COLLECTION_ID)
                    },
                    {
                        $set:{ 
                            [type]: collectionIds
                        }
                    },()=>{
                        res.json({
                            type : type.toUpperCase(),
                            list : collectionIds
                        })
                    });
                });
            });
        });
    }    
});

module.exports = router;