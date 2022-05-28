import axios from 'axios';
import React from 'react';
import {BrowserRouter as Router, Route, Switch,Redirect} from 'react-router-dom';
import Auth from './component/Auth/Auth';
import Dashboard from './component/Dashboard/Dashboard';
import store from './store';

class App extends React.Component {

componentDidMount(){
  if (localStorage.getItem('_ID')) {
      axios.get(`/api/users/${localStorage.getItem('_ID')}`).then(res => {
        store.dispatch({
          user: res.data.user,
          type: 'set_user'
        })
      }).catch(er => {
        console.log(er);
      }
      )
    }
}

  render() {
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route exact path="/" component={Auth}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
};

export default App;
