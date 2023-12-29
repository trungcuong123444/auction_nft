import React from 'react'
import CommonSection from '../components/ui/Common-section/CommonSection'
import "../styles/login.css"
import "../styles/login-form.css"
import "../styles/responsive.css"
const Login = () => {
    return (
        <> <CommonSection title="Login" />
            <section className="tf-login tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-1">
                                Login To NFTs
                            </h2>
                            <div className="flat-form box-login-social">
                                <div className="box-title-login">
                                    <h5>Login with social</h5>
                                </div>
                                <ul >
                                    <li >
                                        <a href="https://demothemesflat.com/axies/login.html#" className="sc-button style-2 fl-button pri-3" style={{ color: "white" }}>
                                            <i className="icon-fl-google-2" />
                                            <span style={{ color: "white " }}>Google</span>
                                        </a>
                                    </li>
                                    <li >
                                        <a href="https://demothemesflat.com/axies/login.html#" className="sc-button style-2 fl-button pri-3" >
                                            <i className="icon-fl-facebook" />
                                            <span style={{ color: "white " }}>Facebook</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Or login with email</h5>
                                </div>
                                <div className="form-inner">
                                    <form action="https://demothemesflat.com/axies/login.html#" id="contactform" noValidate="novalidate">
                                        <input id="name" name="name" tabIndex={1} required type="text" placeholder="Your Full Name" />
                                        <input id="email" name="email" tabIndex={2} type="email" placeholder="Your Email Address" required />
                                        <div className="row-form style-1">
                                            <label>Remember me
                                                <input type="checkbox" />
                                                <span className="btn-checkbox" />
                                            </label>
                                            <a href="https://demothemesflat.com/axies/login.html#" className="forgot-pass">Forgot Password ?</a>
                                        </div>
                                        <button className="submit" style={{ backgroundColor: 'transparent', border: "2px solid #fff", color: "#fff", borderRadius: 30 }}>Login</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

// export default Login