import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';


const Home = React.createClass({
    mixins: [PureRenderMixin],
    componentWillMount() {       
        console.log("APP HOME");
        console.log("Footer visibile: " + this.props.footerVisible);
        this.props.setHeaderImage(true);
        this.props.setFooterVisible(true);
        this.props.setFooterBig(true);
        console.log("Footer visibile: " + this.props.footerVisible);
    },
    componentDidMount: function() {
        if (!document.body.classList.contains('transparent-nav')) {
            document.body.classList.add('transparent-nav');
        }
    },
    render() {
        return (
            <div>
              <section id="sec-features" className="no-border-bottom">
                <div className="container">
                  <header className="section-header">
                    <span>It's amazing</span>
                    <h2>Key <strong>features</strong></h2>
                    <p>TheGuide offeres a wide range of amazing features to help you develop better documentation</p>
                  </header>
                  <div className="row">
                    <div className="col-sm-4 content-center text-right">
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-html5 txt-gray"></i>
                        <h5>HTML5 & CSS3</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                      <br/>
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-pie-chart txt-gray"></i>
                        <h5>Clean Design</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                      <br/>
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-code txt-gray"></i>
                        <h5>Developer-friendly codes</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <img src="img/features-mob.png" alt="features" />
                    </div>
                    <div className="col-sm-4 content-center">
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-tv txt-gray"></i>
                        <h5>Responsive design</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                      <br/>
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-file-text-o txt-gray"></i>
                        <h5>Well Documented</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                      <br/>
                      <div className="list-view-item">
                        <i className="fa fa-3x fa-heart txt-red"></i>
                        <h5>Made with love</h5>
                        <p>Quisque dignissim, nibh sed ultrices gravida, libero massa maximus velit, a viverra urna.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
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