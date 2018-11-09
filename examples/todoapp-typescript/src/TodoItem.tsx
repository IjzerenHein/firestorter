import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import "./todo.css";

class TodoItem extends Component {
	public static propTypes = {
		todo: PropTypes.any
	};

	public render() {
		const { todo } = this.props;
		const { finished, text } = todo.data;

		console.log("TodoItem.render: ", todo.path, ", text: ", text);
		return (
			<Paper zDepth={1}>
				<div className="todo-row">
					<Checkbox
						className="todo-checkbox"
						onCheck={this.onPressCheck}
						checked={finished}
					/>
					<TextField
						id={todo.id}
						className="todo-input"
						underlineShow={false}
						hintText={text ? undefined : "What needs to be done?"}
						onChange={this.onTextChange}
						value={text || ""}
					/>
					<IconButton
						className="todo-icon"
						secondary
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
		if (this._deleting) {
			return;
		}
		this._deleting = true;
		try {
			await todo.delete();
			this._deleting = false;
		} catch (err) {
			this._deleting = false;
		}
	};

	private onPressCheck = async () => {
		const { todo } = this.props;
		await todo.update({
			finished: !todo.data.finished
		});
	};

	private onTextChange = async (event, newValue) => {
		const { todo } = this.props;
		await todo.update({
			text: newValue
		});
	};
}

export default observer(TodoItem);
