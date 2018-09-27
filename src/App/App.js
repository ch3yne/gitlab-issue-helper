import React, { Component } from 'react';
import s from './App.css';

import MainPage from '../components/MainPage';

class App extends Component {
  render() {
    return (
      <div className={s.App}>
        <MainPage />
      </div>
    );
  }
}

export default App;
