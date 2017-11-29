import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import Todos from './Todos';
import {todos} from './store';

const styles = {
	container: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'column'
	},
	header: {
		padding: 20,
		paddingBottom: 0,
		paddingRight: 10
	},
	headerRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	h1: {
		margin: 0,
		padding: 0
	},
	h3: {
		marginBottom: 0
	},
	logo: {
		height: 50,
		marginRight: 10
	},
	add: {
		position: 'absolute',
		bottom: 20,
		right: 20
	}
};

const muiTheme = getMuiTheme();

class App extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.container}>
					<div style={styles.header}>
						<div style={styles.headerRow}>
							<img src={require('./logo.jpg')} alt='logo' style={styles.logo} />
							<h1 style={styles.h1}>Firestorter Todo</h1>
						</div>
						<h3 style={styles.h3}>Firestore & React, using MobX</h3>
					</div>
					<Todos />
					<FloatingActionButton style={styles.add} onClick={this.onPressAdd}>
						<ContentAddIcon />
					</FloatingActionButton>
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
