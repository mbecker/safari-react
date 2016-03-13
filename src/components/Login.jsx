import React from 'react'
import { routeActions } from 'react-router-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

import { Content } from './../page'


export const LoginContainer = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        // User authenticated/logged in; forward to '/'

        if (this.props.authenticated) return console.log(this.props.email + " AUTHENTICATED");

        return null;
    },
    componentWillMount: function() {
        this.props.setHeaderImage(false);
    },
    componentDidMount() {

        if (document.body.classList.contains('transparent-nav')) {
            document.body.classList.remove('transparent-nav');
        }
    },
    formLogin(e) {
        e.preventDefault();
        this.props.auth(this.inputEmail.value, this.inputpassword.value);
    },
    render() {
        return (<section>

          
            <div className="code-splitted">


            <div className="code-group col-md-7">
            <h3>Register</h3>
<pre className="line-numbers no-copy language-markup" data-language="markup"><code className=" language-markup"><span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>figure</span><span className="token punctuation">&gt;</span></span>
  <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>img</span> <span className="token attr-name">src</span><span className="token attr-value"><span className="token punctuation">=</span><span className="token punctuation">"</span>assets/img/placeholder.png<span className="token punctuation">"</span></span> <span className="token attr-name">alt</span><span className="token attr-value"><span className="token punctuation">=</span><span className="token punctuation">"</span>image<span className="token punctuation">"</span></span><span className="token punctuation">&gt;</span></span>
  <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>figcaption</span><span className="token punctuation">&gt;</span></span>some description about the image<span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>figcaption</span><span className="token punctuation">&gt;</span></span>
<span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>figure</span><span className="token punctuation">&gt;</span></span><span className="line-numbers-rows"><span></span><span></span><span></span><span></span></span></code></pre>
            </div>

            <div className="form-group col-md-5">
            <h3>Register</h3>
              <form onSubmit={ this.formLogin } class="form-control">
              <input className="input-lg" ref={(ref) => this.inputEmail = ref} type="text" aria-required="true" aria-invalid="false" placeholder="Your email" />
              <br />
              <input ref={(ref) => this.inputpassword = ref} type="password" aria-required="true" aria-invalid="false" placeholder="Your Password" />
              <br />
               <input className="btn btn-outline btn-success" type="submit" value={ !this.props.authenticate ?
                                                           "Login" : "Loading ..." }  />
              </form>
            </div>
          <div className="clearfix"></div></div>
          </section>

        )
    }
})

function mapStateToProps(state, ownProps) {
    return {
        authenticate: state.reducer.getIn(['api', 'user', 'authenticate']),
        authenticated: state.reducer.getIn(['api', 'user', 'authenticated']),
        error: state.reducer.getIn(['api', 'user', 'error']),
        email: state.reducer.getIn(['user', 'email']),
        goSomewhere: (url) => dispatch(routeActions.push(url))
    };
}

export default connect(
    mapStateToProps,
    actions
)(LoginContainer);