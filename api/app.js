/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express           = require('express');
const app               = express();
const path              = require('path');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const server            = require('http').createServer();
const request           = require("request");
const cheerio           = require("cheerio");

//router
const api               = require('./api');
const like              = require('./like');
const user              = require('./user');
const songs             = require('./songs');
const video             = require('./video');
const albums            = require('./albums');
const search            = require('./search');
const artists           = require('./artists');
const playlist          = require('./playlist');
const collection        = require('./collection');
const comment           = require('./comment');
const io                = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);
  else  next();
});

app.use('/v1/api'        , api         );
app.use('/v1/like'       , like        );
app.use('/v1/user'       , user        );
app.use('/v1/songs'      , songs       );
app.use('/v1/video'      , video       );
app.use('/v1/albums'     , albums      );
app.use('/v1/search'     , search      );
app.use('/v1/artists'    , artists     );
app.use('/v1/comment'    , comment     );
app.use('/v1/playlist'   , playlist    );
app.use('/v1/collection' , collection  );

// Socket test
// io.on('connection', (socket)=>{
//   console.log('a user connected');
//   socket.emit('broadcast','socket emit test1');
//   socket.on('broadcast', function(msg){
//     console.log('--->',msg);
//     console.log(`user disconnected ${msg}`);
//   });
// });

// 爬蟲
// request({
//   url: "http://blog.infographics.tw",
//   method: "GET"
// },(e,r,b) => { 
//   /* e: 錯誤代碼 */
//   /* b: 傳回的資料內容 */
//   var $ = cheerio.load(b);
//   var result = [];
//   var titles = $("li.item h2");
//   for(var i=0;i<titles.length;i++) {
//     result.push($(titles[i]).text());
//   }
//   console.log( result );
// });

const port = 3000;

app.listen(port, () => `Server running on port ${port}`);
//server.listen(5001);