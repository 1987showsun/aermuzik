/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const MongoClient       = require('mongodb').MongoClient;
const express           = require('express');
const router            = express.Router();
const guessbase_url     = 'mongodb://127.0.0.1:27017/music';
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

router.get('/kv', function(req, res, next) {
  database.collection('kv').find().sort({sort:1}).toArray(function(err,kvData){
    const now_date     = datetime.valueOf();
    const list         = kvData.filter( filter => {
      if( Number(now_date) >= Number(filter['start_date']) && Number(now_date)<=Number(filter['end_date']) ){
        return true;
      }
    }).map((item)=>{
      return { ...item, src: `${item['src']}` }
    })

    res.json({
      total    : list.length,
      list     : list
    })
  });
});

module.exports = router;