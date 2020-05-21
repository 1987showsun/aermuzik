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
import PopupCommon                                         from '../../components/popup';

// Modules
import Popup                                               from '../../nodules/popup';

// Actions
import { ssrRanking }                                      from '../../actions/ranking';

import handleTool                                          from '../../public/javascripts/handleTool';

// Stylesheets
import './public/stylesheets/style.scss';

// Lang
import lang from '../../../server/public/lang/common.json';

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrRanking(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            popupSwitch          : false,
            current_id           : "",
            popupType            : "",
            albumsRanking        : ['chinese','japanese','korean','western','soundtrack'],
            og                   : {
                url                  : ""
            }
        }
    }

    render(){

        const { albumsRanking, current_id, popupSwitch, popupType, og } = this.state;

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
                    head        = {lang['en']['popup']['head'][popupType]}
                    onCancel    = {() => this.setState({popupSwitch: false})}
                >
                    <PopupCommon
                        current_id  = {current_id}
                        type        = {popupType}
                        onCancel    = {() => this.setState({popupSwitch: false})}
                    />
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