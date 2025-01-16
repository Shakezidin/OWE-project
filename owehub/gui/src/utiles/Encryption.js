// Generate a random encryption key
const generateEncryptionKey = (length = 16) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters[randomIndex];
    }
    return key;
  };
  
  // Generate a random encryption key (32 characters for better security)
  const ENCRYPTION_KEY = generateEncryptionKey(32);
  
  // Custom encryption function
  export const encryptData = (data) => {
    try {
      const key = ENCRYPTION_KEY.split('').reverse().join(''); // Transform key
      const dataString = JSON.stringify(data); // Ensure the data is a JSON string
      let encrypted = '';
      for (let i = 0; i < dataString.length; i++) {
        encrypted += String.fromCharCode(
          dataString.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return btoa(unescape(encodeURIComponent(encrypted))); // Encode in Base64 for safe storage
    } catch (error) {
      console.error('Error during encryption:', error.message);
      console.log('Encryption failed');
    }
  };
  
  // Custom decryption function with error handling for unencrypted data
export const decryptData = (encryptedData) => {
  try {
    const key = ENCRYPTION_KEY.split('').reverse().join(''); // Transform key
    const decodedData = decodeURIComponent(escape(atob(encryptedData))); // Decode from Base64
    let decrypted = '';
    for (let i = 0; i < decodedData.length; i++) {
      decrypted += String.fromCharCode(
        decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    const parsedData = JSON.parse(decrypted); // Parse decrypted JSON string back to an object

    // Validate the parsed data (add custom validation logic if needed)
    if (parsedData && typeof parsedData === 'object') {
      return parsedData;
    } else {
       
      return null; // Return a fallback value or null
    }
  } catch (error) {
    console.log('Decryption failed or data was not encrypted:', error.message);
    return null; // Return a fallback value or null
  }
};

  