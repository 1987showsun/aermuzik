/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default function artists(
    state = {
        artistsTotal           : 0,
        artistsList            : [],
        artistsInfo            : {},
        artistsSong            : [],
        artistsAlbums          : [],
        artistsMv              : []
    },action
){
    switch(action.type){
        case 'ARTISTS_LIST':
            state = { 
                ...state, 
                artistsTotal  : action.total,
                artistsList   : action.list
            };
            break;

        case 'ARTISTS_INFO':
            state = {
                ...state,
                artistsInfo   : action.info
            }
            break;

        case 'ARTISTS_SONGS':
            state = {
                ...state,
                artistsSong   : action.list
            }
            break;

        case 'ARTISTS_OTHER_ARTISTS':
            state = {
                ...state,
                artistsAlbums : action.list
            }
            break;

        case 'ARTISTS_MV':
            state = {
                ...state,
                artistsMv     : action.list
            }
            break;
    }
    return state;
}