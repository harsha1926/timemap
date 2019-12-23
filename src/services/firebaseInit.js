import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
export const apiKey = 'AIzaSyAy3NsjnLLa6xRIRbWMXjvHq_0jMZO0YTY'
const config = {
  apiKey,
  authDomain: 'timemap-cf037.firebaseapp.com',
  databaseURL: 'https://timemap-cf037.firebaseio.com',
  projectId: 'timemap-cf037',
  storageBucket: 'timemap-cf037.appspot.com',
  messagingSenderId: '205365316539',
  appId: '1:205365316539:web:bb9cf306b440c6409d929e',
  measurementId: 'G-XKQ63X5YGR'
}
if (!firebase.apps.length) firebase.initializeApp(config)
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const FacebookProvider = new firebase.auth.FacebookAuthProvider()
export const auth = firebase.auth()
export const firebaseDB = firebase.database()
export const firebaseStore = firebase.firestore()
export default firebase