import axios from 'axios';
export class GetService {


  getHost() {
    var HOST = 'http://localhost:3000/';
    return HOST;
  }
  getCalender(month, year) {
    return axios.get(this.getHost() + `getCalender?month=${month}&year=${year}`)
  }
}
