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
        
    }

    componentWillUnmount() {
        document.getElementById('app').removeEventListener('click', this.handleClick);
    }

    handleClick(e) {
        // Listen for clicks on body / div 'app'        
        // If user clicks outside menu and outsode menu hamburger and menu is open, then close the menu
        if (e.target.id != 'navbartoggle' && e.target != this.refs.navigation && hasClass(document.getElementById('body'), 'offcanvas-show')) {
            // remove eventlistener for click on 'app' to close menu with click outside menu
            document.getElementById('app').removeEventListener('click', this.handleClick);
            return toggle(document.getElementById('body'), 'offcanvas-show');
        }

    }

    showResponsiveNav(e) {
        e.preventDefault();
        if (document.body.classList.contains('offcanvas-show')) {
            // Hide Menu; remove eventlistener for click on 'app' to close menu with click outside menu
            document.getElementById('app').removeEventListener('click', this.handleClick);
            
            document.body.style.overflow = 'hidden';
            document.body.classList.remove('offcanvas-show');
        } else {
            // Show Menu; add eventlistener for click on 'app' to close menu with click outside menu
            document.getElementById('app').addEventListener('click', this.handleClick);
            
            document.body.style.overflow = 'visible';
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
                    
                    <a className="navbar-toggle" id="navbartoggle" refs="navbartoggle" onClick={ this.showResponsiveNav.bind(this) }><i className="fa fa-bars nav-toggle" id="navbartoggle"></i></a>
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