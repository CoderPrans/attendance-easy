import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {Redirect} from 'react-router-dom';

class Sheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
    this.listMajors = this.listMajors.bind(this);
  }

  componentDidMount() {
    // this.setState({sheetsId: '1D5uF_gHrevGNDLhlgVWK83FAa9Jg09c6f_MCXCIf1ww'});
    if (window.gapi) {
      this.listMajors();
    }
  }

  listMajors() {
    if (window.gapi.client.sheets) {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: this.props.sheetId,
          range: `${this.props.sheetName}!A:AR`,
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
        <hr />
        {!window.gapi
          ? (alert('Please set Sheet Id'), <Redirect to="/greet/" />)
          : null}
        <Table>
          {this.state.values.length ? (
            paddedValues.map((value, i) => {
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
          ) : this.props.sheetId.length ? (
            <p>Loading.... !!!</p>
          ) : (
            <p>Please Set Sheet Id, first !</p>
          )}
        </Table>
      </div>
    );
  }
}

export default Sheet;
