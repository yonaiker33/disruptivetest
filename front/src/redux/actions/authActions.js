import axios from 'axios';

export const login = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/api/users/login', userData);
    localStorage.setItem("token", response.data.token);
    // Despachar la acción para llenar los datos del usuario en el store de Redux
    dispatch({ type: 'LOGIN_SUCCESS', payload: {user: response.data.user, token: response.data.token}});
    window.location.href = '/'
  } catch (error) {
    // Manejar errores
    console.error('Error logging in:', error);
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};

export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay un token en el almacenamiento local, despacha una acción de fallo de inicio de sesión
    dispatch({ type: 'LOGIN_FAILURE', payload: 'No hay token disponible' });
    return; // Salir de la función ya que no hay token disponible
  }
  try {
    const response = await axios.get('/api/users/authtoken', {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en la cabecera de la solicitud
      }
    });
    const userData = {user: response.data.user, token:token}; // Extrae la información del usuario desde la respuesta
    // Despacha una acción con los datos del usuario para indicar un inicio de sesión exitoso
    dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
    return userData; // Devuelve los datos del usuario
  } catch (error) {
    // Maneja el error y despacha una acción de fallo de inicio de sesión con el mensaje de error
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
export const logout = () => {
  // Limpiar el token del almacenamiento local
  localStorage.removeItem('token');

  // Devolver una acción de logout
  return { type: 'LOGOUT' };
};