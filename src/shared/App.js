/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import $                                 from 'jquery';
import React                             from 'react';
import queryString                       from 'query-string';
import { connect }                       from 'react-redux';
import { Route, Switch, Redirect }       from "react-router-dom";
import { renderRoutes }                  from 'react-router-config';

// Components
import Nav    from './components/nav';
import Header from './components/header';
import Footer from './components/footer';

//Routes
import routers                           from './routes';
import Audio                             from './nodules/player';

// Stylesheets
import './public/stylesheets/common.scss';
import './public/stylesheets/blur.css';

class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            displayCommonComponent: ['news','ranking','albums','artists','account'],
            displayFooterComponent: ['account']
        }
    }

    static getDerivedStateFromProps(props) {
        return null;
    }

    render(){

        const { displayCommonComponent, displayFooterComponent } = this.state;
        const { location }  = this.props;
        const { pathname }  = location;
        const pathnameArray = pathname.split('/').filter( item => item!='' );
        const displayHeaderStatus = displayCommonComponent.includes( pathnameArray[0]) || true;
        const displayFooterStatus = displayFooterComponent.includes( pathnameArray[0]) || false;

        return(
            <>
                <Nav />
                <main className={`${displayFooterStatus}`}>
                    <Switch>
                        {renderRoutes(routers)}
                        <Redirect to="/"/>
                    </Switch>
                    {
                        !displayFooterStatus &&
                            <Footer />
                    }
                    {
                        !pathnameArray.includes('account') &&
                            <Audio />
                    }
                </main>
            </>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { location }      = this.props;
        const pathname          = location.pathname.split('/').filter( item => item!='' );
        const search            = queryString.parse(location.search);
        const prevPropsLocation = prevProps.location;
        const prevPathname      = prevPropsLocation.pathname.split('/').filter( item => item!='' );
        const prevSearch        = queryString.parse(prevPropsLocation.search);
        let pathnameComparison  = false;
        let searchComparison    = false;

        if( pathname.length>prevPathname.length ){
            pathnameComparison = pathname.some( (keys,i) => keys!=prevPathname[i] );
        }else{
            pathnameComparison = prevPathname.some( (keys,i) => keys!=pathname[i] );
        }
        
        if( pathnameComparison || searchComparison ){
            $('#root').scrollTop(0);
        }
    }
}

const mapStateToProps = ( state ) => {
    return{
    }
}

export default connect(mapStateToProps)(Layout);