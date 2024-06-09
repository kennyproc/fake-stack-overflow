// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import axios from 'axios';
import React from 'react';
import Model from './models/model.js';
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'

axios.defaults.withCredentials = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newModel: new Model(),
      rendered: false,
      user: null
    }
    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(user) {
    this.setState({user: user});
  }

  componentDidMount() {
    axios.get('http://localhost:8000',)
      .then(res => {
        const data = res.data.model.data;
        const newModel = this.state.newModel;
        newModel.data = data;
        const rendered = true;
        const user = res.data.user[0];
        this.setState({newModel, rendered, user});
        //console.log(newModel);
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <section className="fakeso">
        <FakeStackOverflow model={this.state.newModel} rendered={this.state.rendered} user={this.state.user} setUser={this.updateUser} />
      </section>
    );
  }
}
