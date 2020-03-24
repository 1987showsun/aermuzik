/*
 *   Copyright (c) 2019 
 *   All rights reserved.
 */

import React                from 'react';
import { connect }          from 'react-redux';

// Jsons
import zip from '../../../../public/json/TWzipcode.json';

const initCity = Object.keys(zip)[0];
const initDist = Object.keys(zip[initCity])[0];

class Signup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            formObject        : {
                username        : '',
                password        : '',
                checkPassword   : '',
                nickname        : "",
                gender          : 'male',
                tel             : '',
                zipCode         : '',
                city            : initCity,
                dist            : initDist,
                addres          : ''
            }
        }
    }

    render(){

        const { formObject }         = this.state;
        const { username, password, checkPassword, nickname, gender, tel, city, dist, addres } = formObject;

        return(
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
        const { formObject } = this.state;
    }
}
const mapStateToProps = state => {
    return{
        
    }
}

export default connect( mapStateToProps )( Signup );