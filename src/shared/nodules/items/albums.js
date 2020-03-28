/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link }                     from 'react-router-dom';
import { FontAwesomeIcon }          from '@fortawesome/react-fontawesome';
import { faHeart, faPlay, faStar }  from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage }            from 'react-lazy-load-image-component';
import $                            from 'jquery';

// Components
import Tool                         from './components/imgTool';

//stylesheets
import './public/stylesheets/style.scss';

export default ({data, handleAction}) => {

    const { _id, cover, name, artists, artists_id, likeStatus, collectionStatus } = data;
    const itemBlock           = useRef(null);
    const [ itemH, setItemH ] = useState(100);

    const handleTool = ( actionType, val ) => {
        if( handleAction!=undefined ){
            handleAction( actionType, val );
        }
    }

    useEffect(()=>{
        const itemResize = () => {
            const { current } = itemBlock;
            const item_w      = $(current).width();
            setItemH( item_w );
        }
        itemResize();
        window.addEventListener('resize',itemResize);
        return() => {
            window.removeEventListener('resize',itemResize);
        }
    },[]);

    return(
        <figure ref={itemBlock} className="common-item-style album-item">
            <div className="img" style={{height:itemH }}>
                <Tool>
                    <li className={`sub-tool ${collectionStatus}`} onClick={handleTool.bind(this,'collectionAlbums',data)}><FontAwesomeIcon icon={faStar} /></li>
                    <li onClick={handleTool.bind(this,'fullplay')}><FontAwesomeIcon icon={faPlay} /></li>
                    <li className={`sub-tool ${likeStatus}`} onClick={handleTool.bind(this,'albumsLikePlural',data)}><FontAwesomeIcon icon={faHeart} /></li>
                </Tool>
                <Link to={`/albums/${_id}`} title={name}></Link>
                <LazyLoadImage 
                    alt    = {name}
                    src    = {cover}
                    effect = {'blur'}
                />
            </div>
            <figcaption>
                <h3><Link to={`/albums/${_id}`}>{name}</Link></h3>
                <h4><Link to={`/artists/${artists_id}`}>{artists}</Link></h4>
            </figcaption>
        </figure>
    );
}