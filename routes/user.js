/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const jwt               = require('jsonwebtoken');
const dayjs             = require('dayjs');
const guessbase_url     = 'mongodb://127.0.0.1:27017/music';
const MongoClient       = require('mongodb').MongoClient;
const ObjectId          = require('mongodb').ObjectID;
const express           = require('express');
const router            = express.Router();
const datetime          = new Date();
let   database;

MongoClient.connect(guessbase_url,{ useNewUrlParser: true }, function(err,client ) {
    database = client.db('music');
});

const checkLoginStatus = (token) => {
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

router.post('/signin', function(req, res, next) {

    const { username, password } = req.body;
    const body = req.body;

    database.collection('user').find({ username, password }).toArray(function(err,data){

        if( data.length!=0 ){
            delete data[0]['password'];
            res.json({
                status : 200,
                msg    : 'sign in suceesfully',
                token  : `${ jwt.sign(data[0]," ") }`
            });
        }else{
            res.status(400).json({
                status : 400,
                msg    : 'account or password incorrect'
            })
        }
    });
});

router.post('/signup', function(req, res, next) {

    let   body     = req.body;
    const username = req.body.username;

    database.collection('user').find({username:username}).toArray(function(err,userData){
        if( userData.length!=0 ){
            res.json({
                code : 0,
                msg  : 'This account already exists'
            })
        }else{

            delete body['pwdAgain'];
            body = { ...body, level: "general", date: datetime.valueOf() }
            if( !body.hasOwnProperty('cover') ){
                body = { ...body,cover:'' }
            }

            database.collection('user').insert(body,(err,userResult)=>{
                const userResultData = userResult['ops'][0];

                database.collection('collection').insert({
                    user_id       : userResultData['_id'],
                    album         : [],
                    song          : [],
                    listen_record : [],
                    data          : datetime.valueOf()
                },(err,collectionResult)=>{
                    res.json({
                        code : 1,
                        msg  : 'Added successfully'
                    })
                });
            })
        }
    });
});

router.get('/info', ensureToken, function(req, res, next) {

    const token = checkLoginStatus(req.token);
    if( token ){
        
        const { _id, username }      = token;

        database.collection('user').find({ username }).toArray(function(err,data){
            database.collection('usercover').find({ user_id: ObjectId(_id) }).toArray(function(err,usercover){
                if( data.length!=0 ){
                    res.json({
                        info   : {
                            ...data[0],
                            cover  : usercover[0]['src']
                        }
                    });
                }else{
                    res.status(400).json({
                        status      : 400,
                        status_text : 'no members found'
                    })
                }
            });
        });
    }
});

router.post('/otherSignin', function(req, res, next) {
    let   body     = req.body;
    const method   = req.query['method'];
    const username = req.body['username'];

    database.collection('user').find({method:method, username:username}).toArray(function(err,userData){
        if( userData.length!=0 ){
            const user_id = userData[0]['_id'];
            database.collection('user').update(
                {_id : ObjectId(user_id)},
                {$set:{
                    email      : body['email'],
                    name       : body['name'],
                    cover      : body['cover']
                }
            },()=>{
                database.collection('user').find({method:method, username:username}).toArray(function(err,userData){

                    delete userData[0]['password'];
                    delete userData[0]['pwdAgain'];
                    const token = `Basic ${ jwt.sign(userData[0]," ") }`;

                    res.json({
                        code    : 1,
                        "msg"   : '登入成功',
                        "token" : token,
                        "info"  : userData[0]
                    })
                });
            });
        }else{
            body = { ...body, level: "general", method: method, date: datetime.valueOf() }
            database.collection('user').insert(body,(err,userResult)=>{
                const userResultData = userResult['ops'][0];
                database.collection('collection').insert({
                    user_id       : userResultData['_id'],
                    album         : [],
                    song          : [],
                    listen_record : [],
                    data          : datetime.valueOf()
                },(err,collectionResult)=>{
                    
                    delete userResultData['password'];
                    delete userResultData['pwdAgain'];
                    const token = `Basic ${ jwt.sign(userResultData," ") }`;

                    res.json({
                        code    : 1,
                        "msg"   : '登入成功',
                        "token" : token,
                        "info"  : userResultData
                    })
                });
            });
        }
    });
});

router.get('/collection/:key',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.status(400).json({
            status         : 400,
            status_text    : 'you are not logged on'
        })
    }else{

        const { key } = req.params;
        const { _id } = loginStatus;

        database.collection('collection').find({user_id:ObjectId(_id)}).toArray(function(err,data){
            const searchData = data[0][key];

            switch( key ){
                case 'albums':
                    database.collection('albums').find().toArray(function(err,albumData){

                        const filterData        = albumData.filter( item => {
                            return searchData.some( someItem => String(someItem)==String(item['_id']) );
                        });
                        const songIdToArtistsId = filterData.map( item => item['artists_id'] );

                        database.collection('artists').find().toArray(function(err,artistsData){
                            database.collection('albumslike').find().toArray(function(err,albumslikeData){

                                const artistsResults = songIdToArtistsId.map( id=> {
                                    return artistsData.find( findItem => String(findItem['_id'])==String(id) );
                                });

                                const list = filterData.map((item,i) => {

                                    const likeStatus = albumslikeData.some( someItem => {
                                        if( String(someItem['albums_id'])==item['_id'] ){
                                            return someItem['list'].some( subSomeItem => String(subSomeItem)==String(_id));
                                        }
                                    });


                                    return {
                                        ...item,
                                        likeStatus        : likeStatus,
                                        collectionStatus  : true,
                                        artists           : artistsResults[i]['name']
                                    }
                                });

                                res.json({
                                    total   : filterData.length,
                                    limit   : 30,
                                    current : 1,
                                    list    : list
                                });
                            });
                        });
                    });
                    break;

                case 'songs':
                    database.collection('songs').find().toArray(function(err,songData){

                        const filterData        = songData.filter( item => searchData.includes(String(item['_id'])) );
                        const songIdToAlbumsId  = filterData.map( item => item['album_id']   );
                        const songIdToArtistsId = filterData.map( item => item['artists_id'] );

                        database.collection('albums').find().toArray(function(err,albumData){
                            database.collection('artists').find().toArray(function(err,artistsData){
                                const albumsResults  = songIdToAlbumsId.map( id => {
                                    return albumData.find( findItem => String(findItem['_id'])==String(id));
                                });
                                const artistsResults = songIdToArtistsId.map( id=> {
                                    return artistsData.find( findItem => String(findItem['_id']==String(id)));
                                });
                                const list = filterData.map((item,i) => {
                                    delete item['src_general'];
                                    return {
                                        ...item,
                                        artist     : artistsResults[i]['name'],
                                        album      : albumsResults[i]['name'],
                                        cover      : albumsResults[i]['cover']
                                    }
                                });

                                res.json({
                                    total   : filterData.length,
                                    limit   : 30,
                                    current : 1,
                                    list    : list
                                })
                            })
                        });
                    });
                    break;
            }
        });
    }
});

