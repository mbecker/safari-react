import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';


const Home = React.createClass({
    mixins: [PureRenderMixin],
    componentWillMount() {       
    },
    componentDidMount: function() {
    },
    render() {
        return (
            <div>
              
            </div>
        )
    }
})

function mapStateToProps(state) {
    return {
        authenticate: state.reducer.getIn(['api', 'user', 'authenticate']),
        authenticated: state.reducer.getIn(['api', 'user', 'authenticated']),
        error: state.reducer.getIn(['api', 'user', 'error']),
        email: state.reducer.getIn(['user', 'email']),
        headerCoverImage: state.reducer.getIn(['page', 'header', 'image']),
        footerBig: state.reducer.getIn(['page', 'footer', 'big']),
        footerVisible: state.reducer.getIn(['page', 'footer', 'visible'])
    };
}


export default connect(
    mapStateToProps,
    actions
)(Home);