import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'

const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
