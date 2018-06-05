import React, { Component } from 'react';
import Left from 'material-ui/svg-icons/navigation/chevron-left';
import Right from 'material-ui/svg-icons/navigation/chevron-right';
import IconButton from 'material-ui/IconButton';
import { chocolateBars } from './store';
import { observer } from 'mobx-react';

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'row'
	},
};

class ListPaginator extends Component {
	render() {
		const { canPaginateNext, canPaginatePrevious } = chocolateBars;

		return (
			<div style={styles.container}>
				<IconButton onClick={this.onClickPrevious} label="Previous" disabled={!canPaginatePrevious}>
					<Left />
				</IconButton>
				<IconButton onClick={this.onClickNext} label="Next" disabled={!canPaginateNext}>
					<Right />
				</IconButton>
			</div>
		);
	}

	onClickPrevious = () => {
		console.debug('onClickPrevious');
		chocolateBars.paginatePrevious();
	};

	onClickNext = () => {
		console.debug('onClickNext');
		chocolateBars.paginateNext();
	};
}

export default observer(ListPaginator);
