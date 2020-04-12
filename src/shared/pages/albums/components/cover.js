/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { Link }                       from 'react-router-dom';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faPlay, faStar, faHeart, faEye, faShareAlt }from '@fortawesome/free-solid-svg-icons';

const Cover = ({type='albums', data={}, collections={}, likeStatus={}, likesAlbumCount=0, viewsAlbumCount=0, callAction }) => {

    const { _id, cover, name, intro, artists, artists_id } = data;

    return(
        <div className="row relative row-cover">
            <figure className={`info-cover ${type}`}>
                <div className="img">
                    <img src={cover} alt={name} title=""/>
                </div>
                <figcaption>
                    <h1>{name}</h1>
                    {
                        artists!=undefined || type=='albums' ? (
                            <div className="artists-name"><Link to={`/artists/${artists_id}`}>{artists}</Link></div>
                        ): null
                    }
                    <ul className="statistics">
                        <li>
                            <i><FontAwesomeIcon icon={faHeart}/></i>
                            <div className="statistics-value">{likesAlbumCount}</div>
                        </li>
                        <li>
                            <i><FontAwesomeIcon icon={faEye}/></i>
                            <div className="statistics-value">{viewsAlbumCount}</div>
                        </li>
                    </ul>
                    <div className="desc" dangerouslySetInnerHTML={{__html: intro}} />
                    <ul className="action">
                        {
                            type=='albums' &&
                                <>
                                    <li><button className="text" onClick={callAction.bind(this,"playAll",data)}><FontAwesomeIcon icon={faPlay}/><span>FULL PLAY</span></button></li>
                                    <li className={`${collections[type].includes(_id)}`}><button className="text" onClick={callAction.bind(this,"collectionAlbums",data)}><FontAwesomeIcon icon={faStar}/><span>COLLECTION</span></button></li>
                                </>
                        }
                        <li className={`${likeStatus}`}><button onClick={callAction.bind(this,"albumsLike",data)}><FontAwesomeIcon icon={faHeart}/></button></li>
                        <li className={``}><button onClick={callAction.bind(this,"share",data)}><FontAwesomeIcon icon={faShareAlt}/></button></li>
                    </ul>
                </figcaption>
            </figure>
            <div className="bg-img" style={{'backgroundImage': `url(${cover})`}}></div>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        viewsAlbumCount  : state.albums.viewsCount,
        likesAlbumCount  : state.likes.albumCount,
        likeStatus       : state.likes.likeStatus
    }
}

export default connect(mapStateToProps)(Cover);