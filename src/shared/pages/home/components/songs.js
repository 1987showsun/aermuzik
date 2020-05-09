/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                    from 'react';
import { connect }              from 'react-redux';

// Components
import SongsItem                from '../../../nodules/items/songs';

const Songs = ({ songsPopularList=[], songsCollectionList=[], callAction }) => {
    return(
        <div className="row">
            <div className="col">
                <div className="unit-head-wrap">
                    <h2>Most popular songs</h2>
                </div>
                <div className="row no-padding">
                    {
                        songsPopularList.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i }} callAction={callAction}/> )
                    }
                </div>
            </div>
            <div className="col">
                <div className="unit-head-wrap">
                    <h2>Most user collection</h2>
                </div>
                <div className="row no-padding">
                    {
                        songsCollectionList.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i}} callAction={callAction}/> )
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        songsPopularList    : state.home.songsPopularList,
        songsCollectionList : state.home.songsCollectionList
    }
}

export default connect( mapStateToProps )( Songs );