router.put('/collection',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const song_id       = req.body._id;
    const type          = req.body.type;

    if( loginStatus==undefined ){
        res.status(400).json({
            status      : 400,
            status_text : '尚未登入'
        })
    }else{

        const user_id  = loginStatus['_id'];

        database.collection('collection').find({'user_id':ObjectId(user_id)}).toArray(function(err,collectionData){
            database.collection(type).find().toArray(function(err,songData){
                database.collection('albums').find().toArray(function(err,albumData){

                    const collectionData_id = collectionData[0]['_id'];
                    const checkForExistence = collectionData[0][type].some( item => String(item)==String(song_id ) );
                    let   collectionSong    = [];
                    let   code              = 0;
                    let   msg               = "失敗";
                    let   list              = [];
                    if( !checkForExistence ){
                        collectionData[0][type] = [ ...collectionData[0][type] , song_id  ];
                        collectionSong = [...collectionData[0][type]];
                        code           = 1;
                        msg            = "加入成功";
                    }else{
                        collectionSong = collectionData[0][type].filter( item => String(item)!=String(song_id ) );
                        code           = 1;
                        msg            = "刪除成功";
                    }

                    //更新 MongoDB collection table
                    database.collection('collection').update({_id : ObjectId(collectionData_id)},{$set:{ [type]:collectionSong }},()=>{
                        //篩選歌取資料
                        list = songData.filter( item => {
                            return collectionSong.includes( String(item['_id']) );
                        }).map( item => {
                            const name = albumData.filter((aItem)=>{
                                if( String(item['album_id']) == String(aItem['_id']) ){
                                    return aItem['name'];
                                }
                            })
                            return item={...item,"album":name[0]['name'],"cover":name[0]['cover']};
                        })
                        
                        res.json({
                            code      : code,
                            msg       : msg,
                            user_id   : collectionData[0]['user_id'],
                            list      : list
                        })
                    });
                });
            });
        });
    }
});

