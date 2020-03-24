/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React       from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';

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

    render(){
        return(
            <>
                <Kv />
                <Albums />
                <Artists />
                <Songs />
            </>
        );
    }

    componentDidMount() {
        const { location }         = this.props;
        const { pathname, search } = location;
        
        this.props.dispatch( ssrHome( pathname,{...queryString.parse(search)} ) );
    }
    
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Index );