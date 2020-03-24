/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default () => {
    return(
        <div className="myaccount-nav">
            <ul>
                <li><NavLink to="/myaccount/albums">Albums Collection</NavLink></li>
                <li><NavLink to="/myaccount/songs">Songs Collection</NavLink></li>
                <li><NavLink to="/myaccount/playlist">Playlist Folder</NavLink></li>
            </ul>
        </div>
    );
}