import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Todos from './Todos';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const muiTheme = getMuiTheme();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>React/Firestore Todo App</h1>
          <h3>using Mobx observables</h3>
          <Todos />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
