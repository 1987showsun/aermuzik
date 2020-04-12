/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React, { useState, useEffect }                      from 'react';
import toaster                                             from "toasted-notes";
import { connect }                                         from 'react-redux';

// Modules
import BlockList                                           from '../../../../nodules/blockList';
import AlbumItem                                           from '../../../../nodules/items/albums';

// Actions
import { albumsCollection }                                from '../../../../actions/member';
import { collection }                                      from '../../../../actions/collection';

const Index = ({dispatch, location, match, total, limit, current, list}) => {

    const [ testList, setList ] = useState([]);
    const [ stateLoading, setLoading ] = useState(true);

    useEffect(()=>{
        dispatch( albumsCollection({}) ).then( res => {
            setLoading(false);
        });
    },[stateLoading]);

    useEffect(()=>{
        setList([...list]);
    },[list]);

    const callAction = ( actionType='', val={} ) => {
        const { pathname, search } = location;
        const toasterFunction      = ({status='failure' , status_text=''}) => {
            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        }

        switch( actionType ){
            case 'collectionAlbums':
                dispatch( collection({ method: 'put',query:{type: 'albums'},data:{id: val['_id']}}) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Update failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Update successful';
                        dispatch( albumsCollection({}) );
                    }

                    toasterFunction({ status, status_text });
                });
                break;
        }
    } 

    return(
        <>
            <BlockList>
                {
                    list.map( item => <AlbumItem key={item['_id']} data={item} handleAction={callAction.bind(this)}/>)
                }
            </BlockList>
        </>
    );
}

const mapStateToProps = state => {
    return{
        total    : state.member.albumsCollection.total,
        limit    : state.member.albumsCollection.limit,
        current  : state.member.albumsCollection.current,
        list     : state.member.albumsCollection.list
    }
}

export default connect( mapStateToProps )( Index );