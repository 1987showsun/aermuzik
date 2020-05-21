/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React from 'react';
import { FontAwesomeIcon }               from '@fortawesome/react-fontawesome';
import { faCommentAlt, faListUl }from '@fortawesome/free-solid-svg-icons';

export default ({ showLyrics, showPlaylist, handleSubControl }) => {
    return(
        <div className="audio-col sub-control">
            <ul>
                <li>
                    <button className={`${showLyrics}`} onClick={handleSubControl.bind(this,'lyrics')}>
                        <FontAwesomeIcon icon={faCommentAlt} />
                    </button>
                </li>
                <li>
                    <button className={`${showPlaylist}`} onClick={handleSubControl.bind(this,'playlist')}>
                        <FontAwesomeIcon icon={faListUl} />
                    </button>
                </li>
            </ul>
        </div>
    );
}