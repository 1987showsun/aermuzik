/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

// Actions
import { songsRanking } from './home';

export const albumsRankings = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {};
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['albums']['ranking']}${search!=''? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { type, list } = res['data'];
            dispatch({
                type     : type,
                list     : list
            })
            return res;
        })

    }
}

export const ssrRanking = (pathname, query={}, data={}) => {
    return(dispatch) => {
        const albumsRanking = ['chinese','japanese','korean','western','soundtrack'];
        return songsRanking(pathname, {actionType:"HOME_SONGS_POPULAR", sortKey:"like",...query}, data)(dispatch).then( res => {
            return albumsRankings(pathname, {type: 'RANKING_ALBUMS_ALL', lang: 'all', limit: 7, ...query}, data )(dispatch).then( res => {
                return albumsRanking.map( key => {
                    return albumsRankings(pathname, {type: `ALBUMS_${key.toUpperCase()}`, lang: key, limit: 12, ...query}, data )(dispatch);
                })
            })
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