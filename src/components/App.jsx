import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

import { Header, Content, Footer } from './../Page'
import { Nav, NavItem } from './../Page'

const AppPage = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        return {
            name: 'safari.digital'
        }
    },
    componentWillMount() {
    },
    componentDidMount() {

        window.addEventListener('scroll', this.handleScroll);
    },
    handleScroll(e) {
        let scrollTop = event.srcElement.body.scrollTop;
        if (scrollTop > 0) {
            document.body.classList.add('body-scrolled');
        } else {
            document.body.classList.remove('body-scrolled');
        }
    },
    mixins: [PureRenderMixin],
    render() {

        return (
            <div>
              { /* Wrap whole page */ }
              <Header headerCoverImage={ this.props.headerCoverImage }>
                <Nav>
                  <NavItem to="/" activeClassName="active">Home</NavItem>
                  <NavItem to="/parks" activeClassName="active">Parks</NavItem>
                  <NavItem to="/map" activeClassName="active">Mapbox</NavItem>
                  { this.props.authenticated ? (
                    <NavItem to="/logout" className="menu-highlighted">Account</NavItem>
                    ) : (
                    <NavItem to="/login" className="menu-highlighted">Login / Register</NavItem>
                    ) }
                </Nav>
              </Header>
              <main id="maincontent">
                { this.props.children }
              </main>
              { this.props.footerVisible ? (
                <Footer footerBig={ this.props.footerBig } />
                ) : null }
            </div>
        )
    }
});

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
)(AppPage);