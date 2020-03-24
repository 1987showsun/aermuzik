/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import queryString                                         from 'query-string';
import { connect }                                         from 'react-redux';
import { Helmet }                                          from "react-helmet";

// Components
import Kv          from './components/kv';
import Albums      from './components/albums';
import Artists     from './components/artists';
import Songs       from './components/songs';

// Actions
import { ssrHome, kv } from '../../actions/home';

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrHome(pathname,query,data );
    }
    
    constructor(props){
        super(props);
        this.state = {
            og : {
                url : ""
            }
        }
    }

    render(){
        const { og } = this.state;
        return(
            <>
                <Helmet>
                    <title>{`AERMUZIK`}</title>
                    <meta property="og:url"                content={og['url']} />
                    <meta property="og:type"               content="music" />
                </Helmet>
                <Kv />
                <Albums />
                <Artists />
                <Songs />
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
    
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Index );