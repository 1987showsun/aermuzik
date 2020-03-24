/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */
import React                                               from 'react';
import toaster                                             from "toasted-notes";
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Link }                                            from 'react-router-dom';
import { Helmet }                                          from "react-helmet";

// Components
import Cover                                               from './components/cover';
import Songs                                               from './components/songs';
import Albums                                              from './components/albums';
import Mvs                                                 from './components/mvs';
import Messages                                            from './components/messages';

// Modules
import Popup                                               from '../../nodules/popup';

// Actions
import { like, likePlural }                                from '../../actions/likes';
import { ssrArtistsInfo }                                  from '../../actions/artists';
import { albumsArtists }                                   from '../../actions/albums';
import { collection }                                      from '../../actions/collection';
import { onPlayer, singlePlay }                            from '../../actions/player';

// Stylesheets
import './public/stylesheets/cover.scss';

class Info extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrArtistsInfo(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            popupSwitch          : false,
            info                 : {},
            songs                : [],
            albums               : [],
            mv                   : [],
            playlist             : [],
            comment              : [],
            og                   : {
                url                  : ""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        return {
            info                 : props.info,
            songs                : props.songs,
            albums               : props.albums,
            mv                   : props.mv,
            playlist             : props.playlist.map( item => item['_id'] ),
            comment              : props.comment
        }
    }

    render(){

        const { location, commentId } = this.props;
        const { playlist, info, songs, albums, mv, comment, popupSwitch, og } = this.state;

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
                    type       = "artists"
                    data       = {info}
                    callAction = {this.callAction.bind(this)}
                />
                <Songs 
                    data       = {songs}
                    playlist   = {playlist}
                    callAction = {this.callAction.bind(this)}
                />
                <Albums 
                    data       = {albums}
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
        this.props.dispatch( like(pathname,{ type: 'artists', id: id }) );
        this.props.dispatch( ssrArtistsInfo(pathname,{...queryString.parse(search), albums_id: id}) );
    }

    callAction = ( actionType='', val={} ) => {
        
        const { location, match, jwtToken }  = this.props;
        const { pathname, search } = location;
        const artists_id           = match['params']['id'];
        const toasterFunction      = ({status='failure' , status_text=''}) => {
            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        }

        if( jwtToken!=undefined ){
            switch( actionType ){
                case 'playAll':
                    // 播放全部
                    break;

                case 'collectionAlbums':
                    // 收藏專去
                    this.props.dispatch( collection(pathname,{ method: 'put', type: 'albums'},{id: val['_id']}) ).then( res => {
                        let status      = 'failure';
                        let status_text = 'Update failure';

                        if( res['status']==200 ){
                            status      = 'success';
                            status_text = 'Update successful';
                            this.props.dispatch( albumsArtists(pathname,{ id: artists_id, type: 'ARTISTS_OTHER_ARTISTS' }) );
                        }

                        toasterFunction({ status, status_text });
                    });
                    break;

                case 'collectionSongs':
                    // 收藏歌曲
                    break;

                case 'albumsLike':
                    // 喜歡專輯
                    break;

                case 'albumsLikePlural':
                    this.props.dispatch( likePlural(pathname,{...queryString.parse(search), method: 'put', type: 'albums'},{id: val['_id'], artists_id}) ).then( res => {

                        let status      = 'failure';
                        let status_text = 'Update failure';

                        if( res['status']==200 ){
                            status      = 'success';
                            status_text = 'Update successful';
                            this.props.dispatch( albumsArtists(pathname,{ id: artists_id, type: 'ARTISTS_OTHER_ARTISTS' }) );
                        }

                        toasterFunction({ status, status_text });
                    });
                    break;

                case 'songsLike':
                    // 喜歡歌曲
                    break;

                case 'artistsLike':
                    // 喜歡歌手
                    this.props.dispatch( like(pathname,{ method: 'put', type: 'artists'},{id: val['_id']}) ).then( res => {
                        let status      = 'failure';
                        let status_text = 'Update failure';

                        if( res['status']==200 ){
                            status      = 'success';
                            status_text = 'Update successful';
                        }

                        toasterFunction({ status, status_text });
                    });
                    break;

                case 'share':
                    // 分享
                    break;

                case 'singlePlay':
                    // 單曲播放
                    this.props.dispatch( singlePlay(actionType, val) );
                    break;

                case 'playlistFolder':
                    // 播放清單資料夾
                    break;

                case 'addPlaylist':
                    // 加入播放清單
                    this.props.dispatch( onPlayer(val) );
                    break;
            }

            console.log( actionType, val );
        }else{
            this.setState({
                popupSwitch: true
            })
        }
    }
}

const mapStateToProps = state => {
    return{
        info              : state.artists.artistsInfo,
        songs             : state.artists.artistsSong,
        albums            : state.albums.otherAlbums,
        mv                : state.artists.artistsMv,
        playlist          : state.playlist.list,
        commentId         : state.comment.id,
        comment           : state.comment.list,
        jwtToken          : state.member.jwtToken
    }
}

export default connect( mapStateToProps )( Info );