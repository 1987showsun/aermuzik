/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios                from 'axios';
import dayjs                from 'dayjs';
import jwt                  from 'jsonwebtoken';
import queryString          from 'query-string';
import apiURL               from './url';

export const signIn = (pathname="", query={}, data={}) => {
    return( dispatch ) => {

        const method     = 'post';
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['signin']}${search!=""? `?${search}`:''}`;

        return Axios({method, url, data}).then(res => {
            const { token } = res['data'];
            sessionStorage.setItem('jwtToken', token);
            dispatch({
                type      : "MEMBER_SIGNIN",
                jwtToken  : token,
                info      : jwt.verify(token, ' '),
            });
            return res;
        })
    }
}

// 登出
export const clearMemberInfo = () => {
    return(dispatch) => {
        dispatch({
            type   : "MEMBER_INFO",
            info   : {}
        })
    }
}

// 會員資料
export const info = (pathname="", query={}, data={}) => {
    return( dispatch ) => {

        const method     = 'get';
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['info']}${search!=""? `?${search}`:''}`;

        return Axios({method, url, data}).then(res => {
            const { info } = res['data'];
            dispatch({
                type   : "MEMBER_INFO",
                info   : info
            })

            return res;
        });
    }
}

// 專輯收藏列表
export const albumsCollection = ({method="get", query={}, data={}}) => {
    return(dispatch) => {
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['albums']}${search!=""? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            const { total, limit, current, list } = res['data'];
            dispatch({
                type  : 'COLLECTION_ALBUMS',
                total,
                limit,
                current,
                list
            })
            return res;
        });
    }
}

// 歌曲收藏列表
export const songsCollection = ({method="get", query={}, data={}}) => {
    return(dispatch) => {
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['songs']}${search!=""? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            const { total, limit, current, list } = res['data'];
            dispatch({
                type  : 'COLLECTION_SONGS',
                total,
                limit,
                current,
                list
            })
            return res;
        });
    }
}

// 歌單夾CRUD
export const playlistFolder = ({method="get", query={}, data={}}) => {
    return(dispatch) => {
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['playlist']}${search!=""? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            const { total, limit, current, list } = res['data'];
            dispatch({
                type    : 'PLAYLIST_FOLDER',
                total,
                limit,
                current,
                list   : list.sort((a,b)=> b['date']-a['date']).map( item => {
                    return {
                        ...item,
                        date : dayjs(item['date']).format('YYYY / MM / DD')
                    }
                })
            })
            return res;
        }).catch(err => err['response']);
    }
}

export const playlistFolderExpand = ({method='get', query={}, data={}}) => {
    return(dispatch) => {
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['playlistExpand']}${search!=""? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            dispatch({
                type   : "PLAYLIST_EXPAND",
                list   : res['data']
            })
            return res;
        }).catch(err => err['response']);
    }
};

// 歌單夾 - 歌曲
export const playlistDetail = ({method="get", query={}, data={}}) => {
    return(dispatch) => {
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['playlistDetail']}${search!=""? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            const { name, total, list } = res['data'];
            dispatch({
                type    : 'PLAYLIST_DETAIL',
                name, 
                total, 
                list
            });
            return res;
        });
    }
}

// 更換會員大頭照
export const changeMemberCover = (pathname="", query={}, data={}) => {
    return (dispatch) => {

        const method     = 'put';
        const initQuery  = {};
        const search     = queryString.stringify({...initQuery, ...query});
        const url        = `${apiURL['member']['changeCover']}${search!=""? `?${search}`:''}`;

        return Axios({method, url, data}).then(res => {
            const { info } = res['data'];
            dispatch({
                type   : "MEMBER_INFO",
                info   : info
            })
            return res;
        }).catch( err => err['response'] );
    }
}

export const coverCrop = ({ before="", after="" }) => {
    return (dispatch) => {
        dispatch({
            type    : 'COVER_CROP',
            before  : before,
            after   : after
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