import axios from 'axios';
export class GetService {


  getHost() {
    var HOST = 'http://localhost:3000/';
    return HOST;
  }
  getCalender(month, year) {
    return axios.get(this.getHost() + `getCalender?month=${month}&year=${year}`)
  }

  createEvent(payload) {
    return axios.post(this.getHost() + `events`, payload)
  }

  getAllEvents(month, year) {
    return axios.get(this.getHost() + `events?year=${year}&month=${month}`)
  }

  updateEvents(payload, id) {
    return axios.put(this.getHost() + `events/${id}`, payload)
  }

  removeEvent(id) {
    return axios.delete(this.getHost() + `events/${id}`)
  }

}
