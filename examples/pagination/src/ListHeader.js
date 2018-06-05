import React, { Component } from 'react';
import { observer } from 'mobx-react';
// import { chocolateBars } from './store';
import { TableHeader, TableRow } from 'material-ui/Table';
import ListHeaderColumn from './ListHeaderColumn';

const COLUMNS = [
	{ field: 'id', text: 'ID' },
	{ field: 'company', text: 'Company name' },
	{ field: 'companyLocation', text: 'Company location' },
	{ field: 'origin', text: 'Origin' },
	{ field: 'reviewDate', text: 'Review date' },
	{ field: 'rating', text: 'Rating' },
	{ field: 'beanType', text: 'Bean type' },
	{ field: 'broadBeanOrigin', text: 'Broad bean origin' }
];

class ListHeader extends Component {
	static muiName = 'TableHeader';

	state = {
		sortColumn: undefined,
		sortDirection: undefined
	};

	render() {
		const { sortColumn, sortDirection } = this.state;
		// const { docs } = chocolateBars;
		// console.log('ListContent.render, fetching: ', fetching);
		return (
			<TableHeader
				displaySelectAll={false}
				adjustForCheckbox={false}
				{...this.props}
			>
				<TableRow>
					{COLUMNS.map(({ field, text, tooltip }) => (
						<ListHeaderColumn
							key={field}
							tooltip={tooltip}
							onSortClick={() => this.onClickColumn(field)}
							sortOrder={sortColumn === field ? sortDirection : undefined}
						>
							{text}
						</ListHeaderColumn>
					))}
				</TableRow>
			</TableHeader>
		);
	}

	onClickColumn(field) {
		const { sortColumn, sortDirection } = this.state;
		this.setState({
			sortColumn: field,
			sortDirection:
				field === sortColumn && sortDirection === 'ascending'
					? 'descending'
					: 'ascending'
		});
	}
}

export default observer(ListHeader);
