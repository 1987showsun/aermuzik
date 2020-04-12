/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const storageKeys = ( key ) => {
    const storage = typeof window !== 'undefined'? sessionStorage:[];
    return storage[key] || null;
}

export default (
    state={
        info             : {},
        jwtToken         : null,
        albumsCollection : {
            total   : 0,
            limit   : 30,
            current : 1,
            list    : [],
            ids     : []
        },
        songsCollection : {
            total   : 0,
            limit   : 30,
            current : 1,
            list    : [],
            ids     : []
        },
        playlistFolder  : {
            total   : 0,
            limit   : 30,
            current : 1,
            list    : []
        },
        playlistExpand  : {},
        playlistDetail  : {
            name    : '',
            total   : 0,
            list    : []
        },
        coverCrop       : {
            before    : "",
            after     : ""
        }
    },
    action
) => {
    switch(action.type){
        case 'MEMBER_SIGNIN':
            state = { 
                ...state, 
                jwtToken    : storageKeys('jwtToken'),
                info        : action.info
            };
            break;

        case 'MEMBER_INFO':
            state = {
                ...state,
                info        : action.info
            }
            break;

        case 'COLLECTION_MYACCOUNT_ALBUMS':
            state = {
                ...state,
                albumsCollection: { 
                    ...state.albumsCollection, 
                    total   : action.total,
                    limit   : action.limit,
                    current : action.current,
                    list    : action.list
                }
            }
            break;

        case 'COLLECTION_SONGS':
            state = {
                ...state,
                songsCollection: { 
                    ...state.songsCollection, 
                    total   : action.total,
                    limit   : action.limit,
                    current : action.current,
                    list    : action.list
                }
            }
            break;

        case 'PLAYLIST_FOLDER':
            state = {
                ...state,
                playlistFolder   : {
                    ...state.playlistFolder, 
                    total   : action.total,
                    limit   : action.limit,
                    current : action.current,
                    list    : action.list
                }
            }
            break;

        case 'PLAYLIST_EXPAND':
            state = {
                ...state,
                playlistExpand   : action.list
            }
            break;

        case 'PLAYLIST_DETAIL':
            state = {
                ...state,
                playlistDetail    : {
                    ...state.playlistDetail,
                    name    : action.name,
                    total   : action.total,
                    list    : action.list
                }
            }
            break;

        case 'COVER_CROP':
            state = {
                ...state,
                coverCrop          : {
                    before     : action.before,
                    after      : action.after
                }
            }
            break;

        default:
            state = { 
                ...state,
                jwtToken    : storageKeys('jwtToken')
            }
            break;
    }

    return state;
}

