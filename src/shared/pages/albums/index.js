/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import queryString                                         from 'query-string';
import toaster                                             from "toasted-notes";
import { connect }                                         from 'react-redux';
import { Link }                                            from 'react-router-dom';
import { Helmet }                                          from "react-helmet";

// Components
import Nav                                                 from './components/nav';

//Modules
import BlockList                                           from '../../nodules/blockList';
import AlbumItem                                           from '../../nodules/items/albums';
import More                                                from '../../nodules/common/more';
import Popup                                               from '../../nodules/popup';

// Actions
import { ssrAlbums }                                       from '../../actions/albums';
import { collection }                                      from '../../actions/collection';
import { likePlural }                                      from '../../actions/likes';

// Stylesheets
import '../../public/stylesheets/slider.scss';

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrAlbums(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            popupSwitch          : false,
            navData              : ['chinese','cantonese','korean','western','soundtrack'],
            list                 : [],
            jwtToken             : props.jwtToken,
            og                   : {
                url                  : ""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list                 : props.list,
            jwtToken             : props.jwtToken
        }
    }

    render(){

        const { navData, list, popupSwitch, og } = this.state;
        const { location }                   = this.props;
        const { pathname, search }           = location;
        const lang                           = queryString.parse(search)['lang'] || 'chinese';
        const current                        = Number(queryString.parse(search)['current'])+1 || '2';
        const morePath                       = `${pathname}?${queryString.stringify({ lang,current })}`;

        return(
            <>
                <Helmet>
                    <title>AERMUZIK - Albums</title>
                    <meta property="og:url"                content={og['url']} />
                </Helmet>
                <div className="row"></div>
                <div className="row">
                    <Nav location={location} data={navData}/>
                    <BlockList>
                        {
                            list.map( item => <AlbumItem key={item['_id']} data={item} handleAction={this.callAction.bind(this)}/>)
                        }
                    </BlockList>
                </div>
                <More path={morePath}/>
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
        const { og } = this.state;
        this.callAPI();
        this.setState({
            og: { 
                ...og,
                url : window.location.href
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {

        const searchObject     = queryString.parse(this.props.location.search);
        const prevSearchObject = queryString.parse(prevProps.location.search);
        let   isReload         = false;

        if( Object.keys(searchObject).length>Object.keys(prevSearchObject).length ){
            isReload = Object.keys(searchObject).some( keys => searchObject[keys]!=prevSearchObject[keys] );
        }else{
            isReload = Object.keys(prevSearchObject).some( keys => prevSearchObject[keys]!=searchObject[keys] );
        }

        if( isReload ){
            this.callAPI();
        }
    }

    callAPI = () => {
        const { location } = this.props;
        const { pathname, search } = location;
        this.props.dispatch(ssrAlbums(pathname,{ ...queryString.parse(search) } ));
    }

    callAction = ( actionType='', val={} ) => {

        const { location, jwtToken } = this.props;
        const { pathname, search }   = location;
        const toasterFunction        = ({status='failure' , status_text=''}) => {
            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        }
        const checkLoginStatus = () => {
            if( jwtToken==undefined ){
                this.setState({
                    popupSwitch: true
                })
                return false;
            }
            return true;
        }

        switch( actionType ){
            case 'collectionAlbums':
                // 收藏專去
                if( checkLoginStatus() ){
                    this.props.dispatch( collection({method: 'put', query:{ type: 'albums'}, data:{id: val['_id']}}) ).then( res => {
                        let status      = 'failure';
                        let status_text = 'Update failure';

                        if( res['status']==200 ){
                            status      = 'success';
                            status_text = 'Update successful';
                            this.props.dispatch(ssrAlbums(pathname,{ ...queryString.parse(search) } ));
                        }
                        toasterFunction({ status, status_text });
                    });
                }
                break;

            case 'albumsLikePlural':
                if( checkLoginStatus() ){
                    this.props.dispatch( likePlural({method: 'put', query:{...queryString.parse(search), type: 'albums'}, data:{id: val['_id']}}) ).then( res => {
                        let status      = 'failure';
                        let status_text = 'Update failure';

                        if( res['status']==200 ){
                            status      = 'success';
                            status_text = 'Update successful';
                            this.props.dispatch(ssrAlbums(pathname,{ ...queryString.parse(search) } ));
                        }

                        toasterFunction({ status, status_text });
                    });
                }
                break;
        }
    }
}

const mapStateToProps = state => {
    return{
        list              : state.albums.albumsList,
        jwtToken          : state.member.jwtToken
    }
}

export default connect( mapStateToProps )( Index );