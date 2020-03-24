/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useMemo }    from 'react';
import { Link }                                   from 'react-router-dom';
import { FontAwesomeIcon }                        from '@fortawesome/react-fontawesome';
import { faHeart, faPlus, faFolderPlus, faClock } from '@fortawesome/free-solid-svg-icons';

 // Components
 import Tool             from './components/tool';

export default ({ data, playlist=[], callAction }) => {

    const { idx, cover, name, album, album_id, _id, src } = data;
    const toolAction = (type) => {
        if( callAction!=undefined ){
            callAction( type, data );
        }
    }
    
    const classActive = useMemo(() => {
        return playlist.includes(_id);
    },[playlist]);

    return(
        <div className="songs-item">
            <div className="sort">{idx!=undefined? (String(idx+1).length<2? `0${idx+1}`:idx+1):(null)}</div>
            <div className="img">
                <img src={cover} alt={name} title="" />
            </div>
            <div className="desc">
                <h3 onClick={toolAction.bind(this,'singlePlay')}>{name}</h3>
                <h4>
                    <Link to={`/albums/${album_id}`}>{album}</Link>
                </h4>
            </div>
            <Tool>
                <li className={``} onClick={toolAction.bind(this,'songsLike')}><i><FontAwesomeIcon icon={faHeart}/></i><span className="text">Like</span></li>
                <li className={`${classActive}`} onClick={toolAction.bind(this,'addPlaylist')}><i><FontAwesomeIcon icon={faPlus}/></i><span className="text">Add Playlist</span></li>
                <li className={``} onClick={toolAction.bind(this,'playlistFolder')}><i><FontAwesomeIcon icon={faFolderPlus}/></i><span className="text">Add Playlist Folder</span></li>
                <li className={``} onClick={toolAction.bind(this,'collectionSongs')}><i><FontAwesomeIcon icon={faClock}/></i><span className="text">Play later</span></li>
            </Tool>
        </div>
    );
}