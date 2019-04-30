import React, {Component} from 'react';
import './App.css';

import Sheet from './components/Sheet.js';
import Greet from './components/Greet.js';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {AppBar, Toolbar, Button} from '@material-ui/core';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gapiLoaded: false,
      isSignedIn: false,
      sheetId: '',
      sheetName: '',
      values: [],
    };
    this.loadSheetsApi = this.loadSheetsApi.bind(this);
    this.setAuthRight = this.setAuthRight.bind(this);
  }

  loadSheetsApi() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      console.log('gapi ready ...');
      window.gapi.load(
        'client:auth2',
        () => {
          window.gapi.client
            .init({
              apiKey: 'AIzaSyCVW21nzHqoIFXHQlEapyTy-L1xvOiqyRE',
              clientId:
                '621837602751-16img4825af7u2shnu1pt4nl0sb4duk1.apps.googleusercontent.com',
              discoveryDocs: [
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
              ],
              scope: 'https://www.googleapis.com/auth/spreadsheets',
            })
            .then(() => {
              console.log('hey, gapi is initialized and ready to use.');
              this.setState({gapiLoaded: true});
              this.setAuthRight();
              //window.gapi.client.sheets
              // ? null //this.listMajors()
              console.log('waiting');
            });
        },
        error => console.log(error),
      );
    };
    document.body.appendChild(script);
    console.log('take the script .', script);
  }

  setAuthRight() {
    if (this.state.gapiLoaded) {
      if (
        window.gapi.auth2.getAuthInstance().isSignedIn.get() !==
        this.state.isSignedIn
      ) {
        console.log('toggling . .');
        this.setState({
          isSignedIn: window.gapi.auth2.getAuthInstance().isSignedIn.get(),
        });
      }
    }
  }

  componentDidUpdate() {
    console.log('did update ... . .');
    this.setAuthRight();
  }

  componentDidMount() {
    // this.setState({sheetsId: '1D5uF_gHrevGNDLhlgVWK83FAa9Jg09c6f_MCXCIf1ww'});
    this.loadSheetsApi();
  }

  async toggleSignedIn() {
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log('Signing out...');
      await window.gapi.auth2.getAuthInstance().signOut();
      this.setAuthRight();
    } else {
      console.log('Signing in...');
      await window.gapi.auth2.getAuthInstance().signIn();
      this.setAuthRight();
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <AppBar style={{backgroundColor: '#2196F3'}}>
            <Toolbar className="toolbar">
              <Link to="/" style={{textDecoration: 'none'}}>
                <Button
                  variant="contained"
                  style={{margin: '0 12px', backgroundColor: 'white'}}>
                  <span style={{color: '#727272'}}>Set Sheet</span>
                </Button>
              </Link>
              <Link
                to="/sheet/"
                style={{
                  textDecoration: 'none',
                }}>
                <Button
                  variant="contained"
                  color="default"
                  style={{margin: '0 12px', backgroundColor: 'white'}}>
                  <span style={{color: '#727272'}}>Show Sheet</span>
                </Button>
              </Link>
              <Button
                variant="contained"
                color="default"
                style={{margin: '0 12px', backgroundColor: 'white'}}
                onClick={() => {
                  this.toggleSignedIn();
                }}>
                <span
                  style={{
                    color: '#727272',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}>
                  {!this.state.isSignedIn ? 'Sign In' : 'Sign Out'}
                </span>
              </Button>
            </Toolbar>
          </AppBar>
          <Route
            exact
            path="/"
            render={() => (
              <Greet
                sheetId={id => this.setState({sheetId: id})}
                sheetName={name => this.setState({sheetName: name})}
                isSignedIn={this.state.isSignedIn}
              />
            )}
          />
          <Route
            exact
            path="/sheet/"
            render={() => (
              <Sheet
                sheetId={this.state.sheetId}
                sheetName={this.state.sheetName}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
