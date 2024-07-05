// /utils/Firebase.js
'use client'
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import firebase from "firebase/compat/app";
import toast from 'react-hot-toast';
import { getFcmToken } from '@/store/reducer/settingsSlice';
import { createStickyNote } from '.';

const FirebaseData = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAPf-_f8rRDaWIjESOXsTJxhH0Mys3eiWo",
    authDomain: "rocaromanaapp.firebaseapp.com",
    projectId: "rocaromanaapp",
    storageBucket: "rocaromanaapp.appspot.com",
    messagingSenderId: "177360357116",
    appId: "1:177360357116:web:8f28847522553f62893979"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);
  const authentication = getAuth(app);
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error('Error checking messaging support:', err);
      return null;
    }
  };

  const fetchToken = async (setTokenFound, setFcmToken) => {
    const messaging = await messagingInstance();
    if (!messaging) {
      console.error('Messaging not supported.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              setFcmToken(currentToken);
              getFcmToken(currentToken);
            } else {
              setTokenFound(false);
              setFcmToken(null);
              toast.error('Permission is required to receive notifications.');
            }
          })
          .catch((err) => {
            console.error('Error retrieving token:', err);
            if (err.message.includes('no active Service Worker')) {
              registerServiceWorker();
            }
          });
      } else {
        setTokenFound(false);
        setFcmToken(null);
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          fetchToken();
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  };

  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error('Messaging not supported.');
      return null;
    }
  };

  const signOut = () => {
    return authentication.signOut();
  };

  return { firebase, authentication, fetchToken, onMessageListener, signOut };
};

export default FirebaseData;
