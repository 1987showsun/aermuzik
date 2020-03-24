/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';

// Modules
import SongItem    from '../../../nodules/items/songs';

class Songs extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            list : []
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list : props.list
        }
    }

    render(){

        const { list } = this.state;

        return(
            <div className="row">
                <div className="unit-head-wrap">
                    <h2>Songs ranking</h2>
                </div>
                {
                    list.map((item,i) => <SongItem key={item['_id']} data={{...item,idx:i}} /> )
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        list : state.home.songsPopularList
    }
}

export default connect( mapStateToProps )( Songs )