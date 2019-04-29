import React, {Component} from 'react';
import './App.css';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

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
            <Toolbar style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Link
                to="/greet/"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                }}>
                <Button variant="contained" style={{margin: '0 12px'}}>
                  Greet Me
                </Button>
              </Link>
              <Link
                to="/sheet/"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                }}>
                <Button
                  variant="contained"
                  color="default"
                  style={{margin: '0 12px'}}>
                  Show Sheet
                </Button>
              </Link>
              <Button
                variant="contained"
                color="default"
                style={{margin: '0 12px'}}
                onClick={() => {
                  this.toggleSignedIn();
                }}>
                <span
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'black',
                  }}>
                  {!this.state.isSignedIn ? 'Sign In' : 'Sign Out'}
                </span>
              </Button>
            </Toolbar>
          </AppBar>
          <Route
            exact
            path="/greet/"
            render={() => (
              <Greet
                sheetId={id => this.setState({sheetId: id})}
                sheetName={name => this.setState({sheetName: name})}
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
