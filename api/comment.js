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
const dayjs             = require('dayjs');
const router            = express.Router();
let   datetime          = new Date();
let   database;

const milliseconds = dayjs().valueOf();

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

router.get('/',ensureToken, function(req, res, next) {
    const { type, type_id } = req['query'];
    database.collection('comment').find({ type, type_id: ObjectId(type_id) }).sort({'modifytime':1}).toArray(function(err, data ){

        if( data.length==0 ){
            res.json({
                _id  : '',
                type,
                type_id,
                list : []
            })
        }else{
            const { _id, type, type_id, list } = data[0];
            res.json({
                _id,
                type,
                type_id,
                list
            })
        }
    });
});

router.post('/',ensureToken, function(req, res, next){

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.status(400).json({
            status       : 400,
            status_text  : "尚未登入"
        })
    }else{
        
        const { _id, nickname }       = loginStatus;
        const { type, type_id, text } = req['body'];
        const createtime              = dayjs().valueOf();

        const getCommentList          = () => {
            database.collection('comment').find({ type: type, type_id: ObjectId(type_id) }).sort({'modifytime':1}).toArray(function(err,data){
                const { _id, type, type_id, list } = data[0];
                res.json({
                    _id,
                    type,
                    type_id,
                    list
                })
            });
        }


        database.collection('comment').find({ type: type, type_id: ObjectId(type_id) }).toArray(function(err, data ){
            if( data.length>0 ){
                // 已存在的留言
                const COMMENT_ID       = data[0]['_id'];
                const COMMENT_LIST     = data[0]['list'];

                database.collection('comment').update({ 
                    _id : ObjectId(COMMENT_ID)
                },
                {
                    $set:{ 
                        list: [
                            ...COMMENT_LIST,
                            {
                                _id         : ObjectId(),
                                user_id     : ObjectId(_id),
                                name        : `${nickname}`,
                                content     : text,
                                reply       : [],
                                modifytime  : createtime,
                                createtime  : createtime,
                            }
                        ]
                    }
                },()=>{
                    getCommentList();
                })
            }else{
                // 未存在的留言
                database.collection('comment').insert({
                    type    : type,
                    type_id : ObjectId(type_id),
                    list    : [
                        {
                            _id         : ObjectId(),
                            user_id     : ObjectId(_id),
                            name        : `${nickname}`,
                            content     : text,
                            reply       : [],
                            modifytime  : createtime,
                            createtime  : createtime,
                        }
                    ]
                }, ()=>{
                    getCommentList();
                });
            }
        });
    }
});

router.put('/',ensureToken, function(req, res, next) {

    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.status(400).json({
            status       : 400,
            status_text  : "尚未登入"
        })
    }else{

        const { _id, name }           = loginStatus;
        const { type, type_id, text } = req['body'];
        const modifytime              = dayjs().valueOf();
        const { first, last }         = name;


        // const _user_id      = loginStatus['_id'];
        // const _class        = body['class'];
        // const _class_id     = body['class_id'];
        // const _comment_id   = body['comment_id'];
        // const _content      = body['msg'];
        // const _name         = `${loginStatus['name']['first']} ${loginStatus['name']['last']}`;
        // let   _wnatAddData  = [];

        // database.collection('comment').find({ class: _class, class_id: ObjectId(_class_id) }).toArray(function(err,commentData){
        //     commentData[0]['list'].map( item => {
        //         if( String(item['_id']) == String(_comment_id)){
        //             item['content']     = _content;
        //             item['update_date'] = datetime.valueOf();
        //             _wnatAddData = {...item};
        //             return item;
        //         }
        //     })

        //     const _id = commentData[0]['_id'];
        //     delete commentData[0]['_id'];

        //     database.collection('comment').update({ _id : ObjectId(_id)},{$set:{ ...commentData[0] }},()=>{
        //         res.json({
        //             code     : 1,
        //             msg      : '新增成功',
        //             content  : _wnatAddData
        //         })
        //     });
        // });
    }
});

router.delete('/',ensureToken, function(req, res, next) {
    const loginStatus   = jwt.verify(req.token, ' ',(err, data)=>{return data});

    if( loginStatus==undefined ){
        res.status(400).json({
            status       : 400,
            status_text  : "尚未登入"
        })
    }else{

        const { id, single_comment_id } = req['body'];

        database.collection('comment').find({ _id: ObjectId(id) }).toArray(function(err, data ){
            const { list }   = data[0];
            const filterList = list.filter( item => String(item['_id'])!=String(single_comment_id) );
            database.collection('comment').update({ _id : ObjectId(id)},{$set:{ list: [...filterList] }},()=>{
                database.collection('comment').find({_id: ObjectId(id)}).sort({'modifytime':1}).toArray(function(err,data){
                    const { _id, type, type_id, list } = data[0];
                    res.json({
                        _id,
                        type,
                        type_id,
                        list
                    })
                });
            });
        });
    }
});

module.exports = router;