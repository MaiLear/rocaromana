

import { store } from '@/store/store';
import localeTranslations from './locale/en.json';
import { useJsApiLoader } from '@react-google-maps/api';
import { settingsData } from '@/store/reducer/settingsSlice';
import { useSelector } from 'react-redux';

// transalte strings 

export const translate = (label) => {
  const langLabel = store.getState().Language.languages.file_name &&
    store.getState().Language.languages.file_name[label];

  const enTranslation = localeTranslations;

  if (langLabel) {
    return langLabel;
  } else {
    return enTranslation[label];
  }
};

// is login user check
export const isLogin = () => {
  let user = store.getState()?.User_signup
  if (user) {
    try {
      if (user?.data?.token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}


// Load Google Maps
export const loadGoogleMaps = () => {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
    libraries: ['geometry', 'drawing', 'places'], // Include 'places' library
  });
};

//  LOAD STRIPE API KEY 
export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key
  if (StripeKey) {
    ``
    return StripeKey
  }
  return false;
}
//  LOAD Paystack API KEY 
export const loadPayStackApiKey = () => {
  const PaystackData = store.getState()?.Settings;
  const PayStackKey = PaystackData?.data?.paystack_public_key
  if (PayStackKey) {
    ``
    return PayStackKey
  }
  return false;
}


// export const isDemoMode = (store) => {
//   const systemSettingsData = store.getState()?.Settings?.data;
//   return systemSettingsData?.data?.demo_mode;
// };


// Function to format large numbers as strings with K, M, and B abbreviations
export const formatPriceAbbreviated = (price) => {
  if (price >= 1000000000000) {
    return (price / 1000000000000).toFixed(1) + 'T';
  } else if (price >= 1000000000) {
    return (price / 1000000000).toFixed(1) + 'B';
  } else if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K';
  } else {
    return price.toString();
  }
};


export const formatPriceAbbreviatedIndian = (price) => {
  if (price >= 1000000000) {
    return (price / 1000000000).toFixed(1) + 'Ab';
  } else if (price >= 10000000) {
    return (price / 10000000).toFixed(1) + 'Cr';
  } else if (price >= 100000) {
    return (price / 100000).toFixed(1) + 'L';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K';
  } else {
    return price.toString();
  }
};



// Check if the theme color is true
export const isThemeEnabled = () => {
  const systemSettingsData = store.getState().Settings?.data
  return systemSettingsData?.svg_clr === '1';
};


export const formatNumberWithCommas = (number) => {
  if (number == null) {
    return ''; // or any default value you want
  }
  return number.toLocaleString();
};

export const placeholderImage = (e) => {
  const systemSettingsData = store.getState()?.Settings?.data;
  const placeholderLogo = systemSettingsData?.web_placeholder_logo;
  if (placeholderLogo) {
    e.target.src = placeholderLogo;
  }
};

// utils/stickyNote.js
export const createStickyNote = () => {
  const stickyNote = document.createElement('div');
  stickyNote.style.position = 'fixed';
  stickyNote.style.bottom = '0';
  stickyNote.style.width = '100%';
  stickyNote.style.backgroundColor = '#ffffff';
  stickyNote.style.color = '#000000';
  stickyNote.style.padding = '10px';
  stickyNote.style.textAlign = 'center';
  stickyNote.style.fontSize = '14px';
  stickyNote.style.zIndex = '99999';

  const closeButton = document.createElement('span');
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
  closeButton.innerHTML = '&times;';

  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  const link = document.createElement('a');
  link.style.textDecoration = 'underline';
  link.style.color = '#3498db';
  link.innerText = 'Download Now';

  link.href = process.env.NEXT_PUBLIC_APPSTORE_ID;
  stickyNote.innerHTML = 'Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ';
  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(link);

  document.body.appendChild(stickyNote);
};




export const truncate = (input, maxLength) => {
  // Check if input is undefined or null
  if (!input) {
    return ""; // or handle the case as per your requirement
  }
  // Convert input to string to handle both numbers and text
  let text = String(input);
  // If the text length is less than or equal to maxLength, return the original text
  if (text.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return text.slice(0, maxLength) + "...";
  }
}

export const truncateArrayItems = (itemsArray, maxLength) => {
  // Check if input is an array
  if (!Array.isArray(itemsArray)) {
    return "";
  }

  // Initialize an empty array to hold the truncated items
  let truncatedItems = [];

  // Iterate over the items in the array
  for (let i = 0; i < itemsArray.length; i++) {
    // Apply the truncate function to each item
    let truncatedItem = truncate(itemsArray[i], maxLength);

    // Add the truncated item to the array
    truncatedItems.push(truncatedItem);
  }

  // Join the truncated items with a comma and add "..." after the second item
  let result = truncatedItems.join(", ");

  // If there are more than two items, add "..."
  if (truncatedItems.length > 2) {
    result += "...";
  }

  return result;
};