/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faChessQueen }               from '@fortawesome/free-solid-svg-icons';

// Components
import Cover                          from './cover';

// Actions
import { clearMemberInfo }            from '../../../actions/member';

// Images
import headCoverBg                    from '../../../public/images/cover_bg.png';

// Stylesheets
import '../public/stylesheets/head.scss';

const Head = ({dispatch, location, history, member}) => {

    const [ stateInfo , setInfo  ] = useState({});

    useEffect(()=>{
        setInfo({...member});
    },[member]);

    const { _id="", nickname="", name={ first:"", last:"" }, level="general", email="", tel="", cover="", username="" } = stateInfo;
    const signOut = () => {
        const keys = Object.keys(sessionStorage);
        keys.map( key => {
            sessionStorage.removeItem(key);
        });
        dispatch( clearMemberInfo() );
        history.push('/');
    }

    return(
        <div className="myaccount-head">
            <div className="head-background" style={{'backgroundImage': `url(${headCoverBg})`}}></div>
            <figure>
                <Cover
                    id       = {_id}
                    src      = {cover}
                    level    = {level}
                    location = {location}
                />
                <figcaption>
                    <h1>{`${nickname}`}</h1>
                    <h2>{username}</h2>
                </figcaption>
                <ul className="head-action">
                    <li><button>EDIT PROFILE</button></li>
                    <li><button onClick={signOut.bind(this)}>SIGN OUT</button></li>
                </ul>
            </figure>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        member   : state.member.info,
        jwtToken : state.member.jwtToken
    }
}

export default connect( mapStateToProps )( Head );