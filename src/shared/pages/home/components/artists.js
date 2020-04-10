/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React             from 'react';
import Slider            from "react-slick";
import { connect }       from 'react-redux';

// Components
import ArtistsItem       from '../../../nodules/items/artists';

import '../../../public/stylesheets/slider.scss';

class Artist extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            settings: {
                className      : 'artists-slide-wrap arrows-top',
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
            },
            list  : []
        }
    }

    static getDerivedStateFromProps( props,state ){
        return{
            list : props.list
        }
    }

    render(){

        const { settings, list } = this.state;

        return(
            <div className="row">
                <div className="unit-head-wrap">
                    <h2>HITO ARTISTS</h2>
                </div>
                <Slider {...settings}>
                    {
                        list.map( item => <ArtistsItem key={item['_id']} data={item}/> )
                    }
                </Slider>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        list : state.home.artistsList
    }
}

export default connect( mapStateToProps )( Artist );