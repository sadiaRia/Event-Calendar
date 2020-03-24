import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { GetService } from "../../helpers/urls";
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manipulator: 0,
      showForm: false,
      showCalender: true,
      title: '',
      description: '',
      type: '',
      selectedEventDate: '',
      allEventList: [],
      selectedEventId: ''
    }
    this.getService = new GetService();

  }

  componentDidMount() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.setState({
      selectedMonth: month,
      selectedYear: year
    })
    this.getCalender(month, year);
    this.getAllevents(month, year);
  }

  setStateOnFieldChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getCalender = (month, year) => {
    this.getService
      .getCalender(month, year)
      .then(response => {
        this.setState({ calenderData: response.data });
      })
  }

  prev = () => {
    let numberToAdd = this.state.manipulator - 1;
    let nextMonthDate = moment().add(numberToAdd, 'months');
    let nextYearDate = moment().add(numberToAdd, 'years');
    let date = new Date(nextMonthDate);
    let month = date.getMonth();
    let year = date.getFullYear();
    this.setState({
      manipulator: numberToAdd,
      selectedMonth: month,
      selectedYear: year
    })
    this.getCalender(month, year);
    this.getAllevents(month, year);
  }

  next = () => {
    let numberToAdd = this.state.manipulator + 1;
    let nextMonthDate = moment().add(numberToAdd, 'months');
    let nextYearDate = moment().add(numberToAdd, 'years');
    let date = new Date(nextMonthDate);
    let month = date.getMonth();
    let year = date.getFullYear();
    this.setState({
      manipulator: numberToAdd,
      selectedMonth: month,
      selectedYear: year
    })
    this.getCalender(month, year);
    this.getAllevents(month, year);
  }

  addEvent = (date) => {
    const year = this.state.selectedYear,
      month = this.state.selectedMonth;
    let d = new Date(year, month, date);
    this.setState({
      selectedEventDate: moment(d).format("MM-DD-YYYY"),
      showForm: true,
      showCalender: false
    })
  }

  createEvent = () => {
    const eventId = this.state.selectedEventId;
    const payload = {
      title: this.state.title,
      description: this.state.description,
      eventDate: this.state.selectedEventDate,
      eventType: this.state.type
    }
    if (eventId) {
      this.getService
        .updateEvents(payload, eventId)
        .then(response => {
          alert("Event updated");
          this.resetEverything();
        })
    } else {
      this.getService
        .createEvent(payload)
        .then(response => {
          alert("Event Created");
          this.resetEverything();
        })
    }
  }

  resetEverything = () => {
    this.hideForm();
    this.getAllevents(this.state.selectedMonth, this.state.selectedYear);
  }

  getAllevents = (month, year) => {
    this.getService.getAllEvents(month, year)
      .then(response => {
        this.setState({ allEventList: response.data })
      })
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      showCalender: true,
      title: '',
      description: '',
      eventDate: '',
      type: '',
      selectedEventId: ''
    })
  }

  _getEvent = (date) => {
    const year = this.state.selectedYear,
      month = this.state.selectedMonth;
    let d = new Date(year, month, date);
    const eventDate = moment(d).toISOString();
    let index = _.findIndex(this.state.allEventList, { '_id': eventDate })
    console.log(index !== -1 ? this.state.allEventList[index].eventList : null)
    return index !== -1 ? this.state.allEventList[index].eventList : null;
  }

  updateEvent = (list, index) => {
    const event = list[index];
    this.setState({
      selectedEventId: event._id,
      title: event.title,
      description: event.description,
      type: event.eventType,
      selectedEventDate: event.eventDate,
      showForm: true,
      showCalender: false
    })
  }

  removeEvent = () => {
    const eventId = this.state.selectedEventId;
    this.getService.removeEvent(eventId)
      .then(response => {
        this.resetEverything();
      })
  }

  renderEvents(data) {
    const list = this._getEvent(data);
    return (list.map((val, index) =>
      <div style={{textAlign: 'center' }}><a href='#' onClick={() => this.updateEvent(list, index)}>{val.title}</a></div>
    ))
  }


  render() {
    const { calenderData, selectedMonth, selectedYear, title, type, description, selectedEventDate, showCalender, showForm, selectedEventId } = this.state;
    return (
      <div class="container">
        <br/>
        {showCalender && <div>
          <div style={{ background: '#001a66', color: 'white' }}>
            <ul class="nav justify-content-center">
              <li class="nav-item">
                <a href='#' onClick={() => this.prev()} style={{ fontSize: '26px', color: 'white' }}> {` < `}</a>&nbsp;&nbsp;
           </li>
              <li class="nav-item">
                <h1 style={{ textAlign: 'center' }}>{months[selectedMonth]} {selectedYear}</h1>
              </li>&nbsp;&nbsp;&nbsp;
          <li class="nav-item">
                <a href='#' onClick={() => this.next()} style={{ fontSize: '26px', color: 'white' }}> {` > `}</a>
              </li>
            </ul>
          </div>
          <div>
            <table class="table table-bordered">
              <thead>
                <tr>
                  {days.map((day) =>
                    <th scope="col" style={{ textAlign: 'center' }}>{day}</th>)}

                </tr>
              </thead>
              <tbody>
                {!_.isEmpty(calenderData) && calenderData.map((data) =>

                  <tr style={{ height: '200px' }}>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.sun && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.sun)}>{data.sun}</a>}
                      {this._getEvent(data.sun) !== null && this.renderEvents(data.sun)}
                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.mon && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.mon)}>{data.mon}</a>}
                      {this._getEvent(data.mon) !== null && this.renderEvents(data.mon)}
                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.tue && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.tue)}>{data.tue}</a>}
                      {this._getEvent(data.tue) !== null && this.renderEvents(data.tue)}


                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.wed && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.wed)}>{data.wed}</a>}
                      {this._getEvent(data.wed) !== null && this.renderEvents(data.wed)
                      }
                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.thu && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.thu)}>{data.thu}</a>}
                      {this._getEvent(data.thu) !== null && this.renderEvents(data.thu)}
                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.fri && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.fri)}>{data.fri}</a>}
                      {this._getEvent(data.fri) !== null && this.renderEvents(data.fri)}
                    </td>
                    <td style={{ textAlign: 'center', width: '100px' }} >
                      {data.sat && <a style={{ color: 'black' }} href='#' onClick={() => this.addEvent(data.sat)}>{data.sat}</a>}
                      {this._getEvent(data.sat) !== null && this.renderEvents(data.sat)}
                    </td>

                  </tr>)}
              </tbody>
            </table>

          </div>
        </div>}
        {showForm && <form>
          <div class="form-group">
            <label for="exampleFormControlInput1">Selectetd Date</label>
            <input disabled={true} type="text" value={selectedEventDate || ''} class="form-control" id="exampleFormControlInput1" />
          </div>

          <div class="form-group">
            <label for="exampleFormControlInput1">Title</label>
            <input type="text" name="title" value={title || ''} class="form-control" id="exampleFormControlInput1" placeholder="Enter Title" onChange={this.setStateOnFieldChange} />
          </div>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Type</label>
            <select class="form-control" name="type" value={type || ''} id="exampleFormControlSelect1" onChange={this.setStateOnFieldChange}>
              <option value="">Please Select</option>

              <option value="Meeting">Meeting</option>
              <option value="Appointment">Appointment</option>
              <option value="Birthday"> Birthday</option>
              <option value="Class"> Class</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Description</label>
            <textarea name="description" value={description || ''} class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={this.setStateOnFieldChange}></textarea>
          </div>
          <div>
            <button onClick={() => this.createEvent()} type="button" class="btn btn-success">Submit</button>&nbsp;&nbsp;
          <button onClick={() => this.hideForm()} type="button" class="btn btn-warning">Cancel</button>&nbsp;&nbsp;
           {selectedEventId && <button type="button" onClick={() => this.removeEvent()} class="btn btn-danger">Delete</button>}

          </div>
        </form>}

      </div>
    );
  }
}
export default Home;
