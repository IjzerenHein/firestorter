import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropLeft from 'material-ui/svg-icons/navigation/chevron-left';
import Chip from 'material-ui/Chip';

const styles = {
	container: {
		display: 'flex',
		flex: 1,
		marginRight: 10,
		flexDirection: 'row-reverse'
	},
	filters: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row-reverse',
		flexWrap: 'wrap',
		marginRight: 10
	},
	chip: {
		margin: 4
	}
};

const FILTERS = {
	beanType: {
		Trinitario: [['beanType', '==', 'Trinitario']],
		Criollo: [['beanType', '==', 'Criollo']],
		'Forastero (Nacional)': [['beanType', '==', 'Forastero (Nacional)']],
		Blend: [['beanType', '==', 'Blend']]
	},
	reviewDate: {
		'2012': [
			['reviewDate', '>=', new Date(2012, 1)],
			['reviewDate', '<', new Date(2013, 1)]
		],
		'2013': [
			['reviewDate', '>=', new Date(2013, 1)],
			['reviewDate', '<', new Date(2014, 1)]
		],
		'2014': [
			['reviewDate', '>=', new Date(2014, 1)],
			['reviewDate', '<', new Date(2015, 1)]
		]
	},
	companyLocation: {
		'U.S.A.': [['companyLocation', '==', 'U.S.A.']],
		France: [['companyLocation', '==', 'France']],
		Canada: [['companyLocation', '==', 'Canada']],
		Lithuania: [['companyLocation', '==', 'Lithuania']],
		Brazil: [['companyLocation', '==', 'Brazil']],
		Belgium: [['companyLocation', '==', 'Belgium']],
		Peru: [['companyLocation', '==', 'Peru']],
		Ireland: [['companyLocation', '==', 'Ireland']]
	}
};

class ListFilters extends Component {
	state = {
		anchorEl: undefined,
		menuOpen: false
	};

	createMenuItems(type) {
		const filters = FILTERS[type];
		const res = [];
		for (const key in filters) {
			res.push(
				<MenuItem
					key={key}
					primaryText={key}
					onClick={() => {
						console.log('TODO');
						this.handleRequestClose();
					}}
				/>
			);
		}
		return res;
	}

	render() {
		// console.log('ListItem.render: ', doc.path, ', id: ', id);
		const { menuOpen, anchorEl } = this.state;

		return (
			<div style={styles.container}>
				<Popover
					open={menuOpen}
					anchorEl={anchorEl}
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'left', vertical: 'top' }}
					onRequestClose={this.handleRequestClose}
				>
					<Menu>
						<MenuItem
							primaryText="Company location"
							leftIcon={<ArrowDropLeft />}
							menuItems={this.createMenuItems('companyLocation')}
						/>
						<MenuItem
							primaryText="Review date"
							leftIcon={<ArrowDropLeft />}
							menuItems={this.createMenuItems('reviewDate')}
						/>
						<MenuItem
							primaryText="Bean type"
							leftIcon={<ArrowDropLeft />}
							menuItems={this.createMenuItems('beanType')}
						/>
					</Menu>
				</Popover>
				<RaisedButton onClick={this.onClickFilter} label="Add Filter" />
				<div style={styles.filters}>
					<Chip
						onRequestDelete={() => this.handleRequestDelete()}
						style={styles.chip}
					>
						2014
					</Chip>
					<Chip
						onRequestDelete={() => this.handleRequestDelete()}
						style={styles.chip}
					>
						2014
					</Chip>
					<Chip
						onRequestDelete={() => this.handleRequestDelete()}
						style={styles.chip}
					>
						2014
					</Chip>
					<Chip
						onRequestDelete={() => this.handleRequestDelete()}
						style={styles.chip}
					>
						2014
					</Chip>
				</div>
			</div>
		);
	}

	onClickFilter = event => {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			menuOpen: true,
			anchorEl: event.currentTarget
		});
	};

	handleRequestClose = () => {
		this.setState({
			menuOpen: false
		});
	};
}

export default ListFilters;
