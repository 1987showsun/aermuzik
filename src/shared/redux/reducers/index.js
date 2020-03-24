/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import { combineReducers }             from "redux";

//Reducers
import home                            from './home';
import likes                           from './likes';
import member                          from './member';
import ranking                         from './ranking';
import albums                          from './albums';
import artists                         from './artists';
import comment                         from './comment';
import playlist                        from './playlist';
import collections                     from './collections';

export default combineReducers({
    home,
    likes,
    member,
    ranking,
    albums,
    artists,
    comment,
    playlist,
    collections
});