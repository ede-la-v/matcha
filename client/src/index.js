import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import MatchaApp from './MatchaApp'
import configureStore from './configureStore'
import registerServiceWorker from './registerServiceWorker';
import { receivedUser, unauthUser } from './actions'


const store = configureStore()

if (localStorage.jwtToken) {
	fetch('/api/me', {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
		}
	})
	.then(res => {
		if (res.ok) {
			return res.json()
		} else {
			return Promise.reject('oops')
		}
	})
	.then(value => {
		store.dispatch(receivedUser(value))
		ReactDOM.render(<MatchaApp store={store} />, document.getElementById('root'))
	})
	.catch(err => {
		store.dispatch(unauthUser())
		ReactDOM.render(<MatchaApp store={store} />, document.getElementById('root'))
	})
} else {
	ReactDOM.render(<MatchaApp store={store} />, document.getElementById('root'));
}


registerServiceWorker();
