/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';

export default ({data}) => {

    const { cover, name, albums } = data;

    return(
        <figure className="common-item-style video-item">
            <div className="img">
                <img src={cover} alt={name} title="" />
            </div>
            <figcaption>
                <h3>{name}</h3>
                <h4>{albums}</h4>
            </figcaption>
        </figure>
    );
}