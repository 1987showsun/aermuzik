/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import { connect }                                         from 'react-redux';
import queryString                                         from 'query-string';
import { Helmet }                                          from "react-helmet";

// Components
import Nav                                                 from './components/nav';

//Modules
import BlockList                                           from '../../nodules/blockList';
import ArtistItem                                          from '../../nodules/items/artists';
import More                                                from '../../nodules/common/more';

// Actions
import { ssrArtists }                                      from '../../actions/artists';

// Stylesheets
import '../../public/stylesheets/slider.scss';

class Index extends React.Component{

    static initialAction( pathname,query,data ){
        return ssrArtists(pathname,query,data );
    }

    constructor(props){
        super(props);
        this.state = {
            navData              : ['chinese','cantonese','korean','western'],
            list                 : [],
            og                   : {
                url                  : ""
            }
        }
    }

    static getDerivedStateFromProps(props,state){
        return{
            list: props.list
        }
    }

    render(){

        const { navData, list, og }  = this.state;
        const { location }       = this.props;
        const { pathname, search } = location;
        const lang         = queryString.parse(search)['lang'] || 'chinese';
        const current      = Number(queryString.parse(search)['current'])+1 || '2';
        const morePath     = `${pathname}?${queryString.stringify({ lang,current })}`;

        return(
            <>
                <Helmet>
                    <title>AERMUZIK - Article</title>
                    <meta property="og:url"                content={og['url']} />
                </Helmet>
                <div className="row"></div>
                <div className="row">
                    <Nav location={location} data={navData}/>
                    <BlockList>
                        {
                            list.map( (item,i) => {
                                return( <ArtistItem key={item['_id']} data={{...item, idx: i}}/> );
                            })
                        }
                    </BlockList>
                </div>
                <More path={morePath}/>
            </>
        );
    }

    componentDidMount() {
        const { og }               = this.state;
        this.callAPI();
        this.setState({
            og: { 
                ...og,
                url : window.location.href
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const searchObject     = queryString.parse(this.props.location.search);
        const prevSearchObject = queryString.parse(prevProps.location.search);
        let   isReload = false;

        if( Object.keys(searchObject).length>Object.keys(prevSearchObject).length ){
            isReload = Object.keys(searchObject).some( keys => searchObject[keys]!=prevSearchObject[keys] );
        }else{
            isReload = Object.keys(prevSearchObject).some( keys => prevSearchObject[keys]!=searchObject[keys] );
        }

        if( isReload ){
            this.callAPI();
        }
    }

    callAPI = () => {
        const { location } = this.props;
        const { pathname, search } = location;
        this.props.dispatch(ssrArtists(pathname,{ ...queryString.parse(search) } ));
    }
}

const mapStateToProps = state => {
    return{
        list: state.artists.artistsList
    }
}

export default connect( mapStateToProps )( Index );