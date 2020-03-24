/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import toaster                                             from "toasted-notes";
import queryString                                         from 'query-string';

// Actions
import { like, likePlural }                                from '../../actions/likes';
import { info }                                            from '../../actions/albums';
import { collection }                                      from '../../actions/collection';
import { onPlayer, singlePlay }                            from '../../actions/player';
import { playlistFolder, playlistFolderExpand }            from '../../actions/member';

export default (handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val}) => {

    const { pathname, search } = location;
    const albums_id            = match['params']['id'];
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
                dispatch( collection(pathname,{ method: 'put', type: 'albums'},{id: val['_id']}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                        dispatch( info(pathname,{...queryString.parse(search), id: albums_id}) );
                    }

                    toasterFunction({ status, status_text });
                });
                break;

            case 'collectionSongs':
                // 收藏歌曲
                break;

            case 'albumsLike':
                // 喜歡專輯
                dispatch( like(pathname,{ method: 'put', type: 'albums'},{id: val['_id']}) ).then( res => {
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
                dispatch( likePlural(pathname,{...queryString.parse(search), method: 'put', type: 'albums'},{id: val['_id']}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';
                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                        dispatch( info(pathname,{...queryString.parse(search), id: albums_id}) );
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
        }
    }
}