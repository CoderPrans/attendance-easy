import React, {Component} from 'react';
import './App.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };

    this.loadSheetsApi = this.loadSheetsApi.bind(this);
    this.listMajors = this.listMajors.bind(this);
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
              window.gapi.client.sheets
                ? this.listMajors()
                : console.log('waiting');
            });
        },
        error => console.log(error),
      );
    };
    document.body.appendChild(script);
    console.log('take the script .', script);
  }

  listMajors() {
    if (window.gapi.client.sheets) {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: '1D5uF_gHrevGNDLhlgVWK83FAa9Jg09c6f_MCXCIf1ww',
          range: 'F15!A:AR',
        })
        .then(
          response => {
            console.log(response);
            this.setState({values: response.result.values});
          },
          response => {
            console.log(response);
          },
        );
      console.log(window.gapi);
    } else {
      console.log("sheets havn't arrived yet");
    }
  }

  componentDidMount() {
    this.loadSheetsApi();
  }

  render() {
    console.log(this.state.values);
    const values = this.state.values.slice();
    // get max columns:
    let max_columns = 0;
    for (var i = 0; i < values.length; i++) {
      if (max_columns < values[i].length) {
        max_columns = values[i].length;
      }
    }
    let paddedValues = [];
    values.forEach((value, i) => {
      if (value.length < max_columns) {
        let padArr = Array(max_columns - value.length).fill('');
        value = [...value, ...padArr];
        paddedValues.push(value);
      } else {
        paddedValues.push(value);
      }
    });
    console.log(paddedValues);
    return (
      <div className="App">
        <Table>
          {this.state.values.length
            ? paddedValues.map((value, i) => {
                return i < 11 && i > 8 ? (
                  <TableHead>
                    <TableRow>
                      {value.map(str => (
                        <TableCell>{str}&nbsp;</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                ) : i > 8 ? (
                  <TableBody>
                    <TableRow>
                      {value.map(str => (
                        <TableCell>{str}&nbsp;</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                ) : null;
              })
            : null}
        </Table>
      </div>
    );
  }
}

export default App;
