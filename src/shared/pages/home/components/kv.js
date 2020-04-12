/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React             from 'react';
import Slider            from "react-slick";
import { connect }       from 'react-redux';
import { Link }          from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import '../../../public/stylesheets/slider.scss';
import '../public/stylesheets/kv.scss';

const slideSetting = {
    className      : 'kv-slide-wrap',
    autoplay       : true,
    autoplaySpeed  : 5000,
    dots           : true,
    infinite       : true,
    arrows         : false,
    speed          : 1000,
    slidesToShow   : 1,
    slidesToScroll : 1
}
const Kv = ({ list=[], total=0 }) => {
    return(
        <div className="row no-padding">
            <Slider {...slideSetting}>
                {
                    list.map( item => {
                        return(
                            <figure key={item['_id']} className="kv-item">
                                <Link to={`/${item['aims']}/${item['purpose_id']}`}>
                                    <LazyLoadImage
                                        src       ={item['src']}
                                        alt       ={item['title']}
                                        effect    ={'blur'}
                                    />
                                </Link>
                            </figure>
                        );
                    })
                }
            </Slider>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        total  : state.home.kvTotal,
        list   : state.home.kvList,
    }
}

export default connect( mapStateToProps )( Kv );