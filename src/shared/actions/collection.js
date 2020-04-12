/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

export const collection = ({method='get', query={}, data={}}) => {
    return (dispatch) => {

        const initQuery  = {};
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['collection']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { type, list } = res['data'];
            dispatch({
                type  : `COLLECTION_${type}`,
                list  : list
            })
            return res;
        }).catch( err => err['response'] );
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