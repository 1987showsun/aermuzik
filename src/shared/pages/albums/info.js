/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */
import React                                               from 'react';
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
import { ssrAlbumsInfo, views }                            from '../../actions/albums';
import { collection }                                      from '../../actions/collection';

// HandleCommonAction
import handleTool from '../../public/javascripts/handleTool';

// Lang
import lang from '../../../server/public/lang/common.json';

class Info extends React.Component{

    static initialAction( pathname,query,data={} ){
        const pathnameArray = (pathname || '').split('/').filter( item => item!='' );
        return ssrAlbumsInfo(pathname,{id: pathnameArray[1]},data );
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
                    <title>{`AERMUZIK - ${info['name']}`}</title>
                    <meta property="og:url"                content={og['url']} />
                    <meta property="og:type"               content="article" />
                    <meta property="og:title"              content={`AERMUZIK - ${info['name']}`} />
                    <meta property="og:description"        content={info['intro']} />
                    <meta property="og:image"              content={info['cover']} />
                </Helmet>
                <Cover 
                    data        = {info}
                    collections = {{albums: collectionsAlbums}}
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
        const albumsId     = this.props.match.params.id;
        const prevAlbumsId = prevProps.match.params.id;
        if( albumsId!=prevAlbumsId ){
            this.callAPI();
        }
    }

    callAPI = () => {
        const { location, match }  = this.props;
        const { pathname, search } = location;
        const { id }               = match.params;
        this.props.dispatch( like({query:{type: 'albums', id}}) );
        this.props.dispatch( collection({query: {type: 'albums', id}}) );
        this.props.dispatch( ssrAlbumsInfo(pathname,{type: 'albums', id}) );
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

        handleTool(handleCallbackStatus, {jwtToken, dispatch, location, match, actionType, val})
    }
}

const mapStateToProps = state => {
    return{
        info              : state.albums.info,
        songs             : state.albums.songs,
        otherAlbums       : state.albums.otherAlbums,
        mv                : state.albums.albumsMv,
        playlist          : state.playlist.list,
        commentId         : state.comment.id,
        comment           : state.comment.list,
        collectionsAlbums : state.collections.albums,
        jwtToken          : state.member.jwtToken,
    }
}

export default connect( mapStateToProps )( Info );