router.get('/playlist/info', function(req, res, next) {
    const id = req.query.id;
    database.collection('playlist').find({'_id':ObjectId(id)}).toArray(function(err,playlistData){
        database.collection('songs').find().toArray(function(err,songData){
            database.collection('albums').find().toArray(function(err,albumData){
                const playlist_list = playlistData[0]['list'];
                const name          = playlistData[0]['name'];
                const user_id       = playlistData[0]['user_id'];
                const list          = songData.filter((item,i)=>{
                    return playlist_list.find((pItem,p)=>{
                        return pItem==String( item['_id'] );
                    });
                }).map((item)=>{
                    const albums = albumData.filter((aItem)=>{
                        if( String(item['album_id'])==String(aItem['_id']) ){
                            return aItem['cover'];
                        }
                    });
                    return item = { ...item,"cover":albums[0]['cover'] }
                })

                res.json({
                    id,
                    name,
                    user_id,
                    list
                })
            });
        });
    });
});

router.delete('/playlist/info',ensureToken, function(req, res, next) {

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

router.put('/password',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const _data         = req.body;
    if( loginStatus==undefined ){
        res.json({
            code      : 0,
            msg       : '尚未登入'
        })
    }else{
        const _user_id   = loginStatus['_id'];
        database.collection('user').update({_id : ObjectId(_user_id)}, { $set:{ ..._data,update_date: datetime.valueOf() } } ,()=>{ 
            res.json({
                code      : 1,
                msg       : '修改成功'
            })
        });
    }
});

router.put('/info/edit',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    if( loginStatus==undefined ){
        res.json({
            code      : 0,
            msg       : '尚未登入',
            info      : data
        })
    }else{
        const _deleteKey = ['password','date','update_date'];
        const _data      = req.body;
        const _user_id   = loginStatus['_id'];
        delete _data['_id'];

        database.collection('user').update({_id : ObjectId(_user_id)}, { $set:{ ..._data,update_date: datetime.valueOf() } } ,()=>{ 
            database.collection('user').find({_id: ObjectId(_user_id)}).toArray(function(err,userData){
                
                _deleteKey.map( key => {
                    delete userData[0][key];
                });

                res.json({
                    code    : 1,
                    msg     : "成功",
                    info    : userData[0]
                })
            });
        });
    }
});

router.get('/playlist',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    if( loginStatus==undefined ){
        res.status(400).json({
            status      : 400,
            status_text : "尚未登入"
        })
    }else{
        const { _id } = loginStatus;
        database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){
            res.json({
                total     : data.length,
                limit     : 30,
                current   : 1,
                list      : data.map( item => {
                    const { _id, name, date } = item;
                    return { _id, name, date };
                })
            })
        });
    }
});

router.get('/playlist/expand',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){
        const { _id }      = token;
        database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){

            let reMergeObject = {};
            data.forEach( item => {
                const { _id, list } = item;
                reMergeObject = { ...reMergeObject, [_id]: list }
            });
            res.json(reMergeObject)
        });
    }
});

