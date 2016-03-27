import AppPage from './../components/App';
import Home from './../components/Home';
import Login from './../components/Login';
import Parks from './../components/Parks';
import Park from './../components/Park';
import Logout from './../components/Logout'
import Maps from './../components/Maps'
import Maps2 from './../components/Maps2'

export default (store) => {
    function loggedInRedirectTo(nextState, replace, callback) {
        // User is already logged in,
        // redirect to '/'
        const authenticated = store.getState().reducer.getIn(['api', 'user', 'authenticated']);
        if (authenticated) {
            replace('/');
        }
        callback();
    }

    function notLoggedInRedirectToLogin(nextState, replace) {
        // User is not logged in,
        // redirect to login
        const authenticated = store.getState().reducer.getIn(['api', 'user', 'authenticated']);
        if (!authenticated) {
            replace({
                pathname: '/login',
                state: {
                    nextPathname: nextState.location.pathname
                }
            })
        }
    }

    return (
    {
        component: AppPage,
        childRoutes: [
            {
                onEnter: loggedInRedirectTo,
                childRoutes: [
                    {
                        path: '/login',
                        getComponent: (location, cb) => {
                            require.ensure([], (require) => {
                                cb(null, Login)
                            })
                        }
                    }
                ]
            },



            {

                childRoutes: [
                    {
                        path: '/parks',
                        getComponent: (location, cb) => {
                            require.ensure([], (require) => {
                                cb(null, Parks)
                            })
                        },
                        childRoutes: [
                            {
                                onEnter: notLoggedInRedirectToLogin,
                                path: '/parks/:park',
                                getComponent: (location, cb) => {
                                    require.ensure([], (require) => {
                                        cb(null, Park)
                                    })
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: '/',
                indexRoute: {
                    getComponent: (location, cb) => {
                        require.ensure([], (require) => {
                            cb(null, Maps2)
                        })
                    }
                }
            },
            {
                onEnter: notLoggedInRedirectToLogin,
                path: '/logout',
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, Logout)
                    })
                }

            },
            {
                path: '/map',
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, Maps)
                    })
                }

            },
            {
                path: '/map2',
                getComponent: (location, cb) => {
                    require.ensure([], (require) => {
                        cb(null, Maps2)
                    })
                }

            }
        ]
    }
    )
}