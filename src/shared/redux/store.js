/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

import { createStore, applyMiddleware } from "redux";
import { createLogger } from 'redux-logger';
import thunk from "redux-thunk";
import reducer from "./reducers"

export default (preloadedState) => {
  return createStore(reducer, preloadedState, applyMiddleware(thunk, createLogger({
    predicate: function(){
      return process.env['NODE_ENV_DEV'];
    }
  })));
};