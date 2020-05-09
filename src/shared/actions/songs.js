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

export const getSongSrc = ({ method='get',query={}, data={} }) => {
    return( dispatch ) => {
        const initQuery = {};
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['songs']['src']}${search!=''? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            return res;
        }).catch( err => err['response'] );
    }
}

const Axios = ({ method="get", url="", data={} }) => {
    return axios({
        method   : method,
        url      : url,
        data     : data,
        headers  : {
            authorization: typeof window !== 'undefined'? `Basic ${sessionStorage.getItem('jwtToken')}` : '',
        }
    });
}