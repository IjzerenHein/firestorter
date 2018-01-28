import React, { Component } from 'react';
import { Table } from 'material-ui/Table';
import ListHeader from './ListHeader';
import ListContent from './ListContent';

class List extends Component {
	render() {
		return (
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Table
				// fixedHeader={true}
				// headerStyle={{ position: 'fixed' }}
				>
					<ListHeader />
					<ListContent />
				</Table>
			</div>
		);
	}
}

export default List;
