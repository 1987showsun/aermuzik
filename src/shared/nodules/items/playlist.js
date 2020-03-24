/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React            from 'react';
import { Link }         from 'react-router-dom';
import { FontAwesomeIcon }    from '@fortawesome/react-fontawesome';
import { faHeart, faPlus, faFolderPlus }from '@fortawesome/free-solid-svg-icons';

 // Components
 import Tool             from './components/tool';

 export default class Songs extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            data : props.data
        }
    }

    static getDeivedStateFromProps(props,state){
        return null;
    }

     render(){

        const { data } = this.state;
        const { idx, cover, name, album, album_id } = data;

        return(
            <div className="songs-item">
                <div className="sort">{idx!=undefined? (String(idx+1).length<2? `0${idx+1}`:idx+1):(null)}</div>
                <div className="img">
                     <img src={cover} alt={name} title="" />
                </div>
                <div className="desc">
                    <h3 onClick={this.toolAction.bind(this,'singlePlay')}>{name}</h3>
                    <h4>
                        <Link to={`/albums/${album_id}`}>{album}</Link>
                    </h4>
                </div>
                <Tool>
                    <li onClick={this.toolAction.bind(this,'songsLike')}><i><FontAwesomeIcon icon={faHeart}/></i><span className="text">Like</span></li>
                    <li onClick={this.toolAction.bind(this,'addPlaylist')}><i><FontAwesomeIcon icon={faPlus}/></i><span className="text">Add Playlist</span></li>
                    <li onClick={this.toolAction.bind(this,'playlistFolder')}><i><FontAwesomeIcon icon={faFolderPlus}/></i><span className="text">Add Playlist Folder</span></li>
                    <li onClick={this.toolAction.bind(this,'collectionSongs')}><i><FontAwesomeIcon icon={faFolderPlus}/></i><span className="text">Add Songs</span></li>
                </Tool>
            </div>
        );
    }

     toolAction = (type) => {
        if( this.props.callAction!=undefined ){
            const { data } = this.state;
            this.props.callAction( type, data );
        }
     }
 }