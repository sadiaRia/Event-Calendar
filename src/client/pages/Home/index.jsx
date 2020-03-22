import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manipulator: 0,
    }
  }

  componentDidMount() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    this.setState({
      selectedMonth: month,
      selectedYear: year
    })
    this.getDaysInMonth(month, year)
  }

  getDaysInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    alert(date);
    let allDays = [];
    while (date.getMonth() === month) {
      allDays.push({
        date: moment(date).format("DD"),
        day: moment(date).format("ddd")
      });
      date.setDate(date.getDate() + 1);
    }
    this.setState({ allDays: allDays });
    // alert(JSON.stringify(allDays));
    this._formatdate(allDays)
  }

  _formatdate = (allDays) => {
    let calenderData = [];
    let calenderObj = {
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: ''
    };
    const d = new Date();
    const sday = d.getDay();
    _.forEach(allDays, (allday) => {
      calenderObj[`${allday.day.toLowerCase()}`] = allday.date;
      if (allday.day.toLowerCase() === 'sat') {
        calenderData.push(calenderObj);
        calenderObj = {
          sun: '',
          mon: '',
          tue: '',
          wed: '',
          thu: '',
          fri: '',
          sat: ''

        };
      }

    })
    calenderData.push(calenderObj);

    this.setState({ calenderData: calenderData });

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
    this.getDaysInMonth(month, year);

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
    this.getDaysInMonth(month, year);
  }

  render() {
    const { calenderData, selectedMonth, selectedYear } = this.state;
    return (
      <div class="container">
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
                  <td style={{ textAlign: 'center' }}>{data.wed}</td>
                  <td style={{ textAlign: 'center' }}>{data.thu}</td>
                  <td style={{ textAlign: 'center' }}>{data.fri}</td>
                  <td style={{ textAlign: 'center' }}>{data.sat}</td>

                </tr>)}
            </tbody>
          </table>

        </div>
      </div>
    );
  }
}
export default Home;
