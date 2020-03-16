import React from "react";
import ReactDOM from "react-dom";

import { HashRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
	render() {
		return (
			<h1>hello world</h1>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
