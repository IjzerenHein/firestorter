import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TableRow, TableRowColumn } from 'material-ui/Table';

class ListItem extends Component {
	static muiName = 'TableRow';
	static propTypes = {
		doc: PropTypes.any.isRequired
	};

	render() {
		const { doc } = this.props;
		const { id, data } = doc;
		const {
			company,
			companyLocation,
			origin,
			reviewDate,
			rating,
			beanType,
			broadBeanOrigin
		} = data;

		// console.log('ListItem.render: ', doc.path, ', id: ', id);
		return (
			<TableRow key={id}>
				<TableRowColumn>{id}</TableRowColumn>
				<TableRowColumn>{company}</TableRowColumn>
				<TableRowColumn>{companyLocation}</TableRowColumn>
				<TableRowColumn>{origin}</TableRowColumn>
				<TableRowColumn>{reviewDate.getFullYear()}</TableRowColumn>
				<TableRowColumn>{rating}</TableRowColumn>
				<TableRowColumn>{beanType}</TableRowColumn>
				<TableRowColumn>{broadBeanOrigin}</TableRowColumn>
			</TableRow>
		);
	}
}

export default observer(ListItem);
