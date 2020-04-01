/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link }                     from 'react-router-dom';
import { LazyLoadImage }            from 'react-lazy-load-image-component';
import $                            from 'jquery';


//stylesheets
import './public/stylesheets/style.scss';

export default ({data}) => {

    const { _id, cover, name, like } = data;
    const itemBlock = useRef(null);
    const [ itemH, setItemH ] = useState(100);

    useEffect(()=>{
        const itemResize = () => {
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
                const { current } = itemBlock;
                const item_w      = $(current).width();
                setItemH( item_w*(6/4) );
            }, 100);
        }
        itemResize();
        window.addEventListener('resize',itemResize);
        return() => {
            window.removeEventListener('resize',itemResize);
        }
    },[]);

    return(
        <figure ref={itemBlock} className="common-item-style artist-item">
            <div className="figure-in" style={{height: itemH}}>
                <div className="img">
                    <Link to={`/artists/${_id}`} title={name}></Link>
                    <LazyLoadImage 
                        alt    = {name}
                        src    = {cover}
                        effect = {'blur'}
                    />
                </div>
                <figcaption>
                    <h3>{name}</h3>
                    <h4>{like}</h4>
                </figcaption>
            </div>
        </figure>
    );
}