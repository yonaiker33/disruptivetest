import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Importa tu reducer de autenticación aquí

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
