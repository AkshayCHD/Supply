import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { color: 'green' };
  }
  componentDidMount() {
    setInterval(() => {
      axios.get('/nothing?key=%5B%221%22%5D').then((result) => {
        this.setState({
          color: result.data.critical ? 'red' : 'green'
        })
      })
    }, 10000);
  }
  render() {
    return (
      <div className="App">
        <button 
          onClick={this.handleClick} 
          style={{backgroundColor:this.state.color, width: 400, height: 400}}>Button</button>
      </div>
    );
  }
}

export default App;