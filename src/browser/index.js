/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                    from "react";
import { render }               from "react-dom";
import { Provider }             from "react-redux";
import { BrowserRouter,Route }  from "react-router-dom";
import configureStore           from "../shared/redux/store";
import App                      from "../shared/App";

const store = configureStore( window.__initialData__ );

render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"));