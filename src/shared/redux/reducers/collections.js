/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default (
    state = {
        albums   : [],
        artists  : []
    },action
)=>{
    switch(action.type){
        case 'COLLECTION_ALBUMS':
            state = { 
                ...state, 
                albums   : action.list
            };
            break;

        case 'COLLECTION_ARTISTS':
            state = { 
                ...state, 
                artists  : action.list
            };
            break;
    }
    return state;
}