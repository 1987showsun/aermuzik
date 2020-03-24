/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                 from 'react';
import { FontAwesomeIcon }   from '@fortawesome/react-fontawesome';
import { faEllipsisH }       from '@fortawesome/free-solid-svg-icons';


// Stylesheets
import '../public/stylesheets/tool.scss';

export default class Tool extends React.Component{

    constructor(props){
        super(props);
        this.tool = React.createRef();
        this.state = {
            open : false
        }
    }

    render(){

        const { children } = this.props;
        const { open }     = this.state;

        return(
            <div ref={this.tool} tabIndex={1} className={`tool-wrap ${open}`}>
                <div className="tool-switch" onClick={this.toolWrapOpenStatus.bind(this)}>
                    <i><FontAwesomeIcon icon={faEllipsisH}/></i>
                </div>
                <div className="tool-select">
                    <ul>
                        { children }
                    </ul>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('click', this.onClickOutsideHandler.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutsideHandler.bind(this));
    }

    toolWrapOpenStatus = () => {
        this.setState({
            open : true
        })
    }

    onClickOutsideHandler = (e) => {
        if (this.state.open && !this.tool.current.contains(e.target)) {
            this.setState({ open: false });
        }
    }
}