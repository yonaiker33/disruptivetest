const initialState = {
    isAuthenticated: false,
    user: {},
    error: ''
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
          error: ''
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isAuthenticated: false,
          user: {},
          error: action.payload
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: {},
          error: ''
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  