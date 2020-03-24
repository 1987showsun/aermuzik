/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

export const like = (pathname, query={}, data={}) => {
    return (dispatch) => {

        const method     = query['method'] || 'get';
        const more       = query['more']   || 'false';
        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['like']['single']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { type, count, likeStatus } = res['data'];
            dispatch({
                type        : `LIKE_${type}`,
                likeStatus  : likeStatus
            })
            dispatch({
                type  : `LIKE_COUNT_${type}`,
                count : count
            })
            return res;
        });
    }
}

export const likePlural = (pathname, query={}, data={}) => {
    return(dispatch) => {
        const method     = query['method'] || 'get';
        const more       = query['more']   || 'false';
        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['like']['plural']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            return res;
        });
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