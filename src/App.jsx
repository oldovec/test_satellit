import React from 'react';
import { Provider } from 'react-redux'
import store from './store'
import './App.scss';
import Draw from './containers/Draw/Draw';


const App = () => {

  return (
    <Provider store={ store }>
      <div>
        <Draw width={848} height={614}/>
      </div>
    </Provider>
  );
}

export default App;
