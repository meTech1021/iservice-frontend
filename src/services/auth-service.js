import HttpService from "./http.service";

class AuthService {
  login = async (payload) => {
    const loginEndpoint = "login";
    return await HttpService.post(loginEndpoint, payload);
  };

  register = async (credentials) => {
    const registerEndpoint = "register";
    return await HttpService.post(registerEndpoint, credentials);
  };

  verifyEmail = async (token) => {
    const verifyEmailEndpoint = `verify-email?token=${token}`; // Construct the endpoint URL with the token
    return await HttpService.get(verifyEmailEndpoint);
  };
  
  logout = async (payload) => {
    const logoutEndpoint = "logout";
    return await HttpService.post(logoutEndpoint, payload);
  };

  forgotPassword = async (payload) => {
    const forgotPassword = "password-forgot";
    return await HttpService.post(forgotPassword, payload);
  };

  resetPassword = async (credentials) => {
    const resetPassword = "password-reset";
    return await HttpService.post(resetPassword, credentials);
  };

  getProfile = async () => {
    const getProfile = "me?include=Role";
    return await HttpService.get(getProfile);
  };

  updateProfile = async (newInfo) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  };
}

export default new AuthService();
