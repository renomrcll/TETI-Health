import React from "react";
import store from "../../store/index";
import './Navbar.css';
import {NavLink} from "react-router-dom";



export default class Navbar extends React.Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render(){
        if(store.getState().user){
            console.log(store.getState().user);
            return (
                <div className="navbar-wrapper">
                        <div className="left">
                            TETI-HEALTH
                        </div>
                        <div className="right">
                            <div className="user">
                                <div className="avatar" style={{backgroundImage: store.getState().user.avatar || 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg' }}></div>  
                                <div className="name">{store.getState().user.firstName+` `+store.getState().user.lastName}</div>
                                <div className="links">
                                    <NavLink to="/dashboard" className="link">Dashboard</NavLink>
                                    <NavLink to="/account" className="link">Account</NavLink>
                                    <NavLink to="/my-result" className="link">Result</NavLink>
                                    <NavLink to="/quiz " className="link">Quiz</NavLink>
                                </div>
                            </div>
                        </div>
                </div>
            )
        
        }else {
            return(
                <div>Loading</div>
            )
        }

            
    }
}