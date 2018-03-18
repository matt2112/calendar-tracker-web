// @flow

import React, { Component, Fragment } from 'react';
import moment, { type Moment } from 'moment';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';

import firebase from './firebaseConfig';
import './app.css';
import Options from './components/Options/Options';
import Result from './components/Result/Result';
import Calendar from './components/Calendar/Calendar';
import checkDates from './algorithm';

type Props = {};
type State = {
  awayOverMax: boolean,
  maxDays: number,
  timePeriod: number,
  startDate: string,
  endDate: string,
  datesAway: Array<Moment>,
  loggedIn: boolean
};

class App extends Component<Props, State> {
  state = {
    awayOverMax: false,
    maxDays: 4,
    timePeriod: 5,
    startDate: moment().subtract(1, 'year'),
    endDate: moment(),
    datesAway: [],
    loggedIn: false
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => this.setState(() => ({ loggedIn: !!user })));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.loggedIn && this.state.loggedIn) {
      const userId = firebase.auth().currentUser.uid;

      firebase
        .database()
        .ref(`/users/${userId}/numDatesAway`)
        .once('value')
        .then((snapshot) => {
          const maxDays = snapshot.val();
          this.setState(() => ({
            maxDays
          }));
        });
    }
  }

  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccess: () => false
    }
  };

  changeOptionValue = (name: string, value: string) => {
    let formattedValue;
    if (name === 'maxDays' || name === 'timePeriod') {
      formattedValue = value === '' ? 0 : parseInt(value, 10);
    } else {
      // Otherwise is a date.
      formattedValue = value;
    }

    this.setState(
      () => ({
        [name]: formattedValue
      }),
      () => {
        this.calculateResult();
      }
    );
  };

  calculateResult = () => {
    const datesArray = this.state.datesAway.map(date => date.start);
    const awayOverMax = checkDates(
      this.state.startDate,
      this.state.endDate,
      datesArray,
      this.state.timePeriod,
      this.state.maxDays
    );

    this.setState(
      () => ({
        awayOverMax
      }),
      () => {
        const userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref(`/users/${userId}/numDatesAway`)
          .set(this.state.datesAway.length);
      }
    );
  };

  addOrRemoveDate = (dateInfo: { slots: Array<Moment>, start: Moment }) => {
    const newDatesAway = [...this.state.datesAway];
    const indicesToSplice = [];
    const datesToAdd = [];
    if (dateInfo.slots) {
      dateInfo.slots.forEach((date) => {
        const existingDateIdx = this.state.datesAway.findIndex(
          oldDate => oldDate.start.toDateString() === date.toDateString()
        );
        if (existingDateIdx === -1) {
          datesToAdd.push({
            id: Math.random(),
            title: 'Away',
            allDay: true,
            start: date,
            end: date
          });
        } else {
          indicesToSplice.push(existingDateIdx);
        }
      });
      // Otherwise single existing event selected.
    } else {
      const existingDateIdx = this.state.datesAway.findIndex(
        oldDate => oldDate.start.toDateString() === dateInfo.start.toDateString()
      );
      indicesToSplice.push(existingDateIdx);
    }

    const updatedDates = newDatesAway.filter((val, idx) => indicesToSplice.indexOf(idx) === -1);

    datesToAdd.forEach(date => updatedDates.push(date));

    this.setState(
      () => ({
        datesAway: updatedDates
      }),
      () => this.calculateResult()
    );
  };

  render() {
    return (
      <div id="app">
        <h1 className="title">Calendar Tracker</h1>
        {!this.state.loggedIn && (
          <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        )}
        {this.state.loggedIn && (
          <Fragment>
            <h2>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</h2>
            <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
            <Options
              endDate={this.state.endDate}
              maxDays={this.state.maxDays}
              startDate={this.state.startDate}
              timePeriod={this.state.timePeriod}
              onOptionChange={this.changeOptionValue}
            />
            <Calendar
              endDate={this.state.endDate}
              startDate={this.state.startDate}
              datesAway={this.state.datesAway}
              onAddOrRemoveDate={this.addOrRemoveDate}
            />
            <Result
              awayOverMax={this.state.awayOverMax}
              maxDays={this.state.maxDays}
              timePeriod={this.state.timePeriod}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
