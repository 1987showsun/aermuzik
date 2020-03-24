/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default function artists(
    state = {
        id      : '',
        type_id : '',
        list    : []
    },action
){
    switch(action.type){
        case 'COMMENT_LIST':
            state = { 
                ...state, 
                id       : action._id,
                type_id  : action.type_id,
                list     : action.list
            };
            break;
    }
    return state;
}