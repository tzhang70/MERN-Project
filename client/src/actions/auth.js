import api from '../utils/api';
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';

//Register the user
export const register = formData => async dispatch => {
    try {
      const res = await api.post('users', formData);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      //dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(err.msg, 'danger')));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
};
