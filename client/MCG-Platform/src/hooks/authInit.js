import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../store/slices/userSlice';
import { BACKEND_URL } from '../config/config';

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/me`, {
          withCredentials: true,
        });
        console.log(res.data.user);
        dispatch(setUser(res.data.user));
      } catch (err) {
        console.log("Not logged in or token invalid");
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useAuthInit;