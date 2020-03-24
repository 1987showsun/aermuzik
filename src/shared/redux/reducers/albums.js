/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default function albums(
    state = {
        viewsCount       : 0,
        albumsTotal      : 0,
        albumsList       : [],
        info             : {},
        artist           : {},
        songs            : [],
        otherAlbums      : [],
        albumsMv         : []
    },action
){
    switch(action.type){
        case 'ALBUMS_LIST':
            state = { 
                ...state, 
                albumsTotal  : action.total,
                albumsList   : action.list
            };
            break;

        case 'ALBUM_INFO':
            state = {
                ...state,
                info   : action.info
            }
            break;

        case 'ALBUM_ARTIST':
            state = {
                ...state,
                info   : state.info
            }
            break;

        case 'ALBUMS_VIEWS_COUNT':
            state = {
                ...state,
                viewsCount   : action.count
            }
            break;

        case 'ALBUM_SONGS':
            state = {
                ...state,
                songs   : action.songsList
            }
            break;

        case 'OTHER_ALBUMS':
            state = {
                ...state,
                otherAlbums : action.otherAlbums
            }
            break;

        case 'ALBUMS_MV':
            state = {
                ...state,
                albumsMv     : action.list 
            }
            break;

    }
    return state;
}