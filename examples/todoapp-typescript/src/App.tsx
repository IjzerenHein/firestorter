import * as React from "react";
import Button from "@material-ui/core/Button";
import ContentAddIcon from "@material-ui/icons/Add";
import Todos from "./Todos";
import { todos } from "./store";
import "./app.css";

class App extends React.Component {
	public render() {
		return (
			<div className="app-container">
				<div className="app-header">
					<div className="app-header-row">
						<img src={require("./logo.jpg")} alt="logo" />
						<h1>
							<a href="https://github.com/IjzerenHein/firestorter">
								Firestorter
							</a>{" "}
							Todo App
						</h1>
					</div>
					<h3>Firestore & React, using MobX</h3>
				</div>
				<Todos />
				<div className="app-add">
					<Button variant="contained" onClick={this.onPressAdd}>
						<ContentAddIcon />
					</Button>
				</div>
			</div>
		);
	}

	private onPressAdd = async () => {
		try {
			await todos.add({
				finished: false,
				text: ""
			});
		} catch (err) {
			// TODO
		}
	};
}

export default App;
