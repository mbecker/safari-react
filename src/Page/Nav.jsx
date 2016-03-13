import React from "react";
import { Link } from 'react-router'
import { hasClass, toggle } from './../lib/helper';

export class Nav extends React.Component {


    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.transparentNav = false;
    };

    componentDidMount() {
        document.getElementById('app').addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.getElementById('app').removeEventListener('click', this.handleClick);
    }

    handleClick(e) {
        // Listen for clicks on body / div 'app'
        // If user clicks outside menu and menu is open, then close the menu
        if (e.target != this.refs.navigation && hasClass(document.getElementById('body'), 'offcanvas-show')) {
            toggle(document.getElementById('body'), 'offcanvas-show');
        }
    }

    showResponsiveNav(e) {
        e.preventDefault();
        if (document.body.classList.contains('offcanvas-show')) {
            document.body.style.oberflow = 'hidden';
            document.body.classList.remove('offcanvas-show');
        } else {
            document.body.style.oberflow = 'visible';
            document.body.classList.add('offcanvas-show');
        }

        // if (document.body.classList.contains('transparent-nav')) {
        //     this.transparentNav = true;
        //     document.body.classList.remove('transparent-nav');
        // }

        // if (this.transparentNav && !document.body.classList.contains('offcanvas-show')) {
        //     console.log("add transparent to nav ...");
        //     document.body.classList.add('transparent-nav');
        // }
    };

    render() {
        return (
            <nav className="site-navigation">
              <div className="container">
                <div className="logo">
                  <a className="logo-default" href="index.html"><img src="img/logo.png" alt="logo" /></a>
                  <a className="logo-transparent" href="index.html"></a>
                </div>
                <a className="navbar-toggle" refs="navbartoggle" onClick={ this.showResponsiveNav.bind(this) }><i className="fa fa-bars"></i></a>
                <ul className="nav-menu" ref="navigation">
                  { this.props.children }
                </ul>
              </div>
            </nav>
            );
    }
}


export class NavItem extends React.Component {
    hideSideNav() {
        document.body.classList.remove('offcanvas-show');
    }
    render() {
        return (
            <li>
              <Link {...this.props} onClick={ this.hideSideNav }>
              { this.props.children }
              </Link>
            </li>
            );
    }
}