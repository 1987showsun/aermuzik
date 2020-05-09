/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useEffect, useRef }  from 'react';
import { connect }                   from 'react-redux';

// Actions
import { getSongSrc }                from '../../../actions/songs';

const Audio = ({dispatch, loop, current, audioStatus, actionType, headleCurrentSong}) => {

    const audio       = useRef(null);
    const { _id }     = current;

    useEffect(()=>{
        const audioREF     = audio['current'];
        const songs_id     = current['_id'];
        const audioSetting = ({ src="" }) => {
            audioREF.src     = src;
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
                            if( PL.length>0 ){
                                let nextSong = PL.findIndex( item => String(item['_id'])==String(current['_id']))+1;
                                nextSong = nextSong>=PL.length? 0 : nextSong;
                                if( loop==1 ){
                                    // audioREF.src = PL[nextSong]['src'];
                                    headleCurrentSong(PL[nextSong]);
                                }else{
                                    if( nextSong==0 ){
                                        audioREF.pause();
                                    }else{
                                        //audioREF.src = PL[nextSong]['src'];
                                        headleCurrentSong(PL[nextSong]);
                                    }
                                }
                            }else{
                                audioREF.currentTime = 0;
                                if( loop==1 ){
                                    audioREF.play();
                                }else{
                                    audioREF.pause();
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
        }

        dispatch( getSongSrc({ query: { songs_id } }) ).then( res => {
            audioSetting({ src: res['data']['src'] });
        });
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
                    if( PL.length>0 ){
                        let nextSong = PL.findIndex( item => String(item['_id'])==String(current['_id']))+1;
                        nextSong = nextSong>=PL.length? 0 : nextSong;
                        if( loop==1 ){
                            //audioREF.src = PL[nextSong]['src'];
                            headleCurrentSong(PL[nextSong]);
                        }else{
                            if( nextSong==0 ){
                                audioREF.pause();
                            }else{
                                //audioREF.src = PL[nextSong]['src'];
                                headleCurrentSong(PL[nextSong]);
                            }
                        }
                    }else{
                        audioREF.currentTime = 0;
                        if( loop==1 ){
                            audioREF.play();
                        }else{
                            audioREF.pause();
                        }
                    }
                    break;
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