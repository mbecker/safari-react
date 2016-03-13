import { List, Map, fromJS } from 'immutable';
import { expect } from 'chai';
import { setState, authenticate } from '../src/reducer/actions';
import reducer from '../src/reducer/reducer';

// redux
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {

    it('handles setState simple', () => {
        const initialState = Map();
        const newState = Map({
            user: Map({
                uid: '123abc890',
                email: 'test@gmail.com'
            })
        });

        const nextReduxState = reducer(initialState, setState(newState));

        expect(nextReduxState).to.equal(fromJS({
            user: {
                uid: '123abc890',
                email: 'test@gmail.com'
            }
        }));

    });

});

describe('async actions', () => {
    afterEach(() => {
        nock.cleanAll()
    })

    it('handles authentication', (done) => {
         const email = 'test@gmail.com';
         const password = '123456';

         const expectedActions = [{
             type: 'AUTHENTICATE'
         }, {
             type: 'AUTHENTICATE',
             status: 'SUCCESS',
             user: {
                 uid: 'a1e8526d-ca67-4d57-94b5-38b4c0bfb7e9',
                 email: 'test@gmail.com'
             }
         }];

         const store = mockStore({}, expectedActions, done);
         store.dispatch(authenticate(email, password));
     });

    it('handles authentication error', (done) => {
        const email = 'test@gmail.com';
        const password = '1234567';

        const expectedActions = [{
            type: 'AUTHENTICATE'
        }, {
            type: 'AUTHENTICATE',
            status: 'ERROR',
            msg: 'INVALID_PASSWORD'
        }];

        const store = mockStore({}, expectedActions, done);
        store.dispatch(authenticate(email, password));
    });
});
