// /plugins/firebase.js
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyAy3NsjnLLa6xRIRbWMXjvHq_0jMZO0YTY',
  authDomain: 'timemap-cf037.firebaseapp.com',
  databaseURL: 'https://timemap-cf037.firebaseio.com',
  projectId: 'timemap-cf037',
  storageBucket: 'timemap-cf037.appspot.com',
  messagingSenderId: '205365316539',
  appId: '1:205365316539:web:bb9cf306b440c6409d929e',
  measurementId: 'G-XKQ63X5YGR'
}

let app = null
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
}

export const db = app.database()
