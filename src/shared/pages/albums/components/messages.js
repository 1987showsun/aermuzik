/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import $                                                   from 'jquery';
import React                                               from 'react';
import toaster                                             from "toasted-notes";
import { Link }                                            from 'react-router-dom';
import { connect }                                         from 'react-redux';

// Modules
import MessageItem                                         from '../../../nodules/items/message';

// Actions
import { commentPost, commentDelete }                      from '../../../actions/comment';

class Messages extends React.Component{

    constructor(props){
        super(props);
        this.messages = React.createRef();
        this.state = {
            userInfo    : props.userInfo,
            commentId   : props.commentId,
            data        : props.data,
            initComment : "",
            jwtToken    : props.jwtToken
        }
    }

    static getDerivedStateFromProps( props,state ){
        return{
            userInfo    : props.userInfo,
            commentId   : props.commentId,
            data        : props.data,
            jwtToken    : props.jwtToken
        };
    }

    render(){

        const { userInfo, data=[], jwtToken, initComment } = this.state;

        return(
            <div className="row">
                <div className="unit-head-wrap">
                    <h2>Comment Artists</h2>
                </div>
                {
                    jwtToken!=null && jwtToken.trim()!=''?(
                        <form className="form-messages" onSubmit={ this.handleSubmit.bind(this) }>
                            <div 
                                ref             ={this.messages} 
                                className       ="textarea" 
                                contentEditable ={true} 
                                placeholder     ="This is placeholder" 
                                onInput         ={(e)=>{
                                    this.setState({
                                        initComment: e.target.innerHTML
                                    })
                                }}
                            />
                            <div className="messages-action">
                                <button type="submit">SUBMIT</button>
                            </div>
                        </form>
                    ):(
                        <div className="form-messages-not-login">
                            <Link to="/account?back=true">登入</Link>
                        </div>
                    )
                }
                {
                    data.length>0? (
                        data.map((item,i) => {
                            return (
                                <MessageItem 
                                    key={i} 
                                    {...item} 
                                    userInfo     = {userInfo}
                                    handleAction = {this.handleAction.bind(this)}
                                />
                            )
                        })
                    ):(
                        <div className="message-item no-data">無任何評論</div>
                    )
                }
            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { current }        = this.messages;
        const { location, info } = this.props;
        const { initComment }    = this.state;
        const { pathname }       = location;
        let   text               = "";
        initComment.replace(/<div>|<p>/g,',').replace(/<\/div>|<\/p>/g,'').split(',').map( item => {
            if( item!='' ){
                text = `${text}<p>${item}</p>`
            }
        });
        
        this.props.dispatch( commentPost(pathname,{},{ type: 'album', type_id: info['_id'], text: text }) ).then( res => {

            let status      = 'failure';
            let status_text = 'Add failure';

            if( res['status']==200 ){
                status      = 'success';
                status_text = 'Add successful';
                $(current).text('');
            }

            toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                position    : "bottom-right",
                duration    : 3000
            });
        });
    }

    handleAction = ( val ) => {

        const { commentId }      = this.state;
        const { location }       = this.props;
        const { pathname }       = location;

        switch( val['actionType'] ){
            case 'update':
                break;

            default:
                this.props.dispatch( commentDelete(pathname, {},{ id: commentId, single_comment_id: val['id'] }) ).then( res => {
                    let status      = 'failure';
                    let status_text = 'Delete failure';

                    if( res['status']==200 ){
                        status      = 'success';
                        status_text = 'Delete successful';
                    }

                    toaster.notify( <div className={`toaster-status-block toaster-${status}`}>{status_text}</div> , {
                        position    : "bottom-right",
                        duration    : 3000
                    });
                })
                break;
        }
    }
}

const mapStateToProps = state => {
    return{
        jwtToken : state.member.jwtToken,
        userInfo : state.member.info
    }
}

export default connect( mapStateToProps )( Messages );