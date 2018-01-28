import React, { Component } from 'react';
import { observer } from 'mobx-react';
// import { chocolateBars } from './store';
import { TableHeader, TableRow, TableHeaderColumn } from 'material-ui/Table';

const ListHeader = observer(
	class ListHeader extends Component {
		static muiName = 'TableHeader';
		render() {
			// const { docs } = chocolateBars;
			// console.log('ListContent.render, fetching: ', fetching);
			return (
				<TableHeader
					displaySelectAll={false}
					adjustForCheckbox={false}
					{...this.props}
				>
					<TableRow>
						<TableHeaderColumn tooltip="Unique Id">ID</TableHeaderColumn>
						<TableHeaderColumn tooltip="Company name">
							Company
						</TableHeaderColumn>
						<TableHeaderColumn tooltip="Company location">
							Location
						</TableHeaderColumn>
						<TableHeaderColumn tooltip="Origin">Origin</TableHeaderColumn>
						<TableHeaderColumn tooltip="Review date">
							Review date
						</TableHeaderColumn>
						<TableHeaderColumn tooltip="Rating">Rating</TableHeaderColumn>
						<TableHeaderColumn tooltip="Bean type">Bean type</TableHeaderColumn>
						<TableHeaderColumn tooltip="Broad bean origin">
							Broad bean origin
						</TableHeaderColumn>
					</TableRow>
				</TableHeader>
			);
		}
	}
);

export default ListHeader;
