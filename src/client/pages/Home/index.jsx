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
    this.getAllevents();
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
    this._getEvent(6);
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

  resetEverything = () =>{
    this.hideForm();
    this.getAllevents();
}

  getAllevents = () => {
    this.getService.getAllEvents()
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

  renderEvents(data) {
    const list = this._getEvent(data);
    return (list.map((val, index) =>
      <p><a href='#' onClick={() => this.updateEvent(list, index)}>{val.title}</a></p>
    ))
  }


  render() {
    const { calenderData, selectedMonth, selectedYear, title, type, description, selectedEventDate, showCalender, showForm } = this.state;
    return (
      <div class="container">
        {showCalender && <div>
          <div style={{ background: '#001a66', color: 'white' }}>
            <ul class="nav justify-content-center">
              <li class="nav-item">
                <button onClick={() => this.prev()} style={{ fontSize: '26px' }}> {` < `}</button>&nbsp;&nbsp;
           </li>
              <li class="nav-item">
                <h1 style={{ textAlign: 'center' }}>{months[selectedMonth]} {selectedYear}</h1>
              </li>&nbsp;&nbsp;&nbsp;
          <li class="nav-item">
                <button onClick={() => this.next()} style={{ fontSize: '26px' }}> {` > `}</button>
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
                    <td style={{ textAlign: 'center' }}>{data.sun}</td>
                    <td style={{ textAlign: 'center' }}>{data.mon}</td>
                    <td style={{ textAlign: 'center' }}>{data.tue}</td>
                    <td style={{ textAlign: 'center' }}>
                      {data.wed}
                      <button onClick={() => this.addEvent(data.wed)}>+</button>
                      {this._getEvent(data.wed) !== null && this.renderEvents(data.wed)
                      }
                    </td>
                    <td style={{ textAlign: 'center' }}>{data.thu}</td>
                    <td style={{ textAlign: 'center' }}>{data.fri}</td>
                    <td style={{ textAlign: 'center' }}>{data.sat}</td>

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
          <button onClick={() => this.hideForm()} type="button" class="btn btn-warning">Cancel</button>
          </div>
        </form>}

      </div>
    );
  }
}
export default Home;
