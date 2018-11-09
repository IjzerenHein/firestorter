import React, { Component } from "react";
import { observer } from "mobx-react";
import { todos } from "./store";
import FlipMove from "react-flip-move";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import TodoItem from "./TodoItem";
import "./todos.css";

class Todos extends Component {
	private state = {
		disabled: false
	};

	public render() {
		const { disabled } = this.state;
		if (disabled) {
			console.log("Todos.render, disabled");
			return (
				<div>
					<div className="todos-header">
						<div />
						<Checkbox
							label="Disable observe"
							checked={disabled}
							onCheck={this.onCheckDisable}
						/>
					</div>
				</div>
			);
		}
		const { docs, query } = todos;
		const children = docs.map(todo => <TodoItem key={todo.id} todo={todo} />);
		const { isLoading } = todos;
		console.log("Todos.render, isLoading: ", isLoading);
		return (
			<div className="todos-container">
				<div className="todos-header">
					<Checkbox
						label="Hide finished"
						checked={query ? true : false}
						onCheck={this.onCheckShowOnlyUnfinished}
					/>
					{/* <Checkbox
					label='Disable observe'
					checked={disabled}
					onCheck={this.onCheckDisable} />*/}
				</div>
				<div className="mobile-margins todos-content">
					<FlipMove enterAnimation="fade" leaveAnimation="fade">
						{children}
					</FlipMove>
				</div>
				{isLoading ? (
					<div className="todos-loader">
						<CircularProgress />
					</div>
				) : (
					undefined
				)}
			</div>
		);
	}

	private onCheckShowOnlyUnfinished = () => {
		if (todos.query) {
			todos.query = undefined;
		} else {
			todos.query = todos.ref.where("finished", "==", false).limit(10);
		}
	};

	private onCheckDisable = () => {
		this.setState({
			disabled: !this.state.disabled
		});
	};
}

export default observer(Todos);
