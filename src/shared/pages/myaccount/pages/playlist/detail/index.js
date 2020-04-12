/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { connect }                    from 'react-redux';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlay, faChevronDown }from '@fortawesome/free-solid-svg-icons';


// Modules
import SongsItem from '../../../../../nodules/items/songs';

// Actions
import { playlistDetail } from '../../../../../actions/member';

const Index = ({ match, history, dispatch, name, total, list }) => {

    const { id } = match['params'];

    useEffect(()=>{
        if( id!=null ){
            const { id }       = match['params'];
            dispatch( playlistDetail({query: { id: id }}) );
        }
    },[id]);

    return(
        <div className={`playlist-detail-wrap ${id!=null? true:false}`}>
            <div className="head">
                <h3>{name}</h3>
                <ul>
                    <li>
                        <button onClick={()=>{}}>
                            <i><FontAwesomeIcon icon={faTrashAlt} /></i>
                            <span className="text">Delete all songs</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={()=>{}}>
                            <i><FontAwesomeIcon icon={faPlay} /></i>
                            <span className="text">Add playlist</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={()=> history.goBack() }>
                            <i><FontAwesomeIcon icon={faChevronDown} /></i>
                            <span className="text">Close</span>
                        </button>
                    </li>
                </ul>
            </div>
            {list.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i }}/> )}
        </div>
    );
}

const mapStateToProps = state => {
    return{
        name  : state.member.playlistDetail.name,
        total : state.member.playlistDetail.total,
        list  : state.member.playlistDetail.list
    }
}

export default connect( mapStateToProps )( Index );