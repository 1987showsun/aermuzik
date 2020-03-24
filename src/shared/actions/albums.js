/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import queryString from 'query-string';
import apiURL      from './url';

// Actions
import { mv }      from './video';
import { commentList } from './comment';

export const albums = (pathname, query, data) => {
    return(dispatch) => {

        const method     = 'get';
        const initQuery  = {
            current : 1,
            limit   : 30
        };
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['albums']['list']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { type, list } = res['data'];
            dispatch({
                type     : 'ALBUMS_LIST',
                list     : list
            })
            return res;
        })
    }
}

export const albumsArtists = (pathname, query, data) => {
    return(dispatch) => {

        const method     = 'get';
        const initQuery  = {
            current : 1,
            limit   : 12
        };
        const search     = queryString.stringify({ ...initQuery, ...query });
        const url        = `${apiURL['albums']['artists']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            
            const { type, list } = res['data'];

            dispatch({
                type         : 'OTHER_ALBUMS',
                otherAlbums  : list
            })
            return res;
        })
    }
}

export const info = (pathname, query, data) => {
    return(dispatch) => {

        const { type='' }   = query;
        const method        = 'get';
        const initQuery     = {};
        const search        = queryString.stringify({ ...initQuery, ...query });
        const url           = `${apiURL['albums']['info']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            
            const { album, artist, songs, otherAlbums, count } = res['data'];

            dispatch({
                type        : 'ALBUM_INFO',
                info        : album
            });

            dispatch({
                type        : 'ALBUM_ARTIST',
                info        : artist
            });

            dispatch({
                type        : 'ALBUM_SONGS',
                songsList   : songs
            });

            dispatch({
                type        : 'OTHER_ALBUMS',
                otherAlbums : otherAlbums
            });

            dispatch({
                type  : `LIKE_COUNT_${type.toUpperCase()}`,
                count : count
            });

            return res;
        })
    }
}

export const views = (pathname,query={},data={}) => {
    return( dispatch ) => {

        const { type='' }   = query;
        const method        = 'get';
        const initQuery     = {};
        const search        = queryString.stringify({ ...initQuery, ...query });
        const url           = `${apiURL['albums']['views']}${search!=""? `?${search}`:''}`;

        return Axios({method,url,data}).then( res => {
            const { count } = res['data'];
            dispatch({
                type  : `ALBUMS_VIEWS_COUNT`,
                count : count
            });
            return res;
        });
    }
}

export const ssrAlbumsInfo = (pathname,query={},data={}) => {
    return( dispatch ) => {
        return info(pathname,{...query}, data)(dispatch).then( res => {
            return mv(pathname,{...query, t_type: 'album' }, {...data, type: 'albums'})(dispatch).then( res => {
                return commentList(pathname,{ type: 'album', type_id: query['id'] })(dispatch);
            });
        });
    }
}

export const ssrAlbums = (pathname,query={},data={}) => {
    return( dispatch ) => {
        return albums(pathname, query, data)(dispatch);
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