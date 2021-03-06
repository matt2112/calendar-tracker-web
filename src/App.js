// @flow

import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import moment from 'moment';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import uniqueId from 'lodash/uniqueId';

import firebase from './firebaseConfig';
import './app.css';
import NavBar from './components/NavBar/NavBar';
import Options from './components/Options/Options';
import Calendar from './components/Calendar/Calendar';
import Table from './components/Table/Table';
import checkDates from './algorithm';
import { ABROAD, TRAVELLING } from './constants';

type Props = {};
type State = {
  awayOverMax: [boolean, number],
  currentDate: Date,
  datesAway: Array<{
    allDay: boolean,
    end: Date,
    id: number,
    start: Date,
    title: string
  }>,
  loggedIn: boolean,
  options: {
    maxDays: number,
    timePeriod: number,
    startDate: moment,
    endDate: moment
  }
};

class App extends Component<Props, State> {
  state = {
    awayOverMax: [false, 0],
    currentDate: new Date(),
    datesAway: [],
    loggedIn: false,
    options: {
      maxDays: 4,
      timePeriod: 5,
      startDate: moment().subtract(1, 'year'),
      endDate: moment()
    }
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => this.setState(() => ({ loggedIn: !!user })));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.loggedIn && this.state.loggedIn) {
      const userId = firebase.auth().currentUser.uid;

      firebase
        .database()
        .ref(`/users/${userId}/options`)
        .once('value')
        .then((snapshot) => {
          const options = snapshot.val();
          if (options) {
            this.setState({
              options: {
                maxDays: options.maxDays,
                timePeriod: options.timePeriod,
                startDate: moment(options.startDate),
                endDate: moment(options.endDate)
              }
            });
          }
        });

      firebase
        .database()
        .ref(`/users/${userId}/datesAway`)
        .once('value')
        .then((snapshot) => {
          const datesAway = snapshot.val();
          if (datesAway) {
            this.setState(
              {
                datesAway: datesAway.map(date => ({
                  allDay: date.allDay,
                  // React Big Calendar can't seem to process dates as moment objects.
                  end: new Date(date.end),
                  id: date.id,
                  start: new Date(date.start),
                  title: date.title
                }))
              },
              () => this.calculateResult()
            );
          }
        });
    }
  }

  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: '/'
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
      prevState => ({
        options: {
          ...prevState.options,
          [name]: formattedValue
        }
      }),
      () => {
        this.calculateResult();
      }
    );
  };

  calculateResult = () => {
    const datesArray = this.state.datesAway
      .filter(date => date.title === ABROAD)
      .map(date => date.start);
    const awayOverMax = checkDates(
      this.state.options.startDate,
      this.state.options.endDate,
      datesArray,
      this.state.options.timePeriod,
      this.state.options.maxDays
    );

    this.setState({ awayOverMax });
  };

  addOrRemoveDate = (dateInfo: { slots: Array<Date>, start: Date }): void => {
    const indicesToSplice = [];
    const datesToAdd: Array<{
      id: number,
      title: string,
      allDay: boolean,
      start: Date,
      end: Date
    }> = [];
    if (dateInfo.slots) {
      dateInfo.slots.forEach((date) => {
        const existingDateIdx = this.state.datesAway.findIndex(
          oldDate => oldDate.start.toDateString() === date.toDateString()
        );
        if (existingDateIdx === -1) {
          datesToAdd.push({
            id: uniqueId('date_'),
            title: ABROAD,
            allDay: true,
            start: date,
            end: date
          });
        } else if (this.state.datesAway[existingDateIdx].title === ABROAD) {
          indicesToSplice.push(existingDateIdx);
          datesToAdd.push({
            id: uniqueId('date_'),
            title: TRAVELLING,
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
      if (dateInfo.title === ABROAD) {
        datesToAdd.push({
          id: uniqueId('date_'),
          title: TRAVELLING,
          allDay: true,
          start: dateInfo.start,
          end: dateInfo.end
        });
      }
      indicesToSplice.push(existingDateIdx);
    }

    const updatedDates = this.state.datesAway
      .filter((val, idx) => indicesToSplice.indexOf(idx) === -1);

    datesToAdd.forEach(date => updatedDates.push(date));

    this.setState(
      () => ({
        datesAway: updatedDates
      }),
      () => this.calculateResult()
    );
  };

  changeCurrentDate = (date: Date) => {
    this.setState({
      currentDate: date
    });
  };

  changeYear = (increment: number) => {
    const newDate = new Date(this.state.currentDate);
    const year = newDate.getFullYear();
    newDate.setFullYear(year + increment);
    this.changeCurrentDate(newDate);
  };

  saveOptions = () => {
    const userId = firebase.auth().currentUser.uid;
    const { options } = this.state;
    const optionsToSave = {
      maxDays: options.maxDays,
      timePeriod: options.timePeriod,
      startDate: options.startDate.format(),
      endDate: options.endDate.format()
    };

    firebase
      .database()
      .ref(`/users/${userId}/options`)
      .set(optionsToSave);
  };

  saveDates = () => {
    const userId = firebase.auth().currentUser.uid;
    const datesToSave = this.state.datesAway.map(date => ({
      allDay: date.allDay,
      end: moment(date.end).format(),
      id: date.id,
      start: moment(date.start).format(),
      title: date.title
    }));

    firebase
      .database()
      .ref(`/users/${userId}/datesAway`)
      .set(datesToSave);
  };

  render() {
    const {
      endDate, maxDays, startDate, timePeriod
    } = this.state.options;

    return (
      <div id="app">
        {!this.state.loggedIn && (
          <Fragment>
            <h1 className="title">Calendar Tracker</h1>
            <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
          </Fragment>
        )}
        {this.state.loggedIn && (
          <Fragment>
            <NavBar />
            <div id="container">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Calendar
                      awayOverMax={this.state.awayOverMax}
                      currentDate={this.state.currentDate}
                      datesAway={this.state.datesAway}
                      maxDays={maxDays}
                      onAddOrRemoveDate={this.addOrRemoveDate}
                      onBackOneYear={() => this.changeYear(-1)}
                      onForwardOneYear={() => this.changeYear(1)}
                      onNavigate={this.changeCurrentDate}
                      onSave={this.saveDates}
                      startDate={startDate}
                      timePeriod={timePeriod}
                    />
                  )}
                />
                <Route
                  path="/table"
                  render={() => (
                    <Table datesAway={this.state.datesAway} options={this.state.options} />
                  )}
                />
                <Route
                  path="/options"
                  render={() => (
                    <Options
                      endDate={endDate}
                      maxDays={maxDays}
                      onOptionChange={this.changeOptionValue}
                      onSave={this.saveOptions}
                      startDate={startDate}
                      timePeriod={timePeriod}
                    />
                  )}
                />
              </Switch>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
