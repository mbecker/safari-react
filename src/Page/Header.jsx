import React from "react";

export class Header extends React.Component {

    render() {

        return (
            <header className="site-header" id="header2">
              { this.props.children }
              { this.props.headerCoverImage ? (
                <div className="header-image bg-img-index-header">
                  <div className="container">
                    <h1><strong>TheGuide,</strong> Online Documentation</h1>
                    <h5>An online documentation template which can help you rapidly develop your next software's documentation It has a lot of useful components to reduce the burden of writing a documentation for your next product.</h5>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <p>
                      <a className="btn btn-danger btn-lg" href="#sec-features" style={ {    marginRight: 12} }>Learn More</a>
                      <a className="btn btn-dark btn-outline btn-lg hidden-xs" href="getting-started.html">Get start</a>
                    </p>
                  </div>
                </div>
                ) : null }
            </header>
            );
    }
}