/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';

export default class Tool extends React.Component{
    render(){

        const { children } = this.props

        return(
            <ul className="img-tool">
                { children }
            </ul>
        );
    }
}