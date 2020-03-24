/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import React, { useState, useEffect } from 'react';

// Stylesheets
import './public/stylesheets/style.scss';

export default ({thead=null, children}) => {
    return(
        <div className="table-wrap">
            <div className="table">
                {
                    thead!=null?(
                        <div className="table-rows table-head">
                            {thead}
                        </div>
                    ):(
                        null
                    )
                }
                {
                    children.length!=0? (
                        children.map((item,i) => {
                            const subChildren       = item['props']['children'];
                            const subChildrenTypeof = typeof subChildren;
                            return (
                                <div key={`table-rows-${i}`} className="table-rows">
                                    {
                                        subChildrenTypeof=='object'?(
                                            subChildren.isArray?(
                                                subChildren.map( cellItem => {
                                                    return (cellItem);
                                                })
                                            ):(
                                                subChildren
                                            )
                                        ):(
                                            subChildrenTypeof=='string'?(
                                                subChildren
                                            ):(
                                                item
                                            )
                                        )
                                    }
                                </div>
                            );
                        })
                    ):(
                        null
                    )
                }
            </div>
            {
                children.length==0? (
                    <div className="table-rows onData">無任何資料</div>
                ):(
                    null
                )
            }
        </div>
    );
}