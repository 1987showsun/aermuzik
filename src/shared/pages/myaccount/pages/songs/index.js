/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React,{ useState, useEffect } from 'react';
import { connect } from 'react-redux';

// Modules
import SongsItem from '../../../../nodules/items/songs';

// Actions
import { songsCollection } from '../../../../actions/member';

const Index = ({dispatch, total, limit, current, list}) => {

    const [ stateLoading, setLoading ] = useState(true);

    useEffect(()=>{
        dispatch( songsCollection({}) ).then( res => {
            setLoading(false);
        });
    },[stateLoading]);

    return(
        <>
            {
                list.map( (item,i) => <SongsItem key={item['_id']} data={{...item, idx:i }}/> )
            }
        </>
    );
}

const mapStateToProps = state => {
    return{
        total    : state.member.songsCollection.total,
        limit    : state.member.songsCollection.limit,
        current  : state.member.songsCollection.current,
        list     : state.member.songsCollection.list
    }
}

export default connect( mapStateToProps )( Index );