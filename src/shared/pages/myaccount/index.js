/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect }   from 'react';
import { Switch, Redirect, Route }     from 'react-router-dom';
import { connect }                     from 'react-redux';

// Components
import Head                            from './common/head';
import Nav                             from './common/nav';

// Modules
import Crop                           from '../../nodules/crop';

// Pages
import Albums                          from './pages/albums';
import Songs                           from './pages/songs';
import Playlist                        from './pages/playlist/list';
import PlaylistDetail                  from './pages/playlist/detail';

// Actions
import { coverCrop }                   from '../../actions/member';

const Index = ({ dispatch, location, history, coverCropBeforeSrc }) => {

    const [ stateIsLogin      , setIsLogin       ] = useState(false);
    const [ stateCoverCorpSrc , setCoverCorpSrc  ] = useState('');

    const handleCrop = (val) => {
        setCoverCorpSrc('');
        dispatch( coverCrop({ after: val['crop']}) );
    }

    useEffect(()=>{
        const jwtToken = sessionStorage.getItem('jwtToken') || null;
        if( jwtToken==null ){
            history.push({
                pathname : '/account'
            })
        }else{
            setIsLogin(true);
        }
    },[stateIsLogin]);

    useEffect(()=>{
        setCoverCorpSrc( coverCropBeforeSrc );
    },[coverCropBeforeSrc]);

    return(
        <>
            {
                stateIsLogin?(
                    <>
                        <Head 
                            location = {location}
                            history  = {history}
                        />
                        <div className="myaccount-container">
                            <Nav />
                            <Switch>
                                <Route exact={true} path="/myaccount/albums" component={Albums} />
                                <Route path="/myaccount/songs" component={Songs} />
                                <Route exact={true} path="/myaccount/playlist" component={Playlist} />
                                <Route path="/myaccount/playlist/:id" component={Playlist} />
                                <Redirect to="/myaccount/albums"/>
                            </Switch>
                        </div>

                        <Crop 
                            src          = {stateCoverCorpSrc}
                            aspectRatio  = {1}
                            returnCrop   = {handleCrop.bind(this)}
                        />
                    </>
                ):(
                    null
                )
            }
        </>
    );
}

const mapStateToProps = state => {
    return{
        coverCropBeforeSrc : state.member.coverCrop.before,
        coverCropAfterSrc  : state.member.coverCrop.after
    }
}

export default connect( mapStateToProps )( Index );