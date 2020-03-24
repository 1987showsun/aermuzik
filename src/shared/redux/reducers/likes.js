/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default (
    state = {
        album        : [],
        albumCount   : 0,
        albums       : [],
        artist       : [],
        artistCount  : 0,
        artists      : [],
        likeStatus   : false
    },action
)=>{
    switch(action.type){
        case 'LIKE_ALBUMS':
            state = { 
                ...state, 
                likeStatus  : action.likeStatus
            };
            break;

        case 'LIKE_FALSE_ALBUMS':
            state = { 
                ...state, 
                album   : action.list
            };
            break;

        case 'LIKE_TRUE_ALBUMS':
            state = { 
                ...state, 
                albums  : action.list
            };
            break;

        case 'LIKE_COUNT_ALBUMS':
            state = {
                ...state,
                albumCount: action.count
            }
            break;

        case 'LIKE_ARTISTS':
            state = { 
                ...state, 
                likeStatus  : action.likeStatus
            };
            break;

        case 'LIKE_FALSE_ARTISTS':
            state = { 
                ...state, 
                artist  : action.list
            };
            break;

        case 'LIKE_TRUE_ARTISTS':
            state = { 
                ...state, 
                artists : action.list
            };
            break;

        case 'LIKE_COUNT_ARTISTS':
            state = {
                ...state,
                artistCount: action.count
            }
            break;
    }
    return state;
}