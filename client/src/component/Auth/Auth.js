import React from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import axios from "axios";
import './Auth.css';
import store from "../../store/index";

export default class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: "signin",
            isLoggedIn : false,
        };
    }
    const  

    signIn = (email,password) => {
        axios.post("/api/users/login", {
            email,
            password
        }).then(res => {
            if (res.data.success) {
                store.dispatch({
                    type: 'login',
                    user: res.data.user,
                    _id: res.data.user._id,
                    token: res.data.token
                });
                console.log(store.getState())
                this.props.history.push("/dashboard");
            }
        }).catch(er=>{
            console.log(er);
        }
        );
    };

    signUp = ({firstName,lastName,email,password,confirmPassword}) => {
        axios.post("/api/users/register", {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }).then(res => {
            console.log(res);
            if (res.data.success) {
                this.setState({tab: "signin"});
            } else {
                // alert(res.data.message);
            }
        }).catch(er=>{
            console.log(er);
        }
        );
    };

    changeTab = () => {
        this.setState({
            tab : this.state.tab === "signup" ? "signin" : "signup"
        })
    };
  
    render() {
        let page = this.state.tab === "signin" ? <Signin signIn = {this.signIn}/> : <Signup signUp = {this.signUp}/>;
    return (
        <div className="auth-wrapper">
            <div className="left-wrapper">
                <div className="img-wrapper">
                    <img src="" alt="logo"/>
                </div>

            </div>
            <div className="right-wrapper">
                <div className="header">
                    Seniority Project
                </div>
                <div className="sub-header">
                    Aplikasi mendeteksi kesehatan mental
                </div>
                {page}
                <div className="new" onClick={this.changeTab}> {this.state.tab==='signin'?'Create new account':'Already have an account'}</div>
            </div>

        </div>
    );
  }
}