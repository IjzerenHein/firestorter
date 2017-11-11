import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import Todos from './Todos';
import {todos} from './store';

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column'
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerTitle: {
		flex: 1
	},
	logo: {
		height: 50,
		marginRight: 10
	}
};

const muiTheme = getMuiTheme();

class App extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.container}>
					<div style={styles.header}>
						<img src={require('./logo.jpg')} alt='logo' style={styles.logo} />
						<div style={styles.headerTitle}>
							<h1>Firestorter - React & Firestore Todo App</h1>
							<h3>using Mobx observables</h3>
						</div>
						<FloatingActionButton onClick={this.onPressAdd}>
							<ContentAddIcon />
						</FloatingActionButton>
					</div>
					<Todos />
				</div>
			</MuiThemeProvider>
		);
	}

	onPressAdd = async () => {
		try {
			await todos.add({
				finished: false,
				text: ''
			});
		}
		catch (err) {
			// TODO
		}
	};
}

export default App;
