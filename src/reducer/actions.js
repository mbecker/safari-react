var Firebase = require('firebase');
const FireBaseRef = new Firebase("https://safaridigital.firebaseio.com/");

export function setInitialState() {
    return {
        type: 'SET_INITIALSTATE'
    }
}

export function setState(state) {
    return {
        type: 'SET_STATE',
        state
    };
}

/**
 * Page action
 */
export function setFooterVisible(show){
    return {
        type: 'SET_FOOTERVISIBLE',
        show: show
    };
}

export function setHeaderImage(show){
    return {
        type: 'SET_HEADERIMAGE',
        show: show
    };
}

export function setFooterBig(show){
    return {
        type: 'SET_FOOTERBIG',
        show: show
    };
}

/**
 * Authentication actions
 */
// Async actions
// http://redux.js.org/docs/advanced/AsyncActions.html

export function authenticationListener() {
    return function(dispatch, getState) {
        FireBaseRef.onAuth(function(authData) {
            if (authData) {
                let user = {
                    uid: authData.uid,
                    email: authData.password.email
                };
               return dispatch({
                    type: 'AUTHENTICATE',
                    status: 'SUCCESS',
                    user: user
                });
            } else {
                return dispatch({
                    type: 'SET_INITIALSTATE'
                });
            }
        });
    }
}

export function auth(email, password) {
    return function(dispatch) {
        dispatch({
            type: 'AUTHENTICATE'
        });
        FireBaseRef.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            if (error) {

                dispatch({
                    type: 'AUTHENTICATE',
                    status: 'ERROR',
                    msg: error.code
                });
            } else {
                let user = {
                    uid: authData.uid,
                    email: authData.password.email
                };
                return dispatch({
                    type: 'AUTHENTICATE',
                    status: 'SUCCESS',
                    user: user,
                    meta: {authenticated: true}
                });
            }
        // else {
        //     let user = {
        //      uid: authData.uid,
        //      email: authData.password.email
        //     };
        //     dispatch({ type: 'AUTHENTICATE', status: 'SUCCESS', user: user });
        // }
        });
    }
}

export function authenticateError(msg) {
    return {
        type: 'AUTHENTICATE',
        status: 'ERROR',
        msg: msg
    }
}

export function logout() {
    return function(dispatch, getState) {
        
        dispatch({
            type: 'AUTHENTICATE',
            status: 'LOGOUT',
            meta: {authenticated: false}
        });
        FireBaseRef.unauth();
    }
}