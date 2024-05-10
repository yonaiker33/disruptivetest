import { legacy_createStore, applyMiddleware } from 'redux'; // Importa createStore
import {thunk} from 'redux-thunk';
import rootReducer from './redux/rootReducer'; // Importa tu rootReducer

// Crea tu store de Redux con redux-thunk como middleware
const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;