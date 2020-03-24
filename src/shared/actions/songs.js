/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

export const songsList = (pathname,query={},data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {
            limit   : 10,
            current : 1
        };
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['songs']['list']}${search!=''? `?${search}`:''}`;

        return Axios({method,url,data}).then(res => {
            const { data } = res;
            dispatch({
                type    : "ARTISTS_SONGS",
                list    : data['list']
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