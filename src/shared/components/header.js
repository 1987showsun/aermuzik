/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';

// Stylesheets
import '../public/stylesheets/header.scss';

class Header extends React.Component{
    render(){
        return(
            <header>
                
            </header>
        );
    }
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Header );