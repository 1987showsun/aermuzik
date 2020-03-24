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

class Kv extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            settings: {
                className      : 'kv-slide-wrap',
                dots           : true,
                infinite       : true,
                arrows         : false,
                speed          : 500,
                slidesToShow   : 1,
                slidesToScroll : 1
            },
            list  : [],
            total : 0
        }
    }

    static getDerivedStateFromProps( props,state ){
        return {
            list  : props.list,
            total : props.total
        };
    }

    render(){

        const { settings, list } = this.state;

        return(
            <div className="row no-padding">
                <Slider {...settings}>
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
}

const mapStateToProps = state => {
    return{
        total  : state.home.kvTotal,
        list   : state.home.kvList,
    }
}

export default connect( mapStateToProps )( Kv );