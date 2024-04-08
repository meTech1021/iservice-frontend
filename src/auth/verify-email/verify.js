import { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from "context";
import AuthService from "services/auth-service";

const VerifyEmailPage = () => {
  const authContext = useContext(AuthContext);
  const { token } = useParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await AuthService.verifyEmail(token);
        authContext.login(response.access_token);
        window.location.href = process.env.REACT_APP_IS_DEMO;
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    };

    verifyEmail();
  }, []);

  return null; // Render nothing since the page is redirecting
}

export default VerifyEmailPage;
