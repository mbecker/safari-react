import { List, Map, fromJS } from 'immutable';


function showError(msg) {
    console.log('/////////// ERROR /\/\/\/\/\/\/\/\/\/\ ');
    console.log(msg);
    return true;
}

function setInitialState(state) {
    let authenticateState = Map({
        api: Map({
            user: Map({
                authenticate: false,
                logout: false,
                authenticated: false,
                error: false,
                timestamp: Date.now()
            })
        }),
        user: null,
        page: Map({
            header: Map({
                image: true
            }),
            footer: Map({
                visible: true,
                big: true
            })
        }),
        session: Date.now()
    });
    return setState(state, authenticateState);
}

function setState(state, newState) {
    return state.merge(newState);
}

function setUser(state, user) {
    return state.set('user', fromJS(user));
}

function deleteUser(state) {
    return state.delete('user');
}

/**
 * Page reducer
 */
function setFooterVisible(state, show) {
    return state.setIn(['page', 'footer', 'visible'], show);
}

function setHeaderImage(state, show) {
    return state.setIn(['page', 'header', 'image'], show);
}

function setFooterBig(state, show) {
    return state.setIn(['page', 'footer', 'big'], show);
}

// Authenticate
function authenticate(state) {
    let authenticateState = Map({
        api: Map({
            user: Map({
                authenticate: true,
                logout: false,
                authenticated: false,
                error: false,
                timestamp: Date.now()
            })
        })
    });
    return setState(state, authenticateState);
}

function authenticateSuccess(state, user) {
    let authenticateSuccessState = Map({
        api: Map({
            user: Map({
                authenticate: false,
                logout: false,
                authenticated: true,
                error: false,
                timestamp: Date.now()
            })
        }),
        'user': fromJS(user)
    });
    return setState(state, authenticateSuccessState);
}

function authenticateError(state, msg) {
    let authenticateErrorState = Map({
        api: Map({
            user: Map({
                authenticate: false,
                logout: false,
                authenticated: false,
                error: msg,
                timestamp: Date.now()
            })
        })
    });
    return setState(state, authenticateErrorState);
}

function authenticateLogout(state) {
    let authenticateErrorState = Map({
        api: Map({
            user: Map({
                authenticate: false,
                logout: true,
                authenticated: true,
                error: false,
                msg: null,
                timestamp: Date.now()
            })
        })
    });
    return setState(state, authenticateErrorState);
}

/**
 * Reducer Action Tyops
 */
// If no state is given, create new Map
export default function(state = Map(), action) {
    switch (action.type) {
        case 'SET_INITIALSTATE':
            return setInitialState(state);
        case 'SET_FOOTERVISIBLE':
            return setFooterVisible(state, action.show);
        case 'SET_HEADERIMAGE':
            return setHeaderImage(state, action.show);
        case 'SET_FOOTERBIG':
            return setFooterBig(state, action.show);
        case 'ERROR':
            return showError(action.msg);
        case 'SET_STATE':
            return setState(state, action.state);
        case 'SET_USER':
            return setUser(state, action.user);
        case 'DELETE_USER':
            return deleteUser(state);
        case 'AUTHENTICATE':
            if (action.status === "SUCCESS") return authenticateSuccess(state, action.user);
            if (action.status === "ERROR") return authenticateError(state, action.msg);
            if (action.status === "LOGOUT") return authenticateLogout(state);
            return authenticate(state);
    }
    return state;
}
