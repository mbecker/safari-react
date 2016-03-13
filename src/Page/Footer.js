import React from "react";
import classNames from 'classnames/bind';
import {scrollTo} from './../lib/scrollTo';


export class Footer extends React.Component {

    componentDidMount() {
    }

    scrollUp(e){
      e.preventDefault();
      scrollTo(document.body, 0, 1250);
    }

    render() {
        var footerClass = classNames({
            'site-footer': true,
            'padding10': !this.props.footerBig,
            'padding45': this.props.footerBig
        });

        return (
            <footer className={ footerClass } id="footer2">
              <div className="container">
                <div className="row">
                  <div className="col-md-8 col-sm-6 col-xs-12">
                    <ul className="footer-links">
                      <li><a href="#">About us</a></li>
                      <li><a href="#">Privacy policy</a></li>
                      <li><a href="#">In press</a></li>
                      <li><a href="#">Support</a></li>
                      <li><a href="#">Contact us</a></li>
                    </ul>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <ul className="footer-socials">
                      <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
                      <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
                      <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
                      <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>
                      <li><a className="instagram" href="#"><i className="fa fa-instagram"></i></a></li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8 col-sm-6 col-xs-12">
                    <p className="copyright-text">Copyrights &copy; 2015 All Rights Reserved by <a href="#">ShaMSofT</a>.</p>
                  </div>
                  { this.props.footerBig ? (
                    <div className="col-md-4 col-sm-6 col-xs-12">
                      <p className="back-to-top"><a id="scroll-up" href="#" onClick={ this.scrollUp }>back to top</a></p>
                    </div>
                    ) : null }
                </div>
              </div>
            </footer>
            );
    }
}