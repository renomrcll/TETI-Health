import React from "react";
import './Dashboard.css';
import Navbar from "../Navbar/Navbar";

export default class Dashboard extends React.Component{
    
    
    render(){
        return(
            <div className="dashboard-wrapper">
                <Navbar/>
            </div>
        );
    }
}