/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React               from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare }    from '@fortawesome/free-solid-svg-icons';

export default ({handlePopup}) => {
    return(
        <>
            <div className="thead-cell sort">Sort</div>
            <div className="thead-cell name">Name</div>
            <div className="thead-cell date">Create time</div>
            <div className="thead-cell action">
                <ul>
                    <li>
                        <button className="addFolder" onClick={()=> handlePopup({open: true, type: 'folderAdd'}) }>
                            <FontAwesomeIcon icon={faPlusSquare}/>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}