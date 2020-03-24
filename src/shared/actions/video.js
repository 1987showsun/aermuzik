/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

export const mv = (pathname, query, data) => {
    return(dispatch) => {
        const { type }   = data;
        const method     = 'get';
        const initQuery  = {
            v_crrent     : 1,
            limit        : 20
        };
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['mv'][type]}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { data } = res;
            dispatch({
                type  : `${type.toUpperCase()}_MV`,
                list  : data['list']
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
            authorization: typeof window !== 'undefined'? sessionStorage.getItem('jwt_vendor') : '',
        }
    });
}