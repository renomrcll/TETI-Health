import React from "react";

export default class Signin extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            tab:"signup"
 
        };
    }

    
    render(){
        return(
            <div className="sign-in-wrapper">
                <div className="form">
                    <div className="input">
                        <div className="input-text">Email Address</div>
                        <input type="text" placeholder="Email Address" value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                    </div> 
                    <div className="input">
                        <div className="input-text">Password</div>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                    </div>
                    <div className="btn" onClick= {()=> this.props.signIn(this.state.email, this.state.password)}>Sign In</div>
                </div>
            </div>
        );
    }
}