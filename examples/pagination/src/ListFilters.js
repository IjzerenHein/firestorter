import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropLeft from 'material-ui/svg-icons/navigation/chevron-left';
import Chip from 'material-ui/Chip';
import { chocolateBars } from './store';

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
		menuOpen: false,
		filters: []
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
						this.setFilters([
							...this.state.filters,
							{
								type,
								key,
							}
						]);
						this.handleRequestClose();
					}}
				/>
			);
		}
		return res;
	}

	render() {
		// console.log('ListItem.render: ', doc.path, ', id: ', id);
		const { menuOpen, anchorEl, filters } = this.state;

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
					{filters.map((filter) => {
						const {type, key} = filter;
						return (
							<Chip
								key={`${type}.${key}`}
								onRequestDelete={() => this.onDeleteFilter(filter)}
								style={styles.chip}>
								{key}
							</Chip>
						);
					})}
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

	onDeleteFilter(filter) {
		const filters = this.state.filters.slice();
		filters.splice(filters.indexOf(filter), 1);
		this.setFilters(filters);
	}

	setFilters(filters) {
		this.setState({
			filters
		});
		chocolateBars.query = (ref) => {
			filters.forEach(({type, key}) => {
				FILTERS[type][key].forEach((where) => {
					ref = ref.where(where[0], where[1], where[2]);
				});
			});
			return ref;
		};
	}
}

export default ListFilters;
