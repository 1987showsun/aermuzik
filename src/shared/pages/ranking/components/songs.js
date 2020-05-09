/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React       from 'react';
import { connect } from 'react-redux';

// Modules
import SongItem    from '../../../nodules/items/songs';

const Songs = ({ callAction, playlist, list=[] }) => {
    return(
        <div className="row">
            <div className="unit-head-wrap">
                <h2>Songs ranking</h2>
            </div>
            {
                list.map((item,i) => {
                    return(
                        <SongItem 
                            key         = {item['_id']} 
                            data        = {{...item,idx:i}}
                            playlist    = {playlist.map( item => item['_id'] )}
                            callAction  = {callAction}
                        />
                    )
                })
            }
        </div>
    );
}

const mapStateToProps = state => {
    return{
        playlist   : state.playlist.list,
        list       : state.home.songsPopularList
    }
}

export default connect( mapStateToProps )( Songs )