/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                           from 'react';
import Slider                          from "react-slick";
import { connect }                     from 'react-redux';

// Components
import AlbumsItem                      from '../../../nodules/items/albums';

import '../../../public/stylesheets/slider.scss';

const sliderSetting = {
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
            breakpoint         : 720,
            settings           : {
                slidesToShow     : 5,
                slidesToScroll   : 5
            }
        },
        {
            breakpoint         : 600,
            settings           : {
                slidesToShow     : 4,
                slidesToScroll   : 4
            }
        },
        {
            breakpoint         : 420,
            settings           : {
                slidesToShow     : 3,
                slidesToScroll   : 3
            }
        },
    ]
}

const Albums = props => {

    const { type, title, callAction } = props;
    const list     = props[type];

    return(
        <div className="row">
            <div className="unit-head-wrap">
                <h2>{title}</h2>
            </div>
            <Slider {...sliderSetting}>
                {
                    list.map( item => <AlbumsItem key={item['_id']} data={item} handleAction={callAction}/>)
                }
            </Slider>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        chinese    : state.ranking.rankingAlbumsChinese,
        japanese   : state.ranking.rankingAlbumsJapanese,
        korean     : state.ranking.rankingAlbumsKorean,
        western    : state.ranking.rankingAlbumsWestern,
        soundtrack : state.ranking.rankingAlbumsSoundtrack
    }
}

export default connect( mapStateToProps )( Albums );