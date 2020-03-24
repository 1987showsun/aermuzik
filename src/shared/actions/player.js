/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export const onPlayer = ( data ) => {
    return( dispatch ) => {
        
        const { _id }           = data;
        const playlist          = JSON.parse(sessionStorage.getItem('PL')) || [];
        const checkForExistence = playlist.some( item => String(item['_id'])==String(_id) );
        if( !checkForExistence ){
            sessionStorage.setItem('PL',JSON.stringify([...playlist, data]));
        }else{
            sessionStorage.setItem('PL',JSON.stringify( playlist.filter(item => String(item['_id'])!=String(_id)) ));
        }
        dispatch({
            type : 'PLAYLIST_SET',
            list : JSON.parse(sessionStorage.getItem('PL'))
        })
    }
}

export const singlePlay = ( actionType,data ) => {
    return( dispatch ) => {
        sessionStorage.setItem('songCurrentlyPlaying',JSON.stringify(data));
        dispatch({
            type        : 'SONG_CURRENTLY_PLAYING',
            actionType  : actionType,
            current     : JSON.parse(sessionStorage.getItem('songCurrentlyPlaying'))
        });
    }
}