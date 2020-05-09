/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

const API_ADDRESS = () => {
    const { NODE_ENV } = process.env;
    let API_PATH  = "https://api.aermuzik.com/v1";
    if( NODE_ENV=="development" ){
        API_PATH  = 'http://localhost:3001/v1';
    }
    return API_PATH;
}

export default{
    'kv'      : `${API_ADDRESS()}/api/kv`,
    'albums'  : {
        'latest'     : `${API_ADDRESS()}/albums`,
        'ranking'    : `${API_ADDRESS()}/albums/rankings`,
        'list'       : `${API_ADDRESS()}/albums`,
        'info'       : `${API_ADDRESS()}/albums/info`,
        'song'       : `${API_ADDRESS()}/albums`,
        'artists'    : `${API_ADDRESS()}/albums/artists`,
        'collection' : `${API_ADDRESS()}/albums/collection`,
        'views'      : `${API_ADDRESS()}/albums/views`
    },
    'artists' : {
        'hito'    : `${API_ADDRESS()}/artists`,
        'list'    : `${API_ADDRESS()}/artists`,
        'info'    : `${API_ADDRESS()}/artists/info`,
        'views'   : `${API_ADDRESS()}/artists/views`
    },
    'songs'   : {
        'list'    : `${API_ADDRESS()}/songs`,
        'popular' : `${API_ADDRESS()}/songs/rankings`,
        'src'     : `${API_ADDRESS()}/songs/src`
    },
    'mv'      : {
        'list'    : `${API_ADDRESS()}/video`,
        'albums'  : `${API_ADDRESS()}/video/albums`,
        'artists' : `${API_ADDRESS()}/video/artists`
    },
    'member'  : {
        'signin'         : `${API_ADDRESS()}/user/signin`,
        'otherSignin'    : `${API_ADDRESS()}/user/otherSignin`,
        'signup'         : `${API_ADDRESS()}/user/signup`,
        'info'           : `${API_ADDRESS()}/user/info`,
        'albums'         : `${API_ADDRESS()}/user/collection/albums`,
        'songs'          : `${API_ADDRESS()}/user/collection/songs`,
        'playlist'       : `${API_ADDRESS()}/user/playlist`,
        'playlistDetail' : `${API_ADDRESS()}/user/playlistDetail`,
        'playlistExpand' : `${API_ADDRESS()}/user/playlist/expand`,
        'changeCover'    : `${API_ADDRESS()}/user/changeCover`
    },
    'like'       : {
        'single'         : `${API_ADDRESS()}/like`,
        'plural'         : `${API_ADDRESS()}/like/plural`,
    },
    'comment'    : `${API_ADDRESS()}/comment`,
    'collection' : `${API_ADDRESS()}/collection`
}