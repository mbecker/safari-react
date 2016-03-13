import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';
//var tk = require('timekeeper');
import * as tk from 'timekeeper'

import reducer from '../src/reducer/reducer';

describe('reducer', () => {

    it('handles SET_STATE simple', () => {
        const initialState = Map();
        const action = {
            type: 'SET_STATE',
            state: Map({
                user: Map({
                    uid: '123abc890',
                    email: 'test@gmail.com'
                })
            })
        };

        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            user: {
                uid: '123abc890',
                email: 'test@gmail.com'
            }
        }));

    });

    it('handles SET_STATE advanced', () => {
        const initialState = Map({
            sightings: List.of('Elephant', 'Lions', 'Zebra')
        });
        const action = {
            type: 'SET_STATE',
            state: Map({
                user: Map({
                    uid: '123abc890',
                    email: 'test@gmail.com'
                })
            })
        };

        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra'],
            user: {
                uid: '123abc890',
                email: 'test@gmail.com'
            }
        }));

    });

    it('handles SET_USER', () => {
        const initialState = Map({
            sightings: List.of('Elephant', 'Lions', 'Zebra')
        });
        const authData = {
            uid: '123abc890',
            email: 'test@gmail.com',
            provider: 'email'
        };
        const action = {
            type: 'SET_USER',
            user: authData
        };

        const stateSetUser = reducer(initialState, action);

        expect(stateSetUser).to.equal(fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra'],
            user: {
                uid: '123abc890',
                email: 'test@gmail.com',
                provider: 'email'
            }
        }));
    });

    it('handels DELETE_USER of existing user', () => {
        const initialState = fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra'],
            user: {
                uid: '123abc890',
                email: 'test@gmail.com',
                provider: 'email'
            }
        });
        const action = {
            type: 'DELETE_USER'
        };

        const deletedUserState = reducer(initialState, action);

        expect(deletedUserState).to.equal(fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra']
        }));
    });

    it('handels DELETE_USER of non existing user', () => {
        const initialState = fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra']
        });
        const action = {
            type: 'DELETE_USER'
        };

        const deletedUserState = reducer(initialState, action);

        expect(deletedUserState).to.equal(fromJS({
            sightings: ['Elephant', 'Lions', 'Zebra']
        }));
    });
});

describe('reducer authenticate', () => {
    it('handles AUTHENTICATE', () => {
        var time = Date.now();
        tk.freeze(time);
        const initialState = Map();
        const authenticateAction = {
            type: 'AUTHENTICATE'
        };

        const nextState = reducer(initialState, authenticateAction);

        expect(nextState).to.equal(fromJS({
            api: {
                user: {
                    authenticated: true,
                    success: false,
                    error: false,
                    msg: null,
                    timestamp: time
                }
            }
        }));

    });

    it('handles AUTHENTICATE.SUCCESS', () => {
        var time = Date.now();
        tk.freeze(time);
        const initialState = fromJS({
            api: {
                user: {
                    authenticated: true,
                    success: false,
                    error: false,
                    msg: null,
                    timestamp: time
                }
            }
        });
        const authenticateAction = {
            type: 'AUTHENTICATE',
            status: 'SUCCESS',
            user: {
            	uid: 'a1e8526d-ca67-4d57-94b5-38b4c0bfb7e9',
                email: 'test@gmail.com'
            }
        };

        const nextState = reducer(initialState, authenticateAction);

        expect(nextState).to.equal(fromJS({
            api: {
                user: {
                    authenticated: false,
                    success: true,
                    error: false,
                    msg: null,
                    timestamp: Date.now()
                }
            },
            user: {
                uid: 'a1e8526d-ca67-4d57-94b5-38b4c0bfb7e9',
                email: 'test@gmail.com'
            }
        }));

    });

    it('handles AUTHENTICATE.ERROR', () => {
        const initialState = fromJS({
            api: {
                user: {
                    authenticated: true,
                    success: false,
                    error: false,
                    msg: null,
                    timestamp: Date.now()
                }
            }
        });
        const authenticateAction = {
            type: 'AUTHENTICATE',
            status: 'ERROR',
            msg: 'ERROR AUTHENTICATION'
        };

        const nextState = reducer(initialState, authenticateAction);

        expect(nextState).to.equal(fromJS({
            api: {
                user: {
                    authenticated: false,
                    success: false,
                    error: true,
                    msg: 'ERROR AUTHENTICATION',
                    timestamp: Date.now()
                }
            }
        }));

    });
});
