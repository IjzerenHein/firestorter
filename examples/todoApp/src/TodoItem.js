import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';  
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    marginLeft: 16,
    width: 40
  },
  input: {
    flex: 1
  }
};

class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.any
  };

  render() {
    const {todo} = this.props;
    const {finished, text} = todo.data;
    console.log('TodoItem.render: ', todo.id);
    return (
      <div style={styles.container}>
        <div style={styles.row}>
          <Checkbox
            style={styles.checkbox}
            checked={finished} />
          <TextField
            style={styles.input}
            underlineShow={false} 
            hintText='What needs to be done?'
            value={text} />
        </div>
        <Divider />
      </div>
    );
  }
}

export default observer(TodoItem);
