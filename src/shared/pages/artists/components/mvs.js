/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                 from 'react';
import Slider                from "react-slick";
import { connect }           from 'react-redux';

// Modules
import MvItem                from '../../../nodules/items/video';

class Mvs extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            settings: {
                className      : 'video-slide-wrap arrows-top',
                dots           : false,
                infinite       : false,
                speed          : 500,
                slidesToShow   : 6,
                slidesToScroll : 6,
                initialSlide   : 0,
                responsive     : [
                    {
                        breakpoint         : 1681,
                        settings           : {
                            slidesToShow     : 5,
                            slidesToScroll   : 5
                        }
                    },
                    {
                        breakpoint         : 1480,
                        settings           : {
                            slidesToShow     : 4,
                            slidesToScroll   : 4
                        }
                    },
                    {
                        breakpoint         : 1280,
                        settings           : {
                            slidesToShow     : 3,
                            slidesToScroll   : 3
                        }
                    },
                    {
                        breakpoint         : 720,
                        settings           : {
                            slidesToShow     : 2,
                            slidesToScroll   : 2
                        }
                    },
                ]
            },
            list   : []
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list   : props.data
        }
    }

    render(){

        const { settings, list } = this.state;

        return(
            <div className="row">
                <div className="unit-head-wrap">
                    <h2>Mv</h2>
                </div>
                <Slider {...settings}>
                    {
                        list.map( item => {
                            return <MvItem key={item['_id']} data={item}/>
                        })
                    }
                </Slider>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{

    }
}

export default connect( mapStateToProps )( Mvs );