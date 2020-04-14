/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { Link }                       from 'react-router-dom';

const Cover = ({ className="", current}) => {
    const [ stateCurrent, setStateCurrent ] = useState({});
    useEffect(()=>{
        setStateCurrent(current);
    },[current]);

    const { cover='', album='', name='' } = stateCurrent;

    return(
        <div className={`audio-col audio-cover ${className}`}>
            <figure className="now-play-cover">
                <div className={`img ${cover==''? 'null':''}`}>
                    <img src={cover} alt={album} title="" />
                </div>
                <figcaption>
                    <h3>{name==''? 'No song name':name}</h3>
                    <h4><Link to="">{album==''? 'No album':album}</Link></h4>
                </figcaption>
            </figure>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        current: state.playlist.current
    }
}

export default connect( mapStateToProps )( Cover );