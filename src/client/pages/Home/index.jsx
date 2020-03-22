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