router.put('/playlist/expand',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){
        const { _id }                = token;
        const { folder_id, song_id } = req.body;
        database.collection('playlist').find({_id: ObjectId(folder_id)}).toArray(function(err, data){
            if( data.length!=0 ){
                const callCommonAction = ( list ) => {
                    database.collection('playlist').update({_id : ObjectId(folder_id)},{$set:{ list }},()=>{
                        database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){
                            let reMergeObject = {};
                            data.forEach( item => {
                                const { _id, list } = item;
                                reMergeObject = { ...reMergeObject, [_id]: list }
                            });
                            res.json(reMergeObject)
                        });
                    });
                }
                let { list } = data[0];
                list = list.some(item => String(item)==String(song_id))? list.filter(item => String(item)!=String(song_id)) : [...list, ObjectId(song_id)];
                callCommonAction( list );
            }else{
                res.status(400).json({
                    status      : 400,
                    status_text : 'Sorry, find not you search data'
                })
            }
        });
    }
});

router.post('/playlist',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){

        const { _id  } = token;
        const { name } = req['body'];

        database.collection('playlist').insert({ 
            user_id : ObjectId(_id),
            name    : name,
            date    : dayjs().valueOf(),
            list    : []
        },()=>{
            database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){
                res.json({
                    total     : data.length,
                    limit     : 30,
                    current   : 1,
                    list      : data
                })
            });
        });        
    }
});

router.put('/playlist',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){

        const { id, name } = req['body'];
        const { _id }      = token;

        database.collection('playlist').update({_id : ObjectId(id)},{$set:{ "name": name }},()=>{
            database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){
                res.json({
                    total     : data.length,
                    limit     : 30,
                    current   : 1,
                    list      : data.map( item => {
                        const { _id, name, date } = item;
                        return { _id, name, date };
                    })
                });
            });
        });
    }
});

router.delete('/playlist',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){
        const { id }  = req['query'];
        const { _id } = token;
        database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){
            if( data.length==0 ){
                res.status(400).json({
                    status      : 400,
                    status_text : '無可刪除的資料'
                })
            }else{
                database.collection('playlist').remove({_id:ObjectId(id)},()=>{
                    database.collection('playlist').find({'user_id':ObjectId(_id)}).toArray(function(err, data){                
                        res.json({
                            total     : data.length,
                            limit     : 30,
                            current   : 1,
                            list      : data.map( item => {
                                const { _id, name, date } = item;
                                return { _id, name, date };
                            })
                        });
                    });
                });
            }
        });
    }
});

router.get('/playlistDetail',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){

        const { _id } = token;
        const { id  } = req['query'];

        database.collection('playlist').find({_id : ObjectId(id)}).toArray(function(err,data){

            const { name, list } = data[0];

            database.collection('songs').find().toArray(function(err,songData){

                const filterData = songData.filter( item => {
                    return list.some( someItem => String(someItem)==String(item['_id']));
                });

                database.collection('albums').find().toArray(function(err,albumData){
                    const list = filterData.map( item => {
                        const findItem = albumData.find( findItem => String(item['album_id'])==String(findItem['_id']) );
                        delete item['src_general'];
                        return {
                            ...item,
                            cover : findItem['cover'],
                            album : findItem['name']
                        }
                    });

                    res.json({
                        name  : name,
                        total : list.length,
                        list  : list
                    })
                });
            });
        });
    }
});

router.get('/like/song',ensureToken, function(req, res, next) {
    const token = checkLoginStatus(req.token);
    if( token ){
        let { _id } = token;

        database.collection('collection').find({'user_id':ObjectId(_id)}).toArray(function(err,collectionData){
            database.collection('songs').find().toArray(function(err,songData){
                
                const filterCollectionSongeData = songData.filter( item => {
                    return collectionData[0]['song'].includes( String(item['_id']) );
                })

                res.json({
                    code      : 1,
                    msg       : "成功",
                    user_id   : _id,
                    list      : filterCollectionSongeData
                })
            });
        });
    }
});

