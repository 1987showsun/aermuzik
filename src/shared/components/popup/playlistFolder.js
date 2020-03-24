/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState }                                 from 'react';
import { connect }                                         from 'react-redux';
import { FontAwesomeIcon }                                 from '@fortawesome/react-fontawesome';
import { faCheck, faPlus }                                 from '@fortawesome/free-solid-svg-icons';
import toaster                                             from "toasted-notes";

// Actions
import { playlistFolderExpand, playlistFolder }            from '../../actions/member';

const toasterFunction      = ({status='failure' , status_text=''}) => {
    toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
        position    : "bottom-right",
        duration    : 3000
    });
}

const PopupPlaylistFolder = ({dispatch, current_id= "", playlistFolderList=[], playlistExpand={} }) => {

    const [ form     , setForm      ] = useState({ name : "" });
    const [ addSwitch, setAddSwitch ] = useState( false );

    const handleChange = e => {
        const { value } = e.target;
        dispatch( playlistFolderExpand({method:'put', data: { folder_id: value ,song_id: current_id }}) ).then( res => {
            let status      = 'failure';
            let status_text = 'Add failure';
            if( res['status']==200 ){
                status      = 'success';
                status_text = 'Add successful';
            }
            toasterFunction({ status, status_text });
        })
    }

    const handleAddChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { name } = form;
        dispatch( playlistFolder({ method: 'post', data: { name } }) ).then( res => {
            let status      = 'failure';
            let status_text = 'Add failed';
            if( res['status']==200 ){
                status      = 'success';
                status_text = 'Add successful';
                dispatch( playlistFolder({}) ).then( res => {
                    dispatch( playlistFolderExpand({}) );
                });
                setAddSwitch(false);
            }
            toasterFunction({ status, status_text });
            setForm({ ...form, name: '' });
        });
    }

    const { name } = form;

    return(
        <>
            <div className="popup-head">
                <h2>Put in playlist folder</h2>
            </div>
            <ul className="popup-list-ul">
                {
                    playlistFolderList.map( item => {
                        const checked = (playlistExpand[item['_id']] || []).some(item => String(item)==current_id);
                        return(
                            <li key={item['_id']}>
                                <input id={item['_id']} type="checkbox" name="playlistFolder" value={item['_id']} onChange={handleChange.bind(this)} checked={checked}/>
                                <label className="checkbox" htmlFor={item['_id']}>
                                    <div className="box">
                                        {
                                            checked && 
                                                <FontAwesomeIcon icon={faCheck}/>
                                        }
                                    </div>
                                    {item['name']}
                                </label>
                            </li>
                        );
                    })
                }
            </ul>
            {
                addSwitch && (
                    <form className="addFolderForm" onSubmit={handleSubmit.bind(this)}>
                        <div className="">
                            <div className="input-box">
                                <input type="text" name="name" value={name} onChange={handleAddChange.bind(this)} placeholder="Folder name" Autocomplete="off"/>
                            </div>
                        </div>
                        <div className="">
                            <button>CREATE</button>
                        </div>
                    </form>
                )
            }
            {
                !addSwitch && (
                    <button className="folderAdd" onClick={()=>setAddSwitch(true)}>
                        <i><FontAwesomeIcon icon={faPlus}/></i>Create a new playlist folder
                    </button>
                )
            }
        </>
    );
}

const mapStateToProps = state => {
    return{
        playlistFolderList  : state.member.playlistFolder.list,
        playlistExpand      : state.member.playlistExpand
    }
}

export default connect( mapStateToProps )( PopupPlaylistFolder );