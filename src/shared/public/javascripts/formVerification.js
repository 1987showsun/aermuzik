/*
 *   Copyright (c) 2020 
 *   All rights reserved.
 */

export const VPWD = ( form ) => {
    const PWD        = form['password'];
    const confirmPWD = form['confirm'];
    let msg = "", status=true;
    if( PWD!="" && PWD == confirmPWD) {
        let re;
        if(PWD.length < 8) {
            status = false;
            msg = "password must contain at least eight characters";
        }
        re = /[0-9]/;
        if(!re.test(PWD)) {
            status = false;
            msg = "password must contain at least one number (0-9)";
        }
        re = /[a-z]/;
        if(!re.test(PWD)) {
            status = false;
            msg = "password must contain at least one lowercase letter (a-z)";
        }
        re = /[A-Z]/;
        if(!re.test(PWD)) {
            status = false;
            msg = "password must contain at least one uppercase letter (A-Z)";
        }
        return {
            status,
            msg
        }
    } else {
        msg = "please check that you've entered and confirmed your password";
        return {
            status: false,
            msg
        }
    }
}

export const checkRequired = ({ formObject={}, required=[] }) => {
    const checkRequired = required.filter( key => formObject[key].trim()=='');
    if( checkRequired.length>0 ){
        return{
            status   : false,
            unfilled : checkRequired,
        }
    }
    return {
        status : true,
        msg    : 'complete'
    }
}