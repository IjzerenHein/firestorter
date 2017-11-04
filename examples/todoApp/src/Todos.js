import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {todos} from './store';
import FlipMove from 'react-flip-move';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import TodoItem from './TodoItem';

const styles = {
	loader: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	header: {
		padding: 16
	}
};

const Todos = observer(class Todos extends Component {
	render() {
		const {docs, fetching, query} = todos;
		console.log('Todos.render, fetching: ', fetching);
		return (
			<div>
				<div style={styles.header}>
					<Checkbox
						label='Hide finished'
						checked={query ? true : false}
						onCheck={this.onCheckShowOnlyUnfinished} />
				</div>
				<FlipMove enterAnimation='fade' leaveAnimation='fade'>
					{docs.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
				</FlipMove>
				{fetching ? <div style={styles.loader}><CircularProgress /></div> : undefined}
			</div>
		);
	}

	onCheckShowOnlyUnfinished = () => {
		if (todos.query) {
			todos.query = undefined;
		}
		else {
			todos.query = todos.ref.where('finished', '==', false).limit(10);
		}
	};
});

export default Todos;
