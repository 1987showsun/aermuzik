/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React             from 'react';
import Slider            from 'react-slick';
import queryString       from 'query-string';
import { Link }          from 'react-router-dom';

// Lang
import lang from '../../../public/lang/lang.json';

export default class Nav extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pathname : props.pathname,
            navData  : props.data,
            settings : {
                className      : 'subNav-wrap',
                dots           : false,
                infinite       : false,
                arrows         : false,
                speed          : 500,
                slidesToShow   : 9,
                slidesToScroll : 9,
                initialSlide   : 0,
                responsive     : [
                    {
                        breakpoint         : 1380,
                        settings           : {
                            slidesToShow     : 8,
                            slidesToScroll   : 8
                        }
                    },
                    {
                        breakpoint         : 720,
                        settings           : {
                            slidesToShow     : 7,
                            slidesToScroll   : 7
                        }
                    },
                    {
                        breakpoint         : 600,
                        settings           : {
                            slidesToShow     : 6,
                            slidesToScroll   : 6
                        }
                    },
                    {
                        breakpoint         : 420,
                        settings           : {
                            slidesToShow     : 4,
                            slidesToScroll   : 4
                        }
                    },
                ]
            }
        }
    }

    render(){

        const { location } = this.props;
        const { navData, settings } = this.state;
        const { pathname, search } = location;
        const currentLang = {...queryString.parse(search)}.hasOwnProperty('lang')? queryString.parse(search)['lang']:Object.keys(lang['zh-TW']['subNav'])[0]

        return(
            <div className="unit-nav-wrap">
                <Slider {...settings}>
                    {
                        navData.map( keys => {
                            return(
                                <div key={keys} className={`subNav-item`}>
                                    <Link className={`${currentLang==keys}`} to={`${pathname}?lang=${keys}`}>{lang['zh-TW']['subNav'][keys]}</Link>
                                </div>
                            );
                        })
                    }
                </Slider>
            </div>
        );
    }
}