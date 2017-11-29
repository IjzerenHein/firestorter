import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {todos} from './store';
import FlipMove from 'react-flip-move';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import TodoItem from './TodoItem';

const styles = {
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		position: 'relative'
	},
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
		padding: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottom: '1px solid #DDD'
	},
	content: {
		flex: 1,
		overflowY: 'scroll'
	}
};

const Todos = observer(class Todos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disabled: false
		};
	}

	render() {
		const {disabled} = this.state;
		if (disabled) {
			console.log('Todos.render, disabled');
			return (
				<div>
					<div style={styles.header}>
						<div />
						<Checkbox
							label='Disable observe'
							checked={disabled}
							onCheck={this.onCheckDisable} />
					</div>
				</div>
			);
		}
		const {docs, query} = todos;
		const children = docs.map((todo) => <TodoItem key={todo.id} todo={todo} />);
		const {fetching} = todos;
		console.log('Todos.render, fetching: ', fetching);
		return (
			<div style={styles.container}>
				<div style={styles.header}>
					<Checkbox
						label='Hide finished'
						checked={query ? true : false}
						onCheck={this.onCheckShowOnlyUnfinished} />
					{/* <Checkbox
						label='Disable observe'
						checked={disabled}
						onCheck={this.onCheckDisable} />*/}
				</div>
				<div style={styles.content} className='mobile-margins'>
					<FlipMove enterAnimation='fade' leaveAnimation='fade'>
						{children}
					</FlipMove>
				</div>
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

	onCheckDisable = () => {
		this.setState({
			disabled: !this.state.disabled
		});
	}
});

export default Todos;
