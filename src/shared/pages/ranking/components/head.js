/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React       from 'react';
import { Link }    from 'react-router-dom';
import { connect } from 'react-redux';

// Modules
import AlbumItem    from '../../../nodules/items/albums';

class Head extends React.Component{

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
                <ul className="ranking-ul">
                    {
                        list.map( item => {
                            return(
                                <li key={item['_id']} >
                                    <AlbumItem data={item} handleAction={this.callAction.bind(this)}/>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    callAction = ( actionType='', val={} ) => {
    }
}

const mapStateToProps = state => {
    return{
        list: state.ranking.rankingAlbumsAll
    }
}

export default connect( mapStateToProps )( Head );