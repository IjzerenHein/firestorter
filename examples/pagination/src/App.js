import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import List from './List';
import ListFilters from './ListFilters';
import ListPaginators from './ListPaginators';

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
		paddingRight: 10,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerRow: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	h3: {
		marginBottom: 0
	},
	logo: {
		height: 66,
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
						<img
							src={require('./cocoa-bean.jpg')}
							alt="logo"
							style={styles.logo}
						/>
						<div style={styles.headerRow}>
							<h1 style={styles.h1}>Flavours of cacao</h1>
							<h3 style={styles.h3}>Firestorter Pagination Demo</h3>
						</div>
						<ListPaginators />
						<ListFilters />
					</div>
					<List />
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
