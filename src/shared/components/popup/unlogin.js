/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default ({ onCancel }) => {
    return(
        <>
            <div className="popup-content">
                <p>Member not logged in, please go to login</p>
            </div>
            <ul className="popup-action">
                <li>
                    <button onClick={() => onCancel(false)}>Cancel</button>
                </li>
                <li>
                    <Link to="/account?back=true">Sign in</Link>
                </li>
            </ul>
        </>
    );
}