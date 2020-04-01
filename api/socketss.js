/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */
const io                = require('socket.io');
const MongoClient       = require('mongodb').MongoClient;
const express           = require('express');
const router            = express.Router();
const guessbase_url     = 'mongodb://127.0.0.1:27017/music';
let   datetime          = new Date();
let   database;

MongoClient.connect(guessbase_url,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err,client ) {
  database = client.db('music');
});

router.get('/', function(req, res, next) {
  io.on('connection', socket => {
      //經過連線後在 console 中印出訊息
      console.log('success connect!')
      //監聽透過 connection 傳進來的事件
      socket.on('getMessage', message => {
          //回傳 message 給發送訊息的 Client
          socket.emit('getMessage', message)
      })
  })
});

module.exports = router;