/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                      from 'react';
import queryString                from 'query-string';
import { Link }                   from 'react-router-dom';
import { connect }                from 'react-redux';
import FacebookLogin              from 'react-facebook-login/dist/facebook-login-render-props';

// Actions
import { signIn, otherSignIn }    from '../../../../actions/member';

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            msg        : [],
            formObject : {
                username: '',
                password: ''
            }
        }
    }

    render(){

        const { formObject, msg }    = this.state;
        const { username, password } = formObject;

        return(
            <form className="noLable login-form" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-head">
                    <h2>Sigin In</h2>
                    <p>log into your username</p>
                </div>
                <ul>
                    <li>
                        <div className="input-box">
                            <input type="email" name="username" value={username} onChange={this.handleChange.bind(this)} placeholder="Username (email)"/>
                        </div>
                    </li>
                    <li>
                        <div className="input-box">
                            <input type="password" name="password" value={password} onChange={this.handleChange.bind(this)} placeholder="Password"/>
                        </div>
                    </li>
                    {
                        msg.length!=0? (
                            msg
                        ):(
                            null
                        )
                    }
                    <li>
                        <button typ="submit">SUBMIT</button>
                    </li>
                    <li className="sub-wrap-li">
                        <span>OR</span>
                    </li>
                    <li>
                        <FacebookLogin
                            appId      = "537403013489428"
                            autoLoad   = {false}
                            fields     = "name,email,picture"
                            scope      = "public_profile"
                            callback   = {this.responseFacebook.bind(this)}
                            render     = {renderProps => (
                                <button type="button" className="other-login-button fb" onClick={renderProps.onClick}>FACEBOOK LOGIN</button>
                            )}
                        />
                    </li>
                    <li>
                        <p>A single Musik ID and password gives you access to all Musik services.</p>
                        <Link to="/account/signup">SIGNUP</Link>
                    </li>
                </ul>
            </form>
        );
    }

    responseFacebook = ( response ) => {
        const { location, history } = this.props;
        const { pathname, search }  = location;
        const { back=false }        = queryString.parse(search);
        const { name, email, graphDomain, userID, picture } = response;
        const data = {
            username      : email,
            nickname      : name,
            otherUserId   : userID,
            cover         : picture['data']['url'],
            wayToRegister : graphDomain
        }
        this.props.dispatch( otherSignIn({ data }) ).then( res => {
            this.setState({
                msg : []
            },()=>{
                if( back ){
                    history.goBack();
                }else{
                    history.push({
                        pathname: '/myaccount'
                    })
                }
            });
        }).catch( err => {
            const { msg } = err['response']['data'];
            this.setState({
                msg : [<div key={1}>{msg}</div>]
            });
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            formObject: {
                ...this.state.formObject,
                [name]: value
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { formObject }        = this.state;
        const { location, history } = this.props;
        const { pathname, search }  = location;
        const { back=false } = queryString.parse(search);
        
        this.props.dispatch( signIn(pathname, {...queryString.parse(search)}, formObject) ).then( res => {
            this.setState({
                msg : []
            },()=>{
                if( back ){
                    history.goBack();
                }else{
                    history.push({
                        pathname: '/myaccount'
                    })
                }
            });
        }).catch( err => {
            const { msg } = err['response']['data'];
            this.setState({
                msg : [<div key={1}>{msg}</div>]
            });
        })
    }
}
const mapStateToProps = state => {
    return{
        jwtToken : state.member.jwtToken
    }
}

export default connect( mapStateToProps )( Login );