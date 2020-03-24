/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

export default function ranking(
    state = {
        rankingAlbumsAll        : [],
        rankingAlbumsChinese    : [],
        rankingAlbumsJapanese   : [],
        rankingAlbumsKorean     : [],
        rankingAlbumsWestern    : [],
        rankingAlbumsSoundtrack : []
    },action
){
    switch(action.type){
        case 'RANKING_ALBUMS_ALL':
            state = { 
                ...state, 
                rankingAlbumsAll  : action.list
            };
            break;

        case 'ALBUMS_CHINESE':
            state = {
                ...state,
                rankingAlbumsChinese : action.list
            }
            break;

        case 'ALBUMS_JAPANESE':
            state = {
                ...state,
                rankingAlbumsJapanese : action.list
            }
            break;

        case 'ALBUMS_KOREAN':
            state = {
                ...state,
                rankingAlbumsKorean : action.list
            }
            break;

        case 'ALBUMS_WESTERN':
            state = {
                ...state,
                rankingAlbumsWestern : action.list
            }
            break;    
        
        case 'ALBUMS_SOUNDTRACK':
            state = {
                ...state,
                rankingAlbumsSoundtrack : action.list
            }
            break;   
    }
    return state;
}