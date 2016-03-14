import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

import { MapBox } from './../Page'

const position = [51.505, -0.09];

export const Maps = React.createClass({
    mixins: [PureRenderMixin],
    componentWillMount: function() {
        this.props.setHeaderImage(false);
        this.props.setFooterVisible(false);
    },
    componentDidMount: function() {
        if (document.body.classList.contains('transparent-nav')) {
            document.body.classList.remove('transparent-nav');
        }
    },
    render() {
        return (
            <MapBox />
        )
    }
})

function mapStateToProps(state, ownProps) {
    return {
    };
}
export default connect(
    mapStateToProps,
    actions
)(Maps);