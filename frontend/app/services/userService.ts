import { AuthResponse, User } from '~/models/User';
import { fetchWith } from '~/utils/fetchWith';
import { API_BASE_URL } from '~/utils/config';

const API_URL = API_BASE_URL+'/auth';

export const userSingIn = async (email: string, password: unknown): Promise<AuthResponse> => {
  const response = await fetchWith<AuthResponse>(`${API_URL}/login`, {
    method: "POST",
    body: { email, password },
  });

  setAuthData(response.user, response.access_token);
  
  return response;
};

export const userSignUp = async (user: Partial<User>): Promise<User> => {
  return await fetchWith<User>(`${API_URL}/register`, {
    method: "POST",
    body: user,
  });
};

export const verifyOtp = async (code: string, email: string, action: string | null) => {
  return await fetchWith(`${API_URL}/verify-email`, {
    method: 'POST',
    body: { code, email, action },
  });
};

export const resendOtp = async (email: string) => {
  return await fetchWith(`${API_URL}/resend-code`, {
    method: 'POST',
    body: { email },
  });
};

export const resetPassword = async (email: string) => {
  return await fetchWith(`${API_URL}/forgot-password`, {
    method: 'POST',
    body: { email },
  });
};

export const resetPasswordProcess = async (
  email: string,
  code: string,
  password: string
): Promise<{ message: string }> => {
  return await fetchWith(`${API_URL}/reset-password`, {
    method: 'POST',
    body: { email, code, password },
  });
};

export const userProfile = async () => {
  const auth = getAuthData();
  const data = await fetchWith<{data: User}>(
    `${API_URL}/profile`,
    {
      method: "GET",
      token: auth?.token,
    },
    { retries: 3, delay: 5000 } // Retry 3 times with a 5-second delay
  );
  return data.data;
};

export const changePassword = async (
  current_password: string,
  new_password: string,
): Promise<{ message: string }> => {
  const auth = getAuthData();
  return await fetchWith(`${API_URL}/change-password`, {
    method: 'PUT',
    token: auth?.token,
    body: { current_password, new_password },
  });
};

export const updateProfile = async (
  profileData: User | unknown
): Promise<{ message: string; user: User }> => {
  const auth = getAuthData();
  return await fetchWith(`${API_URL}/update-profile`, {
    method: 'PUT',
    token: auth?.token,
    body: profileData,
  });
};

export const logout = async () => {
  const auth = getAuthData();
  await fetchWith<void>(`${API_URL}/logout`, {
    method: 'POST',
    token: auth?.token
  });

  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
};

export function setAuthData(user: User, token: string) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_token', token);
}

export const  getAuthData = () => {
  const userStr = localStorage.getItem('auth_user');
  const token = localStorage.getItem('auth_token');
  
  if (!userStr || !token) return null;
  
  try {
    const user = JSON.parse(userStr);
    return { user, token };
  } catch {
    return null;
  }
}
export const  getToken = () => {
  return localStorage.getItem('auth_token')||'';
}
