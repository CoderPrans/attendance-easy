import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Fab, Modal, Paper, TextField, Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import {Redirect} from 'react-router-dom';

class Sheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      paddedValues: [],
      students: [],
      modalOpen: false,
      presentStudents: [],
      presentInput: '',
      batchId: '',
    };
    this.listMajors = this.listMajors.bind(this);
    this.markAttendance = this.markAttendance.bind(this);
  }

  componentDidMount() {
    // this.setState({sheetsId: '1D5uF_gHrevGNDLhlgVWK83FAa9Jg09c6f_MCXCIf1ww'});
    if (window.gapi) {
      this.listMajors();
    }
  }

  componentDidUpdate() {
    if (this.state.presentStudents.length > 0) {
      let presentee = [];
      this.state.presentStudents.forEach(roll =>
        presentee.push(
          `${this.state.batchId}${roll.length === 2 ? roll : `0${roll}`}`,
        ),
      );
      this.markAttendance(presentee);
    }
  }

  async listMajors() {
    if (window.gapi.client.sheets) {
      await window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: this.props.sheetId,
          range: `${this.props.sheetName}!A:AR`,
        })
        .then(
          response => {
            console.log(response);
            this.setState({values: response.result.values});
            let batchId = response.result.values[13][1].slice(0, 3);
            let students = this.state.values.filter(
              arr => arr[1] && arr[1].slice(0, 3) === batchId,
            );
            this.setState({batchId});
            console.log('students', students);
            this.setState({students});
            const values = this.state.values.slice();
            // get max columns:
            let max_columns = 0;
            for (var i = 0; i < values.length; i++) {
              if (max_columns < values[i].length) {
                max_columns = values[i].length;
              }
            }
            let paddedValues = [];
            let studentsArr = this.state.students.slice();
            studentsArr.forEach((student, i) => {
              if (student.length < max_columns) {
                let padArr = Array(max_columns - student.length).fill('');
                student = [...student, ...padArr];
                paddedValues.push(student);
              } else {
                paddedValues.push(student);
              }
            });
            this.setState({paddedValues});
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

  async markAttendance(presentee) {
    console.log(presentee);
    // you have the roll no. of the present students.
    // and you have the returned value to edit.
    // on the present day column. add 1 for present
    // and 0 for absent.
    // check if the presentStudents.indexOf(arr[1]) > 0
    // check indices of student rows.
    let values = this.state.values.slice();
    this.state.values.forEach((arr, i) => {
      if (
        arr[1] &&
        presentee.indexOf(arr[1]) >= 0 &&
        arr[1].slice(0, 3) === this.state.batchId
      ) {
        arr.push(1);
      } else if (
        arr[1] &&
        presentee.indexOf(arr[1]) < 0 &&
        arr[1].slice(0, 3) === this.state.batchId
      ) {
        arr.push(0);
      }
    });
    console.log(this.props.sheetId);
    console.log(values);
    if (window.gapi.client.sheets) {
      await window.gapi.client.sheets.spreadsheets.values
        .update({
          spreadsheetId: this.props.sheetId,
          range: `${this.props.sheetName}!A:AR`, // range
          valueInputOption: 'USER_ENTERED', // valueInputOption
          resource: {values}, // body = { values }
        })
        .then(res => console.log(res, 'things done !'));
    }
    if (this.state.presentStudents.length > 0) {
      this.setState({presentStudents: []});
    }
    this.setState({values: []});
    this.listMajors();
  }

  render() {
    return (
      <div className="App" style={{paddingTop: '90px'}}>
        {!window.gapi
          ? (alert('Please set Sheet Id'), <Redirect to="/" />)
          : null}
        <Table>
          {this.state.values.length ? (
            this.state.paddedValues.map((value, i) => {
              return (
                <TableBody>
                  <TableRow>
                    {value.map(str => (
                      <TableCell>{str}&nbsp;</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              );
            })
          ) : this.props.sheetId.length ? (
            <LinearProgress />
          ) : (
            <p style={{fontSize: '35px', padding: '50px'}}>
              Please Set Sheet Id, first !
            </p>
          )}
        </Table>
        <Fab
          color="primary"
          aria-label="edit"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '30px',
          }}
          onClick={() =>
            !this.state.modalOpen ? this.setState({modalOpen: true}) : null
          }>
          <EditIcon />
        </Fab>
        <Modal
          open={this.state.modalOpen}
          onClose={() => this.setState({modalOpen: false})}
          style={{
            width: '280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Paper style={{padding: '30px'}}>
            <p>{new Date().toString().slice(0, 15)}</p>
            <TextField
              label="Present"
              onChange={e => {
                this.setState({presentInput: e.target.value});
              }}
              value={this.state.presentInput}
            />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                let input = this.state.presentInput;
                let presentNumbers = input.split(',');
                this.setState({presentStudents: presentNumbers});
                this.setState({modalOpen: false});
              }}>
              Enter
            </Button>
          </Paper>
        </Modal>
      </div>
    );
  }
}

export default Sheet;
