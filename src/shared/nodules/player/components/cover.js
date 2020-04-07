/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { Link }                       from 'react-router-dom';

const Cover = (props) => {

    const { current } = props;
    const [ stateCurrent, setStateCurrent ] = useState({});
    useEffect(()=>{
        setStateCurrent(current);
        return ()=>{
            setStateCurrent(current);
        }
    },[current]);

    const audioWindowStatus = () => {
        if( props.handleWindow!=undefined ){
            props.handleWindow(true);
        }
    }

    const { cover='', album='', name='' } = stateCurrent;

    return(
        <div className="audio-col">
            <figure className="now-play-cover">
                <div className="induction-zone" onClick={audioWindowStatus.bind(this)} />
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