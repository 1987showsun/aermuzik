/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt }    from '@fortawesome/free-solid-svg-icons';

// Components
import Tool from './components/tool';

export default ({ handleAction, _id, user_id, name, content, createtime, modifytime, userInfo }) => {

    const toolAction = ( val ) => {
        if( handleAction!=undefined ){
            handleAction( val );
        }
    }

    return(
        <div className="message-item">
            <div className="message-head">
                <h4>{name}</h4>
                <span className="date">{modifytime}</span>
                {
                    Object.keys(userInfo).length>0 &&
                        String(user_id)==String( userInfo['_id'] )?(
                            <Tool>
                                <li onClick={toolAction.bind(this,{ actionType: 'update', id: _id})}><i><FontAwesomeIcon icon={faPencilAlt}/></i><span className="text">Edit</span></li>
                                <li onClick={toolAction.bind(this,{ actionType: 'delete', id: _id})}><i><FontAwesomeIcon icon={faTrashAlt}/></i><span className="text">Delete</span></li>
                            </Tool>
                        ):(
                            null
                        )
                }
            </div>
            <div className="message-desc" dangerouslySetInnerHTML={{__html: content}} />
        </div>
    );
}