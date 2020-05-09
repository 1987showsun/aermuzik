/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const jwt               = require('jsonwebtoken');
const guessbase_url     = 'mongodb://127.0.0.1:27017/music';
const MongoClient       = require('mongodb').MongoClient;
const ObjectId          = require('mongodb').ObjectID;
const express           = require('express');
const router            = express.Router();
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

router.get('/info', ensureToken, (req, res, next) => {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const userId       = loginStatus!=undefined? loginStatus['_id'] : '';
    const { id }       = req.query;

    database.collection('albums').find().toArray(function(err,albumData){
        database.collection('collection').find().toArray(function(err,collectionData){
            database.collection('albumslike').find().toArray(function(err,albumslikeData){
                database.collection('songslike').find().toArray(function(err,songslikeData){

                    const findAlbum        = albumData.find( findItem => String(findItem['_id'])==String(id) );
                    const { artists_id }   = findAlbum;
                    const otherAlbums      = albumData.filter( item => String(item['artists_id'])==String(artists_id)).filter( item => String(item['_id'])!=String(id));

                    database.collection('artists').find({_id:ObjectId( artists_id )}).toArray(function(err,artistsData){       
                        database.collection('songs').find({album_id: ObjectId(id) }).toArray(function(err,songData){
                            database.collection(`albumslike`).find({albums_id: ObjectId(id)}).toArray(function(err, data){
                                songData = songData.map( item => {
                                    return {
                                        ...item,
                                        cover : findAlbum['cover']
                                    }
                                });

                                res.json({
                                    album          : { 
                                        ...findAlbum,
                                        artists : artistsData[0]['name']
                                    },
                                    artist         : { ...artistsData[0] },
                                    songs          : songData.map( item => {
                                        if( loginStatus!=undefined ){
                                            delete item['src_general'];
                                            return item;
                                        }else{
                                            item = { ...item, src: item['src_general'] };
                                            delete item['src_general'];
                                            return item;
                                        }
                                    }),
                                    otherAlbums    : otherAlbums.map( item => {
                                        if( loginStatus!=undefined ){
                                            const userCollectionFind = collectionData.find( findItem => String(findItem['user_id'])==String(userId));
                                            const albumslikeFind     = albumslikeData.find( findItem => String(findItem['albums_id'])==String(item['_id']));
                                            const likeStatus         = albumslikeFind['list'].some( someItem => String(someItem['user_id'])==String(userId));
                                            const collectionStatus   = userCollectionFind['albums'].some( someItem => String(someItem)==String(item['_id']));
                                            item = { 
                                                ...item,
                                                likeStatus       : likeStatus,
                                                collectionStatus : collectionStatus
                                            }
                                        }
                                        return {
                                            ...item,
                                            artists : artistsData[0]['name']
                                            
                                        }
                                    }),
                                    count            : data[0]['count']
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/views', ensureToken, (req, res, next) => {

    const { id }       = req.query;

    database.collection('albumsViews').find({albums_id: ObjectId(id)}).toArray(function(err,albumsViewsData){

        const albumsViewsCount = albumsViewsData[0]['count']+1;

        database.collection('albumsViews').update({albums_id:ObjectId(id)},{$set:{ count: albumsViewsCount }},()=>{
            res.json({
                count : albumsViewsCount
            })
        });
    });
});

router.get('/artists',ensureToken ,function(req, res, next) {

    const { id, current=1, limit=12 } = req.query;
    const displayQuantity = limit*current;
    const loginStatus     = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const userId          = loginStatus!=undefined? loginStatus['_id'] : '';
    
    database.collection('albums').find({artists_id:ObjectId(id)}).toArray(function(err,albumAll){
        database.collection('artists').find().toArray(function(err,artistsData){
            database.collection('collection').find().toArray(function(err,collectionData){
                database.collection('albumslike').find().toArray(function(err,albumslikeData){

                    const displayData = albumAll.sort((a,b) => b['issue_date']-a['issue_date']).map( item => {
                        const artistsFind = artistsData.find( findItem => String(findItem['_id']) == String(item['artists_id']));
                        if( loginStatus!=undefined ){
                            const userCollectionFind = collectionData.find( findItem => String(findItem['user_id'])==String(userId));
                            const albumslikeFind     = albumslikeData.find( findItem => String(findItem['albums_id'])==String(item['_id']));
                            const likeStatus         = albumslikeFind['list'].some( someItem => String(someItem['user_id'])==String(userId));
                            const collectionStatus   = userCollectionFind['albums'].some( someItem => String(someItem)==String(item['_id']));
                            item = { 
                                ...item,
                                likeStatus       : likeStatus,
                                collectionStatus : collectionStatus
                            }
                        }
                        return { 
                            ...item, 
                            artists: artistsFind['name']
                        }
                    }).filter((filterIte,i) => i<displayQuantity);

                    res.json({
                        current  : current,
                        limit    : limit,
                        total    : albumAll.length,
                        list     : displayData,
                    });
                });
            });
        });
    });
});

router.get('/', ensureToken, function(req, res, next) {

    const loginStatus  = jwt.verify(req.token, ' ',(err, data)=>{return data});
    const { current=1, limit=36, lang='chinese' } = req.query;
    const userId      = loginStatus!=undefined? loginStatus['_id'] : '';
    let   _find       = {};

    if( lang!="all" ){
        _find = { ..._find, lang: lang }
    }

    database.collection('albums').find(_find).toArray(function(err,allData){
        database.collection('albums').find(_find).sort({issue_date:-1}).skip(0).limit(limit*current).toArray(function(err,data){
            database.collection('artists').find().toArray(function(err,artistsData){
                database.collection('albumslike').find().toArray(function(err,albumslikeData){
                    database.collection('collection').find().toArray(function(err,collectionData){
                        data = data.filter(filterItem => filterItem['name']!="").map((dataItem)=>{

                            const artistsFind = artistsData.find(singerItem => String(dataItem['artists_id'])==String(singerItem['_id']));

                            if( loginStatus!=undefined ){
                                const userCollectionFind = collectionData.find( findItem => String(findItem['user_id'])==String(userId));
                                const albumslikeFind     = albumslikeData.find( findItem => String(findItem['albums_id'])==String(dataItem['_id']));
                                const likeStatus         = albumslikeFind['list'].some( someItem => String(someItem['user_id'])==String(userId));
                                const collectionStatus   = userCollectionFind['albums'].some( someItem => String(someItem)==String(dataItem['_id']));
                                dataItem = { 
                                    ...dataItem, 
                                    likeStatus       : likeStatus,
                                    collectionStatus : collectionStatus
                                };
                            }

                            return {
                                ...dataItem,
                                artists : artistsFind['name']
                            }
                        });
            
                        res.json({
                            lang       : lang,
                            total      : allData.length,
                            current    : current,
                            limit      : limit,
                            list       : data
                        });

                    });
                });
            });
        });
    });
});

router.get('/rankings', function(req, res, next) {

    const lang      = req.query.lang          || "chinese";
    const type      = req.query.type          || "";
    const limit     = Number(req.query.limit) || 10;
    let   find      = {};
    if( lang!='all' ){
        find = { ...find, lang: lang }
    }

    database.collection('albums').find( find ).limit(limit).sort({like:-1}).toArray(function(err,allData){
        database.collection('artists').find().toArray(function(err,artistsData){
            allData = allData.map( item => {
                const artists = artistsData.filter( filterItem => {
                    return String(filterItem['_id'])==String( item['artists_id'] );
                })
                return { ...item,artists: artists[0]['name'] }
            });

            res.json({
                code        : 1,
                msg         : "成功",
                lang        : lang,
                type        : type,
                list        : allData
            })
        });
    });
});

module.exports = router;