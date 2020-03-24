/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React                                               from 'react';
import toaster                                             from "toasted-notes";
import { Link }                                            from 'react-router-dom';
import { connect }                                         from 'react-redux';
import { FontAwesomeIcon }                                 from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPenNib }                            from '@fortawesome/free-solid-svg-icons';

// Actions
import { playlistFolder }                            from '../../../../../actions/member';

const Item =  ({dispatch, location, handlePopup, match, item}) => {
    const { _id, sort, name, date } = item;

    const update = () => {
        handlePopup({
            type : 'folderUpdate',
            open : true,
            id   : _id,
            name : name
        });
    }

    const remove = () => {
        const { pathname } = location;
        dispatch( playlistFolder({method: 'delete', query: {id: _id}}) ).then( res => {

            let status      = 'failure';
            let status_text = 'Delete failure';

            switch( res['status'] ){
                case 200:
                    handlePopup({open: false});
                    status      = 'success';
                    status_text = 'Delete successful';
                    break;

                default:
                    break;
            }

            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        });
    }

    return(
        <>
            <div className="sort">{sort}</div>
            <div className=""><Link to={`/myaccount/playlist/${_id}`}>{name}</Link></div>
            <div className="date">{date}</div>
            <div className="action">
                <ul>
                    <li><button onClick={update.bind(this)}><FontAwesomeIcon icon={faPenNib}/></button></li>
                    <li><button onClick={remove.bind(this)}><FontAwesomeIcon icon={faTrashAlt}/></button></li>
                </ul>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Item );