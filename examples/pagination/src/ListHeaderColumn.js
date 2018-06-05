import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableHeaderColumn } from 'material-ui/Table';
import DownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import UpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import { black } from 'material-ui/styles/colors';

class ListHeaderColumn extends Component {
	static muiName = 'TableHeaderColumn';
	static propTypes = {
		children: PropTypes.any,
		sortOrder: PropTypes.oneOf(['ascending', 'descending']),
		onSortClick: PropTypes.func
	};

	render() {
		const { sortOrder, children, onSortClick, ...props } = this.props;
		let icon;
		switch (sortOrder) {
		case 'ascending':
			icon = <DownIcon color={black} />;
			break;
		case 'descending':
			icon = <UpIcon color={black} />;
			break;
		default:
			break;
		}
		return (
			<TableHeaderColumn {...props}>
				<div
					className={'column-header' + (sortOrder ? ' selected' : '')}
					onClick={onSortClick}
				>
					{children}
					{icon}
				</div>
			</TableHeaderColumn>
		);
	}
}

export default ListHeaderColumn;
