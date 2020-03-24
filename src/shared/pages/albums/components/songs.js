/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                 from 'react';

// Modules
import SongItem              from '../../../nodules/items/songs';

export default class Songs extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            list     : [],
            playlist : []
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list     : props.data,
            playlist : props.playlist
        }
    }

    render(){

        const { list, playlist } = this.state;

        return(
            <div className="row">
                {
                    list.map( (item,i) => {
                        return(
                            <SongItem 
                                key        = {item['_id']}
                                data       = {{...item, idx: i}}
                                playlist   = {playlist}
                                callAction = {this.props.callAction}
                            />
                        )
                    })
                }
            </div>
        );
    }
}