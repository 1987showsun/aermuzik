/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import axios       from 'axios';
import $ from 'jquery';
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

export const getSongSrc = ({ method='get', query={}, data={} }) => {
    return( dispatch ) => {
        const initQuery = {};
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['songs']['src']}${search!=''? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            return res;
        }).catch( err => err['response'] );
    }
}

export const getSongLrc = ({ method='get', query={}, data={} }) => {
    return( dispatch ) => {
        const initQuery = {};
        const search    = queryString.stringify({ ...initQuery, ...query });
        const url       = `${apiURL['songs']['lrc']}${search!=''? `?${search}`:''}`;
        return Axios({method, url, data}).then(res => {
            const { src } = res.data;
            if( src!='' ){
                return axios.get(src).then( lrcres => {
                    const { data="" }  = lrcres;
                    const lyrics       = data.split("\n");
                    const lyricsRegExp = lyrics.filter(item => item!="").map(item => {
                        if( item!="" ){
                            const lyric      = decodeURIComponent(item);
                            const lrcTime    = lyric.match(/\d*:\d*((\.|\:)\d*)*/g);
                            const lrcText    = lyric.replace(/\[\d*:\d*((\.|\:)\d*)*\]/g,'');
                            const min        = Number(lrcTime[0].split(':')[0]);
                            const sec        = Number(lrcTime[0].split(':')[1]);
                            const totalSec   = min*60+sec;
                            return{
                                time: totalSec,
                                text: lrcText
                            }
                        }
                    });
                    dispatch({
                        type     : 'SONG_SET_LRC',
                        src      : src,
                        lyric    : lyricsRegExp
                    })
                });
            }
            dispatch({
                type     : 'SONG_SET_LRC',
                src      : src,
                lyric    : []
            })

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