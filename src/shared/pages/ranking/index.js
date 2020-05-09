/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Link }                                            from 'react-router-dom';
import { Helmet }                                          from "react-helmet";

// Components
import Head                                                from './components/head';
import Songs                                               from './components/songs';
import Albums                                              from './components/albums';
import Popup                                               from '../../nodules/popup';

// Actions
import { ssrRanking }                                      from '../../actions/ranking';

import handleTool                                          from '../../public/javascripts/handleTool';

// Stylesheets
import './public/stylesheets/style.scss';


class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrRanking(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            popupSwitch          : false,
            albumsRanking        : ['chinese','japanese','korean','western','soundtrack'],
            og                   : {
                url                  : ""
            }
        }
    }

    render(){

        const { popupSwitch, albumsRanking, og } = this.state;

        return(
            <>
                <Helmet>
                    <title>AERMUZIK - Ranking</title>
                    <meta property="og:url"                content={og['url']} />
                </Helmet>
                <Head 
                    callAction = {this.callAction.bind(this)}
                />
                <Songs 
                    callAction = {this.callAction.bind(this)}
                />
                {
                    albumsRanking.map( keys => {
                        return(
                            <Albums
                                key        = {keys} 
                                type       = {keys}
                                title      = {`${keys} album ranking`} 
                                callAction = {this.callAction.bind(this)}
                            />
                        )
                    })
                }
                <Popup 
                    className   = "wrong-popup"
                    popupSwitch = {popupSwitch}
                    onCancel    = {() => this.setState({popupSwitch: false})}
                >
                    <div className="popup-content">
                        <p>Member not logged in, please go to login</p>
                    </div>
                    <ul className="popup-action">
                        <li>
                            <button onClick={() => this.setState({popupSwitch: false})}>Cancel</button>
                        </li>
                        <li>
                            <Link to="/account?back=true">Sign in</Link>
                        </li>
                    </ul>
                </Popup>
            </>
        );
    }

    componentDidMount() {
        const { og }               = this.state;
        const { location }         = this.props;
        const { pathname, search } = location;
        this.props.dispatch( ssrRanking( pathname,{...queryString.parse(search)},{}) );
        this.setState({
            og: { 
                ...og,
                url : window.location.href
            }
        })
    }

    callAction = ( actionType='', val={} ) => {

        const { dispatch, location, match, jwtToken }  = this.props;

        const handleCallbackStatus = (val) => {
            const { current_id="", type, status=false } = val;
            this.setState({
                current_id  : current_id,
                popupType   : type,
                popupSwitch : status
            })
        }

        handleTool(handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val, source:'ranking'})
    }
}

const mapStateToProps = state => {
    return{
        jwtToken          : state.member.jwtToken,
    }
}

export default connect( mapStateToProps )( Index );