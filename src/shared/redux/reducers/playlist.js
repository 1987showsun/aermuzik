/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default (
    state={
        list        : [],
        actionType  : null,
        current     : {},
        lrcSrc      : "",
        lyric       : []
    },
    action
) => {
    switch(action.type){
        case 'PLAYLIST_SET':
            state = { 
                ...state, 
                list    : action.list 
            };
            break;

        case 'SONG_CURRENTLY_PLAYING':
            state = { 
                ...state, 
                actionType : action.actionType,
                current    : action.current 
            };
            break;

        case 'SONG_SET_LRC':
            state = {
                ...state,
                lrcSrc : action.src,
                lyric  : action.lyric
            }
            break;

        default:
            state = { 
                ...state,
                list       : typeof window!=='undefined'? (JSON.parse(sessionStorage.getItem('PL')) || []):([]),
                current    : typeof window!=='undefined'? (JSON.parse(sessionStorage.getItem('songCurrentlyPlaying')) || {}):({})
            };
            break;
    }

    return state;
}