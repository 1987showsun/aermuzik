/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import dayjs       from 'dayjs';
import apiURL      from './url';

export const commentList = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method     = 'get';
        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['comment']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { _id, type_id, list } = res['data'];
            dispatch({
                type: "COMMENT_LIST",
                _id      : _id,
                type_id  : type_id,
                list     : list.sort((a,b) => b['modifytime']-a['modifytime'] ).map( item => {
                    return {
                        ...item,
                        createtime  : dayjs(item['createtime']).format('YYYY/MM/DD hh:mm'),
                        modifytime  : dayjs(item['modifytime']).format('YYYY/MM/DD hh:mm'),
                    }
                })
            })
            return res;
        })
    }
}

export const commentPost = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method     = 'post';
        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['comment']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { _id, type_id, list } = res['data'];
            dispatch({
                type: "COMMENT_LIST",
                _id      : _id,
                type_id  : type_id,
                list     : list.sort((a,b) => b['modifytime']-a['modifytime'] ).map( item => {
                    return {
                        ...item,
                        createtime  : dayjs(item['createtime']).format('YYYY/MM/DD hh:mm'),
                        modifytime  : dayjs(item['modifytime']).format('YYYY/MM/DD hh:mm'),
                    }
                })
            })
            return res;
        })
    }
}

export const commentDelete = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method     = 'delete';
        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['comment']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { _id, type_id, list } = res['data'];
            dispatch({
                type: "COMMENT_LIST",
                _id      : _id,
                type_id  : type_id,
                list     : list.sort((a,b) => b['modifytime']-a['modifytime'] ).map( item => {
                    return {
                        ...item,
                        createtime  : dayjs(item['createtime']).format('YYYY/MM/DD hh:mm'),
                        modifytime  : dayjs(item['modifytime']).format('YYYY/MM/DD hh:mm'),
                    }
                })
            })
            return res;
        })
    }
}

const Axios = ( api ) => {
    return axios({
        method   : api['method'],
        url      : api['url'],
        data     : api['data'],
        headers:{
            authorization: typeof window !== 'undefined'? `Basic ${sessionStorage.getItem('jwtToken')}` : '',
        }
    });
}