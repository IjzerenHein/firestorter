import React, { Component } from "react";
import { observer } from "mobx-react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import "./todo.css";
import { Todo } from "./store";

type PropsType = {
	todo: Todo;
};

class TodoItem extends Component<PropsType, any> {
	private isDeleting: boolean = false;

	public render() {
		const { todo } = this.props;
		const { finished, text } = todo.data;

		console.log("TodoItem.render: ", todo.path, ", text: ", text);
		return (
			<Paper elevation={1}>
				<div className="todo-row">
					<Checkbox
						className="todo-checkbox"
						onChange={this.onPressCheck}
						checked={finished}
					/>
					<TextField
						id={todo.id}
						className="todo-input"
						placeholder={text ? undefined : "What needs to be done?"}
						onChange={this.onTextChange}
						value={text || ""}
					/>
					<IconButton
						className="todo-icon"
						color="secondary"
						onClick={this.onPressDelete}
					>
						<DeleteIcon />
					</IconButton>
				</div>
				<Divider />
			</Paper>
		);
	}

	private onPressDelete = async () => {
		const { todo } = this.props;
		if (this.isDeleting) {
			return;
		}
		this.isDeleting = true;
		try {
			await todo.delete();
			this.isDeleting = false;
		} catch (err) {
			this.isDeleting = false;
		}
	};

	private onPressCheck = async () => {
		const { todo } = this.props;
		await todo.update({
			finished: !todo.data.finished
		});
	};

	private onTextChange = async (event: any) => {
		const { todo } = this.props;
		await todo.update({
			text: event.target.value
		});
	};
}

export default observer(TodoItem);
