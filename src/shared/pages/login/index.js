/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

// Pages
import AccountSignin  from './pages/account/sign_in';
import AccountSignup from './pages/account/sign_up';

// Stylesheets
import './public/stylesheets/style.scss';

export default class Index extends React.Component{
    render(){
        return(
            <section className="login-wrap">
                <Switch>
                    <Route exact={true} path="/account" component={AccountSignin} /> 
                    <Route path="/account/signup" component={AccountSignup} /> 
                    <Redirect to="/account" />
                </Switch>
            </section>
        );
    }
}