/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default class More extends React.Component{
    render(){

        const { path } = this.props;

        return(
            <div className="row" data-justifycontent="center">
                <Link to={path} className="more-button">MORE</Link>
            </div>
        );
    }
}