import api from '../services/api';
import { AuthContext } from './auth-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const AuthProvider = ({ children }) => {
  
  const queryClient = useQueryClient();
  
  const {data: user = null, isLoading: loading } = useQuery({
    queryFn: async ()=> {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const res = await api.get('/auth/me');
        return res.data.user;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          return null;
        }

        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryKey: ["authUser"]
  })
  
  const userLogin= async({ email, password })=>{
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  }

  const {mutateAsync: login, isPending: isLoggingIn} = useMutation({
    mutationFn: userLogin,
    onSuccess: (user)=>{
      queryClient.setQueryData(["authUser"], user)
    },
    onError: (err)=>{
      console.log(err.response?.data?.message || 'Failed to Login.');
    }
  })
  
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(["authUser"], null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggingIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};