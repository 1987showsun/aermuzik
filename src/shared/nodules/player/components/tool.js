/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faFileAlt }                  from '@fortawesome/free-solid-svg-icons';

// Components
import Playlist                       from './playlist';

// Actions
import { onPlayer, singlePlay }       from '../../../actions/player';

const Tool = (props) => {

    const [ playlistWrapStatus, setPlaylistWrapStatus ] = useState(false)

    const toolAction = (actionType) => {
        switch(actionType){
            case 'playlist':
                setPlaylistWrapStatus( playlistWrapStatus? false:true );
                break;
        }
    }

    const callAction = ( actionType='', val={} ) => {
        switch( actionType ){
            case 'playAll':
                // 播放全部
                break;

            case 'collectionAlbums':
                // 收藏專去
                break;

            case 'collectionSongs':
                // 收藏歌曲
                break;

            case 'albumsLike':
                // 喜歡專輯
                break;

            case 'songsLike':
                // 喜歡歌曲
                break;

            case 'share':
                // 分享
                break;

            case 'singlePlay':
                // 單曲播放
                props.dispatch( singlePlay(actionType, val) );
                break;

            case 'playlistFolder':
                // 播放清單資料夾
                break;

            case 'addPlaylist':
                // 加入播放清單
                props.dispatch( onPlayer(val) );
                break;
        }
    }

    return(
        <div className="audio-col audioTool">
            <ul className="audioTool-ul">
                <li>
                    <button onClick={toolAction.bind(this,'playlist')}><FontAwesomeIcon icon={faFileAlt}/></button>
                    <Playlist 
                        playlistWrapStatus={playlistWrapStatus}
                        callAction = {callAction.bind(this)}
                    />
                </li>
            </ul>
        </div>
    );
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Tool );