router.get('/like',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const type          = req.query.type       || 'song';
    const actionType    = req.query.actionType || 'SONG_LIKE_SET';

    if( loginStatus==undefined ){
        res.json({
            code      : 0,
            msg       : '尚未登入',
            user_id   : "",
            type      : actionType,
            list      : []
        })
    }else{

        const user_id        = loginStatus['_id'];
        let   collectionName = null;

        switch( type ){
            case 'songs' : 
                collectionName = 'songlike';
                break;

            case 'albums':
                collectionName = 'albumlike';
                break;

            case 'artists':
                collectionName = 'artistslike';
                break;
        }

        database.collection(collectionName).find().toArray(function(err,likeData){
            database.collection( type ).find().toArray(function(err,data){
                const filterData = likeData.filter( filterItem => {
                    return filterItem['list'].some( someItem => {
                        return String(someItem['user_id'])==String(user_id);
                    })
                })


                const filterResult = data.filter( filterItem => {
                    return filterData.some( someItem => {
                        return String(someItem[`${type}_id`])==String(filterItem['_id']);
                    })
                })

                res.json({
                    code      : 1,
                    msg       : '成功',
                    user_id   : user_id,
                    type      : actionType,
                    list      : filterResult
                })
            });
        })
    }
})

router.put('/like',ensureToken, function(req, res, next) {
    const loginStatus    = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const type           = req.body.type        || 'song';
    const wantAddId      = req.body.add_id      || "";
    const actionType     = req.body.actionType  || 'SONG_LIKE_SET';
    let   collectionName = null;
    if( loginStatus==undefined ){
        res.json({
            code      : 0,
            msg       : "尚未登入",
            user_id   : "",
            type      : actionType,
            list      : []
        })
    }else{
        
        const user_id        = loginStatus['_id'];
        switch( type ){
            case 'songs' : 
                collectionName = 'songlike';
                break;

            case 'albums':
                collectionName = 'albumlike';
                break;

            case 'artists':
                collectionName = 'artistslike';
                break;
        }

        database.collection(collectionName).find({[`${type}_id`]:ObjectId(wantAddId)}).toArray(function(err,likeData){
            database.collection( type ).find().toArray(function(err,data){
                let listArray    = likeData[0]['list'];
                const checkLike  = listArray.some( someItem => {
                    return String(someItem['user_id'])==String(user_id);
                });

                if( !checkLike ){
                    listArray = [ ...listArray,{ user_id: ObjectId(user_id), date: datetime.valueOf() } ]
                }else{
                    listArray = listArray.filter( item => item['user_id']!=user_id );
                }

                database.collection( collectionName ).update({[`${type}_id`]:ObjectId(wantAddId)},{$set:{ "list":listArray, "count":listArray.length }},()=>{
                    database.collection( type ).update({_id:ObjectId(wantAddId)},{$set:{ "like":listArray.length }},()=>{
                        database.collection( collectionName ).find().toArray(function(err,allLikeData){
                            const filterData = allLikeData.filter( filterItem => {
                                return filterItem['list'].some( someItem => {
                                    return String(someItem['user_id'])==String(user_id);
                                })
                            });

                            const filterResult = data.filter( filterItem => {
                                return filterData.some( someItem => {
                                    return String(someItem[`${type}_id`])==String(filterItem['_id']);
                                })
                            });


                            res.json({
                                code      : 1,
                                msg       : '成功',
                                user_id   : user_id,
                                type      : actionType,
                                list      : filterResult
                            })
                        });
                    });
                })
            });
        });
    }
});

router.put('/changeCover', ensureToken, (req, res, next)=>{    
    const token = checkLoginStatus(req.token);
    if( token ){

        const { _id }      = token;
        const { bucket, key, location } = req.body;
                
        database.collection('usercover').update({user_id:ObjectId(_id)},{$set:{ 
            "bucket"     : bucket,
            "key"        : key,
            "src"        : location, 
            "modifydate" : dayjs().valueOf()  
        }},()=>{
            database.collection('usercover').find({ user_id: ObjectId(_id) }).toArray((err,data) => {
                res.json({
                    info     : {
                        ...token,
                        cover  : data['0']['src'],
                        
                    }
                })
            });
        });
    }
});

function ensureToken(req, res, next) {
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

module.exports = router;