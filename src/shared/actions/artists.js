/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios                from 'axios';
import queryString          from 'query-string';
import apiURL               from './url';

// Actions
import { songsList }        from './songs';
import { albumsArtists }    from './albums';
import { mv }               from './video';
import { commentList }      from './comment';


export const artists = (pathname, query, data) => {
    return(dispatch)=> {

        const method     = 'get';
        const initQuery  = {
            current : 1,
            limit   : 20
        };
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['artists']['list']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { data } = res;
            dispatch({
                type    : "ARTISTS_LIST",
                list    : data['list']
            })
        });
    }
}

export function artistsInfo(pathname,query,data){
    return( dispatch, NODE_ENV )=>{

        const method      = 'get';
        const initQuery   = {};
        const search      = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['artists']['info']}${search!=""? `?${search}`:''}`;

        return Axios({method, url, data}).then(res => {
            const { data } = res;
            dispatch({
                type    : "ARTISTS_INFO",
                info    : data
            });

            dispatch({
                type    : `LIKE_COUNT_ARTISTS`,
                count   : data['likeCount']
            })
            return res;
        });
    }
}

export const ssrArtistsInfo = (pathname="",query={},data={}) => {

    const pathnameArray    = pathname.split('/').filter( item => item!='' );
    const artists_id       = pathnameArray['1'];
    const songsInitQuery   = {
        ...query,
        current    : query['songsCurrent'] || 1,
        artists_id : artists_id
    };
    const albumsInitQuery  = {
        ...query,
        type       : 'ARTISTS_OTHER_ARTISTS',
        current    : query['albumsCurrent'] || 1,
        class      : 'artists',
        class_id   : artists_id
    };

    return(dispatch) => {
        return artistsInfo(pathname, {...query, artists_id}, data)(dispatch).then( res => {
            return songsList(pathname,songsInitQuery, data)(dispatch).then( res => {
                return albumsArtists(pathname,{ id: artists_id, type: 'ARTISTS_OTHER_ARTISTS' }, data)(dispatch).then( res => {
                    return mv(pathname,{...query, t_type: 'artists', id: artists_id}, {...data, type: 'artists'})(dispatch).then( res => {
                        return commentList(pathname,{ type: 'artist', type_id: artists_id })(dispatch);
                    } )
                });
            });
        });
    }
}

export const ssrArtists = (pathname="",query={},data={}) => {
    return(dispatch)=>{
        return artists(pathname, query, data)(dispatch);
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