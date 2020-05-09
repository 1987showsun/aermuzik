/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Helmet }                                          from "react-helmet";
import io                                                  from 'socket.io-client';

// Components
import Kv                                                  from './components/kv';
import Albums                                              from './components/albums';
import Artists                                             from './components/artists';
import Songs                                               from './components/songs';
import PopupCommon                                         from '../../components/popup';

// Modules
import Popup                                               from '../../nodules/popup';

// Actions
import { ssrHome }                                         from '../../actions/home';

// HandleCommonAction
import handleTool                                          from '../../public/javascripts/handleTool';

// Lang
import lang                                                from '../../../server/public/lang/common.json';

// const socket = io('http://localhost:4000');

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrHome(pathname,query,data );
    }
    
    constructor(props){
        super(props);
        this.state = {
            popupSwitch          : false,
            current_id           : "",
            popupType            : "",
        }
    }

    render(){

        // socket.emit('getMessage', '只回傳給發送訊息的 client')
        // socket.on('getMessage', msg => {
        //     console.log(msg);
        // })

        const { popupSwitch, popupType, current_id } = this.state;
        
        return(
            <>
                <Helmet>
                    <title>{`AERMUZIK`}</title>
                    <meta property="og:type"               content="music" />
                    <meta property="og:description"        content="Every day is a music day" />
                    <meta property="og:image"              content="https://showtest.s3-ap-northeast-1.amazonaws.com/Users/showsun/common/fb.jpg" />
                </Helmet>
                <Kv />
                <Albums callAction={this.callAction.bind(this)}/>
                <Artists />
                <Songs callAction={this.callAction.bind(this)}/>
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
        const { og } = this.state;
        const { location }         = this.props;
        const { pathname, search } = location;
        
        this.props.dispatch( ssrHome( pathname,{...queryString.parse(search)} ) );
        this.setState({
            og : {
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
        handleTool(handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val, source:'home'})
    }
}

const mapStateToProps = state => {
    return{
        jwtToken          : state.member.jwtToken,
    }
}

export default connect( mapStateToProps )( Index );