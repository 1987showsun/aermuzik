/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React             from 'react';

// Modules
import AlbumsItem        from '../../../nodules/items/albums';
import BlockList         from '../../../nodules/blockList';

export default class Albums extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            list    : [],
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list    : props.data
        }
    }

    render(){

        const { list } = this.state;

        return(
            <div className="row">
                <div className="unit-head-wrap">
                    <h2>Because you listened to astrds</h2>
                </div>
                <BlockList>
                    {
                        list.map( (item,i) => {
                            return(
                                <AlbumsItem 
                                    key          = {item['_id']}
                                    data         = {{...item, idx:i}}
                                    handleAction = {this.props.callAction}
                                />
                            );
                        })
                    }
                </BlockList>
            </div>
        );
    }
}