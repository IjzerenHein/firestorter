import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { chocolateBars } from './store';
import { TableBody } from 'material-ui/Table';
import ListItem from './ListItem';

const ListContent = observer(
	class ListContent extends Component {
		static muiName = 'TableBody';
		render() {
			const { docs } = chocolateBars;
			// console.log('ListContent.render, fetching: ', fetching);
			return (
				<TableBody {...this.props}>
					{docs.map(doc => <ListItem key={doc.id} doc={doc} />)}
				</TableBody>
			);
		}
	}
);

export default ListContent;
