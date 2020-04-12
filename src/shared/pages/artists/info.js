/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */
import React                                               from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Helmet }                                          from "react-helmet";

// Components
import Cover                                               from './components/cover';
import Songs                                               from './components/songs';
import Albums                                              from './components/albums';
import Mvs                                                 from './components/mvs';
import Messages                                            from './components/messages';
import PopupCommon                                         from '../../components/popup';

// Modules
import Popup                                               from '../../nodules/popup';

// Actions
import { like }                                            from '../../actions/likes';
import { ssrArtistsInfo, views }                           from '../../actions/artists';

// HandleCommonAction
import handleTool                                          from '../../public/javascripts/handleTool';

// Lang
import lang                                                from '../../../server/public/lang/common.json';

// Stylesheets
import './public/stylesheets/cover.scss';

class Info extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrArtistsInfo(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            current_id           : "",
            popupType            : "",
            popupSwitch          : false,
            info                 : {},
            artist               : {},
            songs                : [],
            otherAlbums          : [],
            mv                   : [],
            playlist             : [],
            comment              : [],
            collectionsAlbums    : [],
            og                   : {
                url                  : ""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        return {
            info                 : props.info,
            artist               : props.artist,
            songs                : props.songs,
            otherAlbums          : props.otherAlbums,
            mv                   : props.mv,
            playlist             : props.playlist.map( item => item['_id'] ),
            comment              : props.comment,
            collectionsAlbums    : props.collectionsAlbums,
        }
    }

    render(){
        const { location, commentId } = this.props;
        const { playlist, info, collectionsAlbums, songs, otherAlbums, mv, comment, current_id, popupSwitch, popupType, og } = this.state;

        return(
            <>
                <Helmet>
                    <title>{`AERMUZIK - ${info['name']||''}`}</title>
                    <meta property="og:url"                content={og['url']} />
                    <meta property="og:type"               content="article" />
                    <meta property="og:title"              content={`AERMUZIK - ${info['name']}`} />
                    <meta property="og:description"        content={info['intro']} />
                    <meta property="og:image"              content={info['cover'] || ''} /> 
                </Helmet>
                <Cover 
                    type        = "artists"
                    data        = {info}
                    collections = {{artists: collectionsAlbums}}
                    callAction  = {this.callAction.bind(this) }
                />
                <Songs 
                    data       = {songs}
                    playlist   = {playlist}
                    callAction = {this.callAction.bind(this)}
                />
                <Albums 
                    data       = {otherAlbums}
                    callAction = {this.callAction.bind(this)}
                />
                <Mvs 
                    data       = {mv}
                    callAction = {this.callAction.bind(this)}
                />
                <Messages 
                    info       = {info}
                    location   = {location}
                    commentId  = {commentId}
                    data       = {comment}
                /> 
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
        const { location, match }  = this.props;
        const { pathname, search } = location;
        const { id }               = match.params;
        this.props.dispatch( views(pathname,{id}) );
        this.callAPI();
        this.setState({
            og: { 
                ...og,
                url : window.location.href
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const id     = this.props.match.params.id;
        const prevId = prevProps.match.params.id;
        if( id!=prevId ){
            this.callAPI();
        }
    }

    callAPI = () => {
        const { location, match }  = this.props;
        const { pathname, search } = location;
        const { id }               = match.params;
        this.props.dispatch( like({query: {type: 'artists', id}}) );
        this.props.dispatch( ssrArtistsInfo(pathname,{...queryString.parse(search), albums_id: id}) );
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

        handleTool(handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val, source:'artists'})
    }
}

const mapStateToProps = state => {
    return{
        info              : state.artists.artistsInfo,
        songs             : state.artists.artistsSong,
        otherAlbums       : state.albums.otherAlbums,
        mv                : state.artists.artistsMv,
        playlist          : state.playlist.list,
        commentId         : state.comment.id,
        comment           : state.comment.list,
        collectionsAlbums : state.collections.albums,
        jwtToken          : state.member.jwtToken,
    }
}

export default connect( mapStateToProps )( Info );