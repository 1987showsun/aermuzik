/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
import React                                               from 'react';
import toaster                                             from "toasted-notes";
import queryString                                         from 'query-string';

// Actions
import { like, likePlural }                                from '../../actions/likes';
import { info }                                            from '../../actions/albums';
import { ssrArtistsInfo }                                  from '../../actions/artists';
import { ssrRanking }                                      from '../../actions/ranking';
import { collection }                                      from '../../actions/collection';
import { onPlayer, singlePlay }                            from '../../actions/player';
import { playlistFolder, playlistFolderExpand }            from '../../actions/member';



export default (handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val, source="albums"}) => {

    const { pathname, search } = location;
    const id                   = match['params']['id'];
    const toasterFunction      = ({status='failure' , status_text=''}) => {
        toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
            position    : "bottom-right",
            duration    : 3000
        });
    }

    if( jwtToken==undefined ){
        handleCallbackStatus({
            type   : 'unLogin',
            status : true
        });
    }else{
        switch( actionType ){
            case 'playAll':
                // 播放全部
                break;

            case 'collectionAlbums':
                // 收藏專去
                dispatch( collection({method: 'put', query:{type:'albums'}, data:{id:val['_id']}}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                        switch( source ){
                            case 'albums':
                                dispatch( info(pathname,{...queryString.parse(search), id: id}) );
                                break;

                            case 'ranking':
                                dispatch( ssrRanking( pathname,{...queryString.parse(search)}) );
                                break;
                        }
                    }

                    toasterFunction({ status, status_text });
                });
                break;

            case 'collectionSongs':
                // 收藏歌曲
                break;

            case 'albumsLike':
                // 喜歡專輯
                dispatch( like({method: 'put', query:{type: 'albums'}, data:{id: val['_id']}}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                    }

                    toasterFunction({ status, status_text });
                });
                break;

            case 'albumsLikePlural':
                dispatch( likePlural({method:'put', query:{...queryString.parse(search), type: 'albums'}, data:{id: val['_id']}}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';
                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                        switch( source ){
                            case 'albums':
                                dispatch( info(pathname,{...queryString.parse(search), id: id}) );
                                break;

                            case 'artists':
                                dispatch( ssrArtistsInfo(pathname,{...queryString.parse(search)}) );
                                break;

                            case 'ranking':
                                dispatch( ssrRanking( pathname,{...queryString.parse(search)}) );
                                break;

                            default:
                                break;
                        }
                        
                    }

                    toasterFunction({ status, status_text });
                });
                break;

            case 'songsLike':
                // 喜歡歌曲
                break;

            case 'share':
                // 分享
                break;

            case 'singlePlay':
                // 單曲播放
                dispatch( singlePlay(actionType, val) );
                break;

            case 'playlistFolder':
                dispatch( playlistFolder({}) ).then( res => {
                    dispatch( playlistFolderExpand({}) ).then( res => {
                        handleCallbackStatus({
                            current_id : val['_id'],
                            type       : 'playlistFolder',
                            status     : true
                        })
                    });
                });
                // 播放清單資料夾
                break;

            case 'addPlaylist':
                // 加入播放清單
                dispatch( onPlayer(val) );
                break;

            case 'artistsLike':
                // 喜歡歌手
                dispatch( like({method: 'put', query:{type: 'artists'}, data:{id: val['_id']}}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                    }

                    toasterFunction({ status, status_text });
                });
                break;
        }
    }
}