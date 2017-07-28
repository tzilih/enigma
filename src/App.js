import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import Button from 'react-toolbox/lib/button/Button';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Input from 'react-toolbox/lib/input/Input';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="Form">
            <Input type='text' label='*Name' name='name'/>
            <Input type='text' label='*Message' name='name' maxLength={120} />
            <DatePicker
            label='Expiration Date'
            // onChange={this.handleChange.bind(this, 'date1')}
            // value={this.state.date1}
            sundayFirstDayOfWeek
            />
          </div>
          <Button label="Encrypt" raised/>
          <Button label='Decrypt' onClick={this.handleToggle} raised/>
          <Dialog
          // actions={this.actions}
          // active={this.state.active}
          // onEscKeyDown={this.handleToggle}
          // onOverlayClick={this.handleToggle}
          title='My awesome dialog'
          >
          </Dialog>
          <p>Your Passphrase - PLACEHOLDER</p>
          <a href="#">Generate new Passphrase</a>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
