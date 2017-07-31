import React, { Component } from 'react';
import './App.css';
import './assets/react-toolbox/theme.css';
import theme from './assets/react-toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import Button from 'react-toolbox/lib/button/Button';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Input from 'react-toolbox/lib/input/Input';
import Encrypt from "./Encrypt";

class App extends Component {
  state = { name: '', message: '', active: false, encryptedMessage: '', expDate: '', errorMessage: ''};
  passphrase = (window.location.hash).substring(1);

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  toggleDialog = () => {
    this.setState({active: !this.state.active});
  }

  handleEncrypt = () => {
    // TODO - use rest or spread operators to assign these values:
    const name = this.state.name;
    const message = this.state.message;
    const expDate = this.state.expDate;
    fetch(`/encrypt/${this.passphrase}/${name}/${message}/${expDate}`)
      .then(response => response.json())
      .then(jsonData => this.setState( {encryptedMessage: jsonData.encryptedMessage} ))
      .catch(error => {
        alert('Something went wrong');
      });
    this.toggleDialog();
  }  

  handleDecrypt = () => {
    const encryptedMessage = this.state.encryptedMessage;
    const uriEncoded = encodeURIComponent(encryptedMessage);
    fetch(`/decrypt/${this.passphrase}/${uriEncoded}`)
      .then(response => response.json())
      .then(jsonData => this.setState( {errorMessage: jsonData.error, name: jsonData.name, message: jsonData.message, expDate: new Date(jsonData.expDate)} ))
      .catch(error => {
        alert("There was an error in getting this message.")
      });
    this.toggleDialog();
  }

  getFormattedDate() {
    const selectedDate = new Date(1995, 11, 17);
    const expDate = new Date(this.state.expDate);
    const year = expDate.getFullYear();
    const month = expDate.getMonth() + 1;
    const day = expDate.getDate();
    const formattedDate = new Date(year, month, day);
    return selectedDate;
  }

  dialogActions = [
    { label: "Close", onClick: this.toggleDialog },
    { label: "Decrypt", onClick: this.handleDecrypt }
  ];

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="Form">
            <Input type="text" required label="Name" name="name" value={this.state.name} onChange={this.handleChange.bind(this, "name")}/>
            <Input type="text" required multiline label="Message" name="message" value={this.state.message} onChange={this.handleChange.bind(this, "message")} maxLength={120} />
            <DatePicker
            label="Expiration Date"
            // TODO - set today's date as minDate
            onChange={this.handleChange.bind(this, "expDate")}
            value={this.state.expDate}
            sundayFirstDayOfWeek
            />
          <div className="error"></div>
          <Button label="Encrypt" onClick={this.handleEncrypt} raised/>
          <Button label="Decrypt" onClick={this.toggleDialog} raised/>
          <Dialog
            actions={this.dialogActions}
            active={this.state.active}
            onEscKeyDown={this.toggleDialog}
            onOverlayClick={this.toggleDialog}
            title="De/Encrypt">
            <Input type="text" required multiline label="Message" name="encryptedMessage" value={this.state.encryptedMessage} onChange={this.handleChange.bind(this, "encryptedMessage")}/>
          </Dialog>
          </div>
          <p>Your Passphrase - {this.passphrase}</p>
          <a href="/new">Generate new Passphrase</a>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
