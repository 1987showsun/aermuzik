/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect, useRef }  from 'react';
import { connect }                    from 'react-redux';

const Audio = ({current, audioStatus, actionType}) => {

    const audio       = useRef(null);
    const { _id }     = current;
    const [ stateSongId , setSongId       ] = useState(null);
    const [ stateCurrent, setStateCurrent ] = useState(current);

    useEffect(()=>{
        //console.log('current',current);
        setSongId( current['_id'] );
        setStateCurrent(current);
        const audioREF = audio['current'];
        audioREF.src   = current.src;
        audioREF.onloadeddata = () => {

            let status = {
                audio       : audioREF,
                onplay      : false,
                duration    : audioREF.duration,
                currentTime : 0
            };

            audioActionType( audioREF, actionType );
            
            audioStatus(status);

            audioREF.onplay = () => {
                status = {
                    ...status,
                    onplay      : true
                }
                audioStatus(status);
            }
            
            audioREF.onpause = () => {
                status = {
                    ...status,
                    onplay      : false
                }
                audioStatus(status);
            }

            audioREF.onended = () => {
                status = {
                    ...status,
                    currentTime : 0
                }
                audioREF.currentTime = status['currentTime'];
                audioStatus(status);
            }

            audioREF.ontimeupdate  = () => {
                status = {
                    ...status,
                    currentTime : audioREF.currentTime,
                }
                audioStatus(status);
            }
        }
        // return ()=>{
        //     setStateCurrent(current);
        // }
    },[_id]);

    return(
        <audio ref={audio} controls={false} />
    );
}

const audioActionType = ( audioREF, actionType ) => {
    switch( actionType ){
        case 'singlePlay':
            audioREF.play();
            break;

        default:
            break;
    }
}

const mapStateToProps = state => {
    return{
        actionType : state.playlist.actionType,
        current    : state.playlist.current
    }
}

export default connect( mapStateToProps )( Audio );