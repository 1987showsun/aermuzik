/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default function home(
    state = {
        kvTotal               : 0,
        kvList                : [],
        albumsList            : [],
        artistsList           : [],
        songsPopularList      : [],
        songsCollectionList   : []
    },action
){
    switch(action.type){
        case 'HOME_KV':
            state = { 
                ...state, 
                kvTotal  : action.total,
                kvList   : action.list
            };
            break;

        case 'HOME_LATEST_ALBUMS':
            state = {
                ...state,
                albumsList : action.list
            }
            break;

        case 'HOME_HITO_ARTISTS':
            state = {
                ...state,
                artistsList : action.list
            }
            break;

        case 'HOME_SONGS_POPULAR':
            state = {
                ...state,
                songsPopularList : action.list
            }
            break;

        case 'HOME_SONGS_COLLECTION':
            state = {
                ...state,
                songsCollectionList: action.list
            }
            break;
    }
    return state;
}