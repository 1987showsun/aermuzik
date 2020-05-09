/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React       from 'react';
import { Link }    from 'react-router-dom';
import { connect } from 'react-redux';

// Modules
import AlbumItem    from '../../../nodules/items/albums';

const Head = ({ list, callAction }) => {
    return(
        <div className="row">
            <ul className="ranking-ul">
                {
                    list.map( item => {
                        return(
                            <li key={item['_id']} >
                                <AlbumItem 
                                    data         = {item} 
                                    handleAction = {callAction}
                                />
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        list: state.ranking.rankingAlbumsAll
    }
}

export default connect( mapStateToProps )( Head );