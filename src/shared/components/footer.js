/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React       from 'react';
import { connect } from 'react-redux';

// Stylesheets
import '../public/stylesheets/footer.scss';

class Footer extends React.Component{
    render(){
        return(
            <footer>
                <small>Copyright © 2018-2020 aermuzik All Rights Reserved.</small>
            </footer>
        );
    }
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Footer );