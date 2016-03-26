import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

const parks = [
		{
			image: './upload/polygon-wallpaper-22-1170x659.jpg',
			text: 'Addo Elephant Park',
			temp: 34,
			link: 'ish-icon-link'
		},
		{
			image:'./upload/spacescape_large-1024x341.jpg',
			text: 'Kruger National Park',
			temp: 12,
			link: 'ish-icon-doc-text-inv'
		},
		{
			image:'./upload/scene-large-1024x426.png',
			text: 'Bostwana Park',
			temp: 29,
			link: 'ish-icon-note-beamed'
		},
		{
			image:'./upload/polygon-wallpaper-7-1170x658.jpg',
			text: 'Asia Eleph Park',
			temp: 32,
			link: 'ish-icon-quote-right'
		},
		{
			image:'./upload/3_by_prusakov-d6khb94-1024x576.jpg',
			text: 'Lion Parks',
			date: 12,
			link: 'ish-icon-movie'
		},
		{
			image:'./upload/low_polygon4-1170x658.jpg',
			text: 'LA Zoo',
			date: 19,
			link: 'ish-icon-picture-1'
		}
	]

const ParksPage = React.createClass({	
	mixins: [PureRenderMixin],
    componentWillMount: function() {
        this.props.setHeaderImage(true);
        this.props.setFooterVisible(true);
        this.props.setFooterBig(true);
    },
    componentDidMount: function() {
        if (!document.body.classList.contains('transparent-nav')) {
            document.body.classList.add('transparent-nav');
        }
    },
    render() {
        return (
            <div id="parks">
              <div className="col-md-9">col-md-10</div>
              <div className="col-md-3">col-md-2</div>
            </div>
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
)(ParksPage);