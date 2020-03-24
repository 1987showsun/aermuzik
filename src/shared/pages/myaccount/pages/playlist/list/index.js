/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React,{ useState, useEffect }                       from 'react';
import toaster                                             from "toasted-notes";
import { connect }                                         from 'react-redux';

// Components
import Thead                                               from './thead';
import Items                                               from './items';

// Pages
import Detail                                              from '../detail';

// Modules
import Table                                               from '../../../../../nodules/table';
import Popup                                               from '../../../../../nodules/popup';

// Actions
import { playlistFolder, playlistFolderAdd }               from '../../../../../actions/member';


const PopupUpdateFolder = ({match, location, dispatch, handlePopup, val}) => {

    const { pathname } = location;
    const [ stateForm, setForm ] = useState({...val});

    const handleChang = (e) => {
        const { name, value } = e.target;
        setForm({...stateForm, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { id, name } = stateForm;
        dispatch( playlistFolder({ method: 'put', data: { id, name }}) ).then( res => {

            let status      = 'failure';
            let status_text = 'update failure';

            switch( res['status'] ){
                case 200:
                    handlePopup({open: false});
                    status      = 'success';
                    status_text = 'Ｕpdate successful';
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

    const { name } = stateForm;

    return (
        <>
            <div className="popup-head">
                修改歌單夾名稱：
            </div>
            <form className="noLable" onSubmit={handleSubmit.bind(this)}>
                <ul>
                    <li>
                        <div className="input-box">
                            <input type="text" name="name" value={name} onChange={handleChang.bind(this)} placeholder="請輸入資料夾名稱"/>
                        </div>
                    </li>
                    <li>
                        <button typ="submit">SUBMIT</button>
                    </li>
                </ul>
            </form>
        </>
    );
}

const PopupAddFolder = ({match, location, dispatch, handlePopup, val}) => {

    const { pathname } = location;
    const [ stateForm, setForm ] = useState({name: ''});

    const handleChang = (e) => {
        const { name, value } = e.target;
        setForm({...stateForm, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { id, name } = stateForm;
        dispatch( playlistFolder({method: 'post', data: { name }}) ).then( res => {

            let status      = 'failure';
            let status_text = 'Add failed';

            switch( res['status'] ){
                case 200:
                    handlePopup({open: false});
                    status      = 'success';
                    status_text = 'Add successful';
                    break;
            }

            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        });
    }

    const { name } = stateForm;

    return (
        <>
            <div className="popup-head">
                新增歌單夾：
            </div>
            <form className="noLable" onSubmit={handleSubmit.bind(this)}>
                <ul>
                    <li>
                        <div className="input-box">
                            <input type="text" name="name" value={name} onChange={handleChang.bind(this)} placeholder="請輸入資料夾名稱"/>
                        </div>
                    </li>
                    <li>
                        <button typ="submit">SUBMIT</button>
                    </li>
                </ul>
            </form>
        </>
    );
}

const Index = ({location, match, history, dispatch, total, limit, current, list}) => {

    const [ stateLoading  , setLoading  ] = useState(true);
    const [ statePopup    , setPopup    ] = useState(false);
    const [ statePopupVal , setPopupVal ] = useState({});

    useEffect(()=>{
        dispatch( playlistFolder({}) ).then( res => {
            setLoading(false);
        });
    },[stateLoading]);

    return(
        <>
            <Table
                thead = {
                    <Thead
                        handlePopup={( val )=>{
                            const {open, type} = val;
                            setPopup(open);
                            setPopupVal({type});
                        }}
                    />
                }
            >
                {
                    list.map((item, i) => {
                        return (
                            <Items 
                                key          = {item['_id']} 
                                item         = {{ ...item, sort: String(i+1).length<2? (`0${i+1}`):(i+1) }} 
                                match        = {match}
                                location     = {location}
                                dispatch     = {dispatch}
                                handlePopup  = {(val)=>{
                                    const { open, type, id, name } = val;
                                    setPopup(open);
                                    setPopupVal({type, id, name});
                                }}
                            />
                        )
                    })
                }
            </Table>
            <Detail 
                match       = {match}
                history     = {history}
                location    = {location}
            />
            <Popup
                popupSwitch = {statePopup}
                onCancel    = {() => setPopup(false)}
            >
                {
                    statePopupVal['type'] == 'folderUpdate'? (
                        <PopupUpdateFolder 
                            match       = {match}
                            location    = {location}
                            val         = {statePopupVal}
                            dispatch    = {dispatch}
                            handlePopup = {(val)=>{
                                const { open } = val;
                                setPopup(open);
                            }}
                        />                        
                    ):(
                        <PopupAddFolder 
                            match       = {match}
                            location    = {location}
                            val         = {statePopupVal}
                            dispatch    = {dispatch}
                            handlePopup = {(val)=>{
                                const { open } = val;
                                setPopup(open);
                            }}
                        />   
                    )
                }

            </Popup>
        </>
    );
}

const mapStateToProps = state => {
    return{
        total    : state.member.playlistFolder.total,
        limit    : state.member.playlistFolder.limit,
        current  : state.member.playlistFolder.current,
        list     : state.member.playlistFolder.list
    }
}

export default connect( mapStateToProps )( Index );