/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect, useRef }  from 'react';
import { connect }                    from 'react-redux';

const Audio = ({loop, current, audioStatus, actionType, headleCurrentSong}) => {

    const audio       = useRef(null);
    const { _id }     = current;

    useEffect(()=>{
        const audioREF   = audio['current'];
        audioREF.src     = current.src;
        audioREF.onloadedmetadata = () => {

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
                const PL         = JSON.parse(sessionStorage.getItem('PL')) || [];
                switch( loop ){
                    case 2:
                        audioREF.currentTime = 0;
                        audioREF.play();
                        break;

                    default:
                        let nextSong = PL.findIndex( item => String(item['_id'])==String(current['_id']))+1;
                        nextSong = nextSong>=PL.length? 0 : nextSong;
                        if( loop==1 ){
                            audioREF.src = PL[nextSong]['src'];
                            headleCurrentSong(PL[nextSong]);
                        }else{
                            if( nextSong==0 ){
                                audioREF.pause();
                            }else{
                                audioREF.src = PL[nextSong]['src'];
                                headleCurrentSong(PL[nextSong]);
                            }
                        }
                        break;
                }
            }

            audioREF.ontimeupdate  = () => {
                status = {
                    ...status,
                    currentTime : audioREF.currentTime,
                }
                audioStatus(status);
            }
        }
    },[_id]);

    useEffect(()=>{
        const audioREF   = audio['current'];
        audioREF.onended = () => {
            const PL         = JSON.parse(sessionStorage.getItem('PL')) || [];
            switch( loop ){
                case 2:
                    audioREF.currentTime = 0;
                    audioREF.play();
                    break;

                default:
                    let nextSong = PL.findIndex( item => String(item['_id'])==String(current['_id']))+1;
                    nextSong = nextSong>=PL.length? 0 : nextSong;
                    if( loop==1 ){
                        audioREF.src = PL[nextSong]['src'];
                        headleCurrentSong(PL[nextSong]);
                    }else{
                        if( nextSong==0 ){
                            audioREF.pause();
                        }else{
                            audioREF.src = PL[nextSong]['src'];
                            headleCurrentSong(PL[nextSong]);
                        }
                    }
            }
        };
    },[loop]);

    return(
        <audio ref={audio} controls={false} style={{ position: 'fixed', zIndex: 100 }}/>
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