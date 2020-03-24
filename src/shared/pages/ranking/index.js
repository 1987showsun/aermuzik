/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';

// Components
import Head    from './components/head';
import Songs   from './components/songs';
import Albums  from './components/albums';

// Actions
import { ssrRanking } from '../../actions/ranking';

// Stylesheets
import './public/stylesheets/style.scss';

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrRanking(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            albumsRanking: ['chinese','japanese','korean','western','soundtrack']
        }
    }

    render(){

        const { albumsRanking } = this.state;

        return(
            <>
                <Head />
                <Songs />
                {
                    albumsRanking.map( keys => {
                        return <Albums key={keys} title={`${keys} album ranking`} type={keys}/>
                    })
                }
            </>
        );
    }

    componentDidMount() {
        const { location }         = this.props;
        const { pathname, search } = location;
        this.props.dispatch( ssrRanking( pathname,{...queryString.parse(search)},{}) );
    }
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Index );