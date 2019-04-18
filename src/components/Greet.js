import React, {Component} from 'react';

import {BrowserRouter as Router} from 'react-router-dom';
import {Button, TextField, Paper} from '@material-ui/core';

class Greet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheetId: '',
      sheetName: '',
      isSaved: false,
    };
  }

  render() {
    return (
      <Router>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Paper
            style={{
              width: '200px',
              padding: '20px',
            }}>
            <TextField
              label="Sheet Id"
              onChange={e => {
                this.setState({sheetId: e.target.value});
              }}
              value={this.state.sheetId}
            />
            <br />
            <br />
            <TextField
              label="Sheet Name"
              onChange={e => {
                this.setState({sheetName: e.target.value});
              }}
              value={this.state.sheetName}
            />
            <br />
            <br />
            <Button
              variant="outlined"
              color="primary"
              onClick={async () => {
                if (this.state.sheetId.length) {
                  await this.props.sheetId(this.state.sheetId);
                  await this.props.sheetName(this.state.sheetName);
                  alert('Saved !');
                  this.setState({isSaved: true});
                } else {
                  alert('Sheet Id !!!');
                }
              }}>
              Save id
            </Button>
          </Paper>
        </div>
      </Router>
    );
  }
}

export default Greet;
