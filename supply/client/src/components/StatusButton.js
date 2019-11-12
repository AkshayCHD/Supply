import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class StatusButton extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { color: 'green' };
  }
  componentDidMount() {
    // setInterval(() => {
    //   axios.get('/nothing?key=%5B%221%22%5D').then((result) => {
    //     this.setState({
    //       color: result.data.critical ? 'red' : 'green'
    //     })
    //   })
    // }, 10000);
  }
  render() {
    return (
        <Button size = "huge" label = {this.props.text} color = {this.props.status.color} loading = {this.props.status.loading}>
        </Button>
    );
  }
}

export default StatusButton;