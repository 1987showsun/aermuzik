/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect, useCallback }  from 'react';
import { connect }                    from 'react-redux';
import $ from 'jquery';

// Components
import Timeline                       from './components/timeline';
import Cover                          from './components/cover';
import Control                        from './components/control';
import Tool                           from './components/tool';
import Audio                          from './components/audio';
import Volume                         from './components/volume';
import MobilePlaylist                 from './components/mobilePlaylist';
import MobileSubControl               from './components/mobileSubControl';

// Actions
import { singlePlay }                 from '../../actions/player';

// Stylesheets
import './public/stylesheets/style.scss';

const Index = ({dispatch, current}) => {

    const [ stateShowPlaylist  , setShowPlaylist     ] = useState(false);
    const [ stateWindow        , setWindowStatus     ] = useState(false);
    const [ stateAudioStatus   , setStateAudioStatus ] = useState({});
    const [ loopStatus         , setLoopStatus       ] = useState(0);
    const [ changeAudioControl , setAudioControl     ] = useState('');

    useEffect(()=>{
        const windowResize = () => {
            const body_w = $('body').width();
            if( body_w>720 ){
                setAudioControl('pc');
            }else{
                setAudioControl('mobile');
            }
        }
        windowResize();
        window.addEventListener('resize',windowResize);
        return() => {
            window.removeEventListener('resize',windowResize);
        }
    },[]);

    const unfold = () => {
        setWindowStatus( stateWindow? false:true );
    }
    const handleSubControl = ( actionType ) => {
        console.log( actionType );
        switch( actionType ){
            case 'playlist':
                setShowPlaylist( stateShowPlaylist? false:true );
                break;

            case 'lyrics':
                break;

            default:
                break;
        }
    }

    return(
        <>
            <Audio
                loop              = {loopStatus}
                audioStatus       = {status => setStateAudioStatus(status)}
                headleCurrentSong = {val    => dispatch( singlePlay('singlePlay',val) )}
            />
            {
                changeAudioControl=='pc'?(
                    <div className={`audio-wrap-pc`}>
                        <Timeline audioStatus={stateAudioStatus}/>
                        <div className="audio-container">
                            <Cover
                                handleWindow = {(val)=>{ setWindowStatus(val) }}
                            />
                            <Control
                                current       = {current}
                                audio         = {stateAudioStatus['audio']} 
                                onplay        = {stateAudioStatus['onplay']}
                                handleLoop    = {(val) => setLoopStatus(val)}
                                headleChange  = {(val) => dispatch( singlePlay('singlePlay',val) )}
                            />
                            <Tool />
                        </div>
                    </div>
                ):(
                    <div className={`audio-wrap-mobile ${stateWindow}`}>
                        <div className="audio-wrap-mobile-head" onClick={unfold.bind(this)}></div>
                        <Cover
                            className    = {`mobile-cover ${stateShowPlaylist}`}
                            handleWindow = {(val)=>{ setWindowStatus(val) }}
                        />
                        <MobilePlaylist
                            showPlaylist = {stateShowPlaylist}
                            className    = {stateShowPlaylist}
                        />
                        <Timeline audioStatus={stateAudioStatus} />
                        <Control
                            current       = {current}
                            audio         = {stateAudioStatus['audio']} 
                            onplay        = {stateAudioStatus['onplay']}
                            handleLoop    = {(val) => setLoopStatus(val)}
                            headleChange  = {(val) => dispatch( singlePlay('singlePlay',val) )}
                        />
                        <Volume 
                            audioStatus = {stateAudioStatus}
                            stateWindow = {stateWindow}
                        />
                        <MobileSubControl 
                            showPlaylist     = {stateShowPlaylist}
                            handleSubControl = {handleSubControl}
                        />
                        <div className="background-cover" style={{"backgroundImage": `url(${current['cover']})`}}></div>
                    </div>
                )
            }
        </>
    );
}

const mapStateToProps = state => {
    return{
        current: state.playlist.current
    }
}

export default connect( mapStateToProps )( Index );