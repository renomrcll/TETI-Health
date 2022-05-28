import React from "react";

export default class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firstName:"",
            lastName:"",
            email:"",
            password:""
        };
    }
    
    render() {
        return (
            <div className="sign-up-wrapper">
                <div className="form">
                    <div className="input">
                        <div className="input-text">First Name</div>
                        <input type="text" placeholder="First Name" value={this.state.firstName} onChange={e => this.setState({firstName: e.target.value})}/>
                    </div> 
                    <div className="input">
                        <div className="input-text">Last Name</div>
                        <input type="text" placeholder="Last Name" value={this.state.lastName} onChange={e => this.setState({lastName: e.target.value})}/>
                    </div>
                    <div className="input">
                        <div className="input-text">Email Address</div>
                        <input type="text" placeholder="Email Address" value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                    </div> 
                    <div className="input">
                        <div className="input-text">Password</div>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
                    </div>
                    <div className="input">
                        <div className="input-text">Confirm Password</div>
                        <input type="password" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={e => this.setState({confirmPassword: e.target.value})}/>
                    </div>
                    <div className="btn" id="btn-signup" onClick= {()=> this.props.signUp({...this.state})}>Sign Up</div>
                </div>
            </div>
        );
    }
}
