/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                                               from 'react';
import toaster                                             from "toasted-notes";
import { connect }                                         from 'react-redux';

// Modules
import Popup                                               from '../../../../nodules/popup';

// Actions
import { signUp }                                          from '../../../../actions/member';

// Jsons
import zip                                                 from '../../../../public/json/TWzipcode.json';

// Javascripts
import { VPWD, checkRequired }                             from '../../../../public/javascripts/formVerification';

const initCity    = Object.keys(zip)[0];
const initDist    = Object.keys(zip[initCity])[0];
const initZipCode = zip[initCity][initDist];

class Signup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            popupSwitch       : false,
            msg               : [],
            required          : ['username', 'password', 'checkPassword', 'nickname', 'gender'],
            formObject        : {
                username        : '',
                password        : '',
                checkPassword   : '',
                nickname        : "",
                gender          : 'male',
                tel             : '',
                zipCode         : initZipCode,
                city            : initCity,
                dist            : initDist,
                addres          : ''
            }
        }
    }

    render(){

        const { formObject, popupSwitch, msg }         = this.state;
        const { username, password, checkPassword, nickname, gender, tel, city, dist, addres } = formObject;

        return(
            <>
                <form className="noLable" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-head">
                        <h2>Signup</h2>
                    </div>
                    <ul>
                        <li>
                            <div className="input-box">
                                <input type="email" name="username" value={username} onChange={this.handleChange.bind(this)} placeholder="＊Userbane (Email)"/>
                            </div>
                        </li>
                        <li>
                            <div className="input-box">
                                <input type="password" name="password" value={password} onChange={this.handleChange.bind(this)} placeholder="＊Password"/>
                            </div>
                        </li>
                        <li>
                            <div className="input-box">
                                <input type="password" name="checkPassword" value={checkPassword} onChange={this.handleChange.bind(this)} placeholder="＊Check password"/>
                            </div>
                        </li>
                        <li>
                            <div className="input-box">
                                <input type="text" name="nickname" value={nickname} onChange={this.handleChange.bind(this)} placeholder="＊Nickname"/>
                            </div>
                        </li>
                        <li>
                            <label className="radio" htmlFor="male">
                                <div className="input-box radio">
                                    <input type="radio" id="male" name="gender" value="male" onChange={this.handleChange.bind(this)} checked={gender=='male'}/>
                                    <div className="radio-display"></div>
                                </div>
                                Ｍale
                            </label>
                            <label className="radio" htmlFor="female">
                                <div className="input-box radio">
                                    <input type="radio" id="female" name="gender" value="female" onChange={this.handleChange.bind(this)} checked={gender=='female'}/>
                                    <div className="radio-display"></div>
                                </div>
                                Female
                            </label>
                        </li>
                        <li>
                            <div className="input-box">
                                <input type="tel" name="tel" value={tel} onChange={this.handleChange.bind(this)} placeholder="Tel"/>
                            </div>
                        </li>
                        <li>
                            <div className="input-box select">
                                <select name="city" value={city} onChange={this.handleChange.bind(this)}>
                                    {
                                        Object.keys( zip ).map( cityItem => {
                                            return(<option key={cityItem} value={cityItem}>{cityItem}</option>);
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input-box select">
                                <select name="dist" value={dist} onChange={this.handleChange.bind(this)}>
                                    {
                                        Object.keys( zip[city] ).map( distItem => {
                                            return(<option key={distItem} value={distItem}>{distItem}</option>);
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input-box">
                                <input type="text" name="addres" value={addres} onChange={this.handleChange.bind(this)} placeholder="＊Addres"/>
                            </div>
                        </li>
                        <li>
                            <button typ="submit">SUBMIT</button>
                        </li>
                        <li>
                            <button className="back" onClick={()=>{
                                const { history } = this.props;
                                history.goBack();
                            }}>
                                BACK
                            </button>
                        </li>
                    </ul>
                </form>
                <Popup 
                    className  ='wrong-popup'
                    popupSwitch={popupSwitch}
                    onCancel   ={() => this.setState({popupSwitch: false})}
                >
                    <div className="wrong-block">{msg}</div>
                    <ul className="popup-action">
                        <li><button onClick={() => this.setState({popupSwitch: false})}>CLOSE</button></li>
                    </ul>
                </Popup>
            </>
        );
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        let   { formObject, city, zipCode, dist }  = this.state;
        switch( name ){
            case 'city':
                dist       = Object.keys(zip[value])[0];
                zipCode    = zip[value][dist];
                formObject = { ...formObject, [name]: value, dist, zipCode };
                break;

            case 'dist':
                zipCode    = zip[city][value];
                formObject = { ...formObject, dist: value, zipCode };
                break;

            default:
                formObject = { ...formObject, [name]: value };
                break;
        }

        this.setState({
            formObject
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { history } = this.props;
        const { formObject, required } = this.state;
        const verificationPassword = VPWD({ password: formObject['password'], confirm: formObject['checkPassword'] });
        const requiredResult       = checkRequired({formObject, required});
        if( requiredResult['status'] ){
            if( verificationPassword['status'] ){
                this.props.dispatch( signUp({ data: { ...formObject } }) ).then( res => {
                    const { status, data } = res;
                    if( status==200 ){
                        toaster.notify( <div className={`toaster-status-block toaster-success`}>{data['status_text']}</div> , {
                            position    : "bottom-right",
                            duration    : 3000
                        });
                        history.push({
                            pathname: '/account'
                        })
                    }else{
                        this.setState({
                            popupSwitch : true,
                            msg         : [<div key="pwderr" className="msg-list-item">{data['status_text']}</div>]
                        });
                    }
                })
            }else{
                this.setState({
                    popupSwitch     : true,
                    msg             : [<div key="pwderr" className="msg-list-item">1. {verificationPassword['msg']}</div>]
                })
            }
        }else{
            this.setState({
                popupSwitch : true,
                msg         : requiredResult['unfilled'].map((key,i) => {
                    return <div key={key} className="msg-list-item">{i+1}. {key}</div>
                })
            })
        }
    }
}
const mapStateToProps = state => {
    return{
        
    }
}

export default connect( mapStateToProps )( Signup );