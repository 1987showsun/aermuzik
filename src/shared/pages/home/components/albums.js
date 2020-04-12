/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React             from 'react';
import Slider            from "react-slick";
import { connect }       from 'react-redux';

// Components
import AlbumsItem        from '../../../nodules/items/albums';

import '../../../public/stylesheets/slider.scss';

const slideSetting = {
    className      : 'albums-slide-wrap arrows-top',
    dots           : false,
    infinite       : false,
    speed          : 500,
    slidesToShow   : 7,
    slidesToScroll : 7,
    initialSlide   : 0,
    responsive     : [
        {
            breakpoint         : 1380,
            settings           : {
                slidesToShow     : 6,
                slidesToScroll   : 6
            }
        },
        {
            breakpoint         : 1024,
            settings           : {
                slidesToShow     : 5,
                slidesToScroll   : 5
            }
        },
        {
            breakpoint         : 860,
            settings           : {
                slidesToShow     : 4,
                slidesToScroll   : 4
            }
        },
        {
            breakpoint         : 600,
            settings           : {
                slidesToShow     : 3,
                slidesToScroll   : 3
            }
        }
    ]
}
const Albums = ({ list=[] }) => {
    return(
        <div className="row">
            <div className="unit-head-wrap">
                <h2>POPULAR ALBUMS</h2>
            </div>
            <Slider {...slideSetting}>
                {
                    list.map( item => {
                        return <AlbumsItem key={item['_id']} data={item} />;
                    })
                }
            </Slider>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        list : state.home.albumsList
    }
}

export default connect( mapStateToProps )( Albums );