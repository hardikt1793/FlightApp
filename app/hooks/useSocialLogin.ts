import {useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const useSocialLogin = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1062480914855-331kokr6dadotb98tppe6adn1hrib2t9.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      iosClientId:
        '1062480914855-6pgehin1i1gekq0p1jts5dbv3e3gf7vq.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      console.log('User Info:', userInfo);
      console.log('Access Token:', tokens.accessToken);
      return {userInfo, accessToken: tokens.accessToken};
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else {
        console.error('Error during Google Sign-In:', error);
      }
      return null;
    }
  };

  return {signInWithGoogle};
};

export default useSocialLogin;
