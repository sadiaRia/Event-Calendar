import React from "react";
import ReactDOM from "react-dom";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header/index.jsx";
import Footer from "./components/footer/index.jsx";
import Home from "./pages/Home/index.jsx";

class App extends React.Component {
	render() {
		return (
				<Router>
					<Header />
					<Home/>
					<Footer/>
				 	</Router>
			);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
