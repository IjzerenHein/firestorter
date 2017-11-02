import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {todos} from './store';
import FlipMove from 'react-flip-move';
import CircularProgress from 'material-ui/CircularProgress';
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
	}
};

const Todos = observer(class Todos extends Component {
  render() {
  	const {docs, fetching} = todos;
  	console.log('Todos.render, fetching: ', fetching);
    return (
      <div>
      	<FlipMove enterAnimation='fade' leaveAnimation='fade'>
        	{docs.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
        </FlipMove>
        {fetching ? <div style={styles.loader}><CircularProgress /></div> : undefined}
      </div>
    );
  }
});

export default Todos;
