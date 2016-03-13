import React from 'react'
import { Link } from 'react-router'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';
import { browserHistory } from 'react-router'

const LoginContainer = React.createClass({
    mixins: [PureRenderMixin],
    componentDidMount() {
        
    },
    componentWillMount(){
        this.props.logout();
        // browserHistory.push('/');
    },
    render() {
        return (
            <div className="parks">
              { !this.props.authenticated ?
                (
                <p>Logged out</p>
                ) : (
                <p>Still logged in ...</p>
                ) }

                { this.props.logoutx &&
                	(
                		<p>Logging out ...</p>
        		) }
            </div>
        )
    }
})

function mapStateToProps(state) {
    return {
        authenticated: state.reducer.getIn(['api', 'user', 'authenticated']),
        logoutx: state.reducer.getIn(['api', 'user', 'logout'])
    };
}

const Logout = connect(
    mapStateToProps,
    actions
)(LoginContainer);

export default Logout