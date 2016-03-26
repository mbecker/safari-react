import React from "react";
import { render } from 'react-dom'
import { browserHistory, Router } from 'react-router'
import routes from './router/routes'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger';
import reducer from './reducer/reducer';
import { syncHistoryWithStore, routerReducer, push,routerMiddleware } from 'react-router-redux'
import { setInitialState, authenticationListener } from './reducer/actions';
import middleware from './router/middleware'

const logger = createLogger();
const middleware2 = routerMiddleware(browserHistory)
const addDevToolsToStore = compose(
    applyMiddleware(
        thunkMiddleware,
        middleware2,
        middleware(push),
        logger
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = addDevToolsToStore(combineReducers({
    reducer,
    routing: routerReducer
}));

store.dispatch(authenticationListener());

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

const route = routes(store);

render(
    <Provider store={ store }>
      <Router history={ history } routes={ route } onUpdate={() => window.scrollTo(0, 0)} />
    </Provider>,
    document.getElementById('reactapp')
)