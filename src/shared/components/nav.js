/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }  from 'react';
import { connect }                    from 'react-redux';
import { Link, NavLink }              from 'react-router-dom';
import { FontAwesomeIcon }            from '@fortawesome/react-fontawesome';
import { faHome, faBullhorn, faChessQueen, faMusic, faMicrophone, faUserCircle }from '@fortawesome/free-solid-svg-icons';

// Actions
import { info }    from '../actions/member';

// Images
import logo        from '../public/images/logo.png';

// Stylesheets
import '../public/stylesheets/nav.scss';

const Nav = ({dispatch ,member, jwtToken}) => {

    const [ stateToken, setToken] = useState(null);
    const [ stateInfo , setInfo ] = useState({});

    useEffect(()=>{
        setToken(jwtToken);
    },[jwtToken]);

    useEffect(()=>{
        dispatch( info('',{},{}) ).then( res => {
            setInfo( res['data']['info'] );
        })
    },[jwtToken]);

    useEffect(()=>{
        setInfo({...member});
    },[member])

    return(
        <nav>
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="aermuzik" title="" />
                </Link>
            </div>
            <ul className="nav-list">
                <li className="home"><Link to={`/`}><i><FontAwesomeIcon icon={faHome}/></i><span className="text">HOME</span></Link></li>
                <li><NavLink to={`/news`}><i><FontAwesomeIcon icon={faBullhorn}/></i><span className="text">NEWS</span></NavLink></li>
                <li><NavLink to={`/ranking`}><i><FontAwesomeIcon icon={faChessQueen}/></i><span className="text">RANKING</span></NavLink></li>
                <li><NavLink to={`/albums`}><i><FontAwesomeIcon icon={faMusic}/></i><span className="text">ALBUMS</span></NavLink></li>
                <li><NavLink to={`/artists`}><i><FontAwesomeIcon icon={faMicrophone}/></i><span className="text">ARTISTS</span></NavLink></li>
                <li>
                    <NavLink to={`/${jwtToken!=null? 'myaccount':'account'}`}>
                        <i>
                            {
                                jwtToken!=null?(
                                    <img src={stateInfo['cover']||''} alt="" title="" />
                                ):(
                                    <FontAwesomeIcon icon={faUserCircle}/>
                                )
                            }
                        </i>
                        <span className="text">
                            {
                                jwtToken!=null?(
                                    `${stateInfo['name']!=undefined? (`${stateInfo['name']['last']} ${stateInfo['name']['first']}`):(null)}`
                                ):(
                                    "ACCOUNT"
                                )
                            }
                        </span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

const mapStateToProps = state => {
    return{
        member   : state.member.info,
        jwtToken : state.member.jwtToken
    }
}

export default connect( mapStateToProps )( Nav );