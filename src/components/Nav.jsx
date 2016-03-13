import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { NavBar, NavItem } from './../page'
import activeComponent from 'react-router-active-component'
var NavLink = activeComponent(NavItem);

const NavPage = React.createClass({
    mixins: [PureRenderMixin],
    render() {
        return (
            <NavBar>
              <NavLink to="/" activeClassName="current-menu-item" className="menu-item">Home</NavLink>
              <NavLink to="/parks" activeClassName="current-menu-item" className="menu-item">Parks</NavLink>
              <NavLink to="/map" activeClassName="current-menu-item" className="menu-item">Map</NavLink>
              <NavLink to="/mapbox" activeClassName="current-menu-item" className="menu-item">Mapbox</NavLink>
              { this.props.authenticated ? (
                <NavLink to="/logout" activeClassName="current-menu-item" className="menu-item">Logout</NavLink>                
                ) : (
                <NavLink to="/login" activeClassName="current-menu-item" className="menu-item">Login</NavLink>
                ) }
            </NavBar>
        )
    }
})

export default NavPage