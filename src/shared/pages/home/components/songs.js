/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';

// Components
import SongsItem from '../../../nodules/items/songs';

class Songs extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            songsPopularList    : [],
            songsCollectionList : []
        }
    }

    static getDerivedStateFromProps( props,state ){
        return{
            songsPopularList    : props.songsPopularList,
            songsCollectionList : props.songsCollectionList
        }
    }

    render(){

        const { songsPopularList, songsCollectionList } = this.state;

        return(
            <div className="row">
                <div className="col">
                    <div className="unit-head-wrap">
                        <h2>Most popular songs</h2>
                    </div>
                    <div className="row no-padding">
                        {
                            songsPopularList.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i }}/> )
                        }
                    </div>
                </div>
                <div className="col">
                    <div className="unit-head-wrap">
                        <h2>Most user collection</h2>
                    </div>
                    <div className="row no-padding">
                        {
                            songsCollectionList.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i}}/> )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        songsPopularList    : state.home.songsPopularList,
        songsCollectionList : state.home.songsCollectionList
    }
}

export default connect( mapStateToProps )( Songs );