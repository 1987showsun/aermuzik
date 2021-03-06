/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */
import React from 'react';

// Components
import PlaylistFolder  from './playlistFolder';
import Unlogin         from './unlogin';

import './style.scss';

export default ({type="", current_id, onCancel}) => {
    switch( type ){
        case "playlistFolder":
            return (
                <PlaylistFolder
                    current_id  = {current_id}
                    onCancel    = {onCancel}
                />
            );

        case "unLogin":
            return (
                <Unlogin 
                    onCancel     = {onCancel}
                />
            );

        default:
            return null;
    }
}