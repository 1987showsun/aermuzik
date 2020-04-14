/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Helmet }                                          from "react-helmet";

// Components
import Head                                                from './components/head';
import Songs                                               from './components/songs';
import Albums                                              from './components/albums';

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
            albumsRanking: ['chinese','japanese','korean','western','soundtrack'],
            og                   : {
                url                  : ""
            }
        }
    }

    render(){

        const { albumsRanking, og } = this.state;

        return(
            <>
                <Helmet>
                    <title>AERMUZIK - Ranking</title>
                    <meta property="og:url"                content={og['url']} />
                </Helmet>
                <Head />
                <Songs />
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

        console.log( actionType, val );
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