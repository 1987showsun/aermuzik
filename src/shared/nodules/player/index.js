/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';

// Components
import Timeline                       from './components/timeline';
import Cover                          from './components/cover';
import Control                        from './components/control';
import Tool                           from './components/tool';
import Audio                          from './components/audio';

// Actions
import { singlePlay }                 from '../../actions/player';

// Stylesheets
import './public/stylesheets/style.scss';

const Index = ({dispatch, current}) => {

    const [ stateWindow     , setWindowStatus     ] = useState(false);
    const [ stateCurrent    , setStateCurrent     ] = useState({});
    const [ stateAudioStatus, setStateAudioStatus ] = useState({});
    const [ loopStatus      , setLoopStatus       ] = useState(0);

    useEffect(()=>{
        setStateCurrent(current);
        return ()=>{
            setStateCurrent(current);
        }
    },[current]);

    return(
        <>
            <Audio
                loop              = {loopStatus}
                audioStatus       = {status => setStateAudioStatus(status)}
                headleCurrentSong = {val    => dispatch( singlePlay('singlePlay',val) )}
            />
            <div className={`audio-wrap ${stateWindow}`}>
                <Timeline audioStatus={stateAudioStatus}/>
                <div className="audio-container">
                    <Cover
                        handleWindow = {(val)=>{ setWindowStatus(val) }}
                    />
                    <Control 
                        audio         = {stateAudioStatus['audio']} 
                        onplay        = {stateAudioStatus['onplay']}
                        handleLoop    = {(val) => setLoopStatus(val)}
                    />
                    <Tool />
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return{
        current: state.playlist.current
    }
}

export default connect( mapStateToProps )( Index );