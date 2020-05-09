/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

export const kv = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {};
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['kv']}${search!=''? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { total, list } = res['data'];
            dispatch({
                type     : "HOME_KV",
                total    : total,
                list     : list
            })
            return res;
        })
    }
}

export const latestAlbums = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {
            current : 1,
            limit   : 10
        };
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['albums']['latest']}${search!=''? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { list } = res['data'];
            dispatch({
                type     : "HOME_LATEST_ALBUMS",
                list     : list
            })
            return res;
        })
    }
}

export const hitoArtists = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {
            current : 1,
            limit   : 10
        };
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['artists']['hito']}${search!=''? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { list } = res['data'];
            dispatch({
                type     : "HOME_HITO_ARTISTS",
                list     : list
            })
            return res;
        })
    }
}
export const songsRanking = (pathname, query={}, data={}) => {
    return(dispatch) => {

        const method    = 'get';
        const initQuery = {
            sortVal       :-1,
            limit         :10
        };
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['songs']['popular']}${search!=''? `?${search}`:''}`;

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

export const ssrHome = (pathname, query={}, data={}) => {
    return(dispatch) => {
        return kv( pathname,query,data )(dispatch).then( res => {
            return latestAlbums( pathname,query,data )(dispatch).then(res => {
                return hitoArtists( pathname,query,data )(dispatch).then( res => {
                    return songsRanking( pathname,{actionType:"HOME_SONGS_POPULAR", sortKey:"like",...query},data )(dispatch).then( res => {
                        return songsRanking( pathname,{actionType:"HOME_SONGS_COLLECTION", sortKey:"collection",...query},data )(dispatch).then( res => {
                            return res;
                        });
                    });
                });
            });
        });
    }
}

const Axios = ( api ) => {
    return axios({
        method   : api['method'],
        url      : api['url'],
        data     : api['data'],
        headers  : {
            authorization: typeof window !== 'undefined'? `Basic ${sessionStorage.getItem('jwtToken')}` : '',
        }
    });
}