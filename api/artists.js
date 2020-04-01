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

router.get('/like/count',ensureToken ,function(req, res, next) {
    const artists_id      = req.query.artists_id;
    database.collection('artists').find({_id:ObjectId(artists_id)}).toArray(function(err,artistsData){
        res.json({
            code  : 1,
            msg   : '成功',
            like  : artistsData[0]['like']
        })
    });
});

router.get('/info',ensureToken ,function(req, res, next) {

  const loginStatus    = jwt.verify(req.token, ' ',(err, data)=>{return data});
  const userId         = loginStatus!=undefined? loginStatus['_id'] : '';
  const { artists_id } = req.query;

  database.collection('artists').find({_id:ObjectId(artists_id)}).toArray(function(err,artistsData){
    database.collection('artistslike').find({artists_id:ObjectId(artists_id)}).toArray(function(err,artistslikeData){

      const count = artistsData[0]['count']+1;
      artistsData  = [{ ...artistsData[0],count:count }];
      
      database.collection('artists').update({_id:ObjectId(artists_id)},{$set:{ "count":Number(count) }},()=>{

        artistsData = artistsData.map( item => {
          return { ...item, cover: `${item['cover']}`, background: `${item['background']}` }
        })
        
        res.json({
            ...artistsData[0],
            likeCount   : artistslikeData[0]['list'].length
        });
      });
    });
  });
});

router.get('/', function(req, res, next) {

    const loginStatus     = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const absoluteURL     = req.protocol + '://' + req.get('host');
    const _query          = req.query;
    const _current        = Number(_query['current']) || 1;
    const _limit          = Number(_query['limit'])   || 36;
    const _lang           = _query['lang']            || 'chinese';
  
    database.collection('artists').find({ lang:_lang }).toArray(function(err,allData){
      database.collection('artists').find({ lang:_lang }).sort({like:-1}).skip(0).limit(_limit).toArray(function(err,data){
  
          allData = allData.filter( filterItem => {
            return filterItem['name']!='';
          })
  
          data.filter((filterItem,i)=>{
            if( filterItem['name']!="" ){
              filterItem['cover']      = `${filterItem['cover']}`;
              filterItem['background'] = `${filterItem['background']}`;
              return filterItem;
            }
          })
  
          res.json({
            lang    : _lang,
            total   : allData.length,
            current : _current,
            limit   : _limit,
            list    : data
          });
      });
    });
  });

module.exports = router;