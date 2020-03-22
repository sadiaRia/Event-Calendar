import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {

  render() {
    return (
      <footer style={{ backgroundColor: '#F8F9FA' }} className="page-footer font-small special-color-dark pt-4">

        <div className="container">

          <ul className="list-unstyled list-inline text-center py-2">
            <li className="list-inline-item">
              <h5 className="mb-1">Set your all Event Details</h5>
            </li>
          </ul>
        </div>
        <div className="footer-copyright text-center py-3">© 2020 Copyright:
          <a href=""> XYzZ</a>
        </div>

      </footer>
    );
  }
}
export default Footer;
