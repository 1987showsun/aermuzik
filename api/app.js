/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const express           = require('express');
const cors              = require('cors');
const app               = express();
const path              = require('path');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const server            = require('http').createServer();
const request           = require("request");
const cheerio           = require("cheerio");
const http              = require('http');
const https             = require('https');
const fs                = require('fs');

//router
const api               = require('./nomal');
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

const privateKey  = fs.readFileSync('./stting/server.key', 'utf8');
const certificate = fs.readFileSync('./stting/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin                 : '*',
  methods                : ["PUT","POST","GET","DELETE","OPTIONS"],
  allowedHeaders         : ["Content-Type","Content-Length","Authorization","Accept","X-Requested-With"],
  credentials            : true,
  optionsSuccessStatus   : 200
}));

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

// const io = require('socket.io')(5001, {
//   path           : '/socket.io',
//   serveClient    : false,
//   pingInterval   : 10000,
//   pingTimeout    : 5000,
//   cookie         : false
// });

// Socket test
// io.on('connection', socket => {
//   //經過連線後在 console 中印出訊息
//   console.log('success connect!')
//   //監聽透過 connection 傳進來的事件
//   socket.on('getMessage', message => {
//       console.log( message );
//       //回傳 message 給發送訊息的 Client
//       socket.emit('getMessage', message)
//   })
//   socket.emit('getMessage', "33333");
// })

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


const httpServer  = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
const port = 3001;

app.listen(port, () => `Server running on port ${port}`);
//server.listen(5001);
// httpServer.listen(3000);
//httpsServer.listen(3000);