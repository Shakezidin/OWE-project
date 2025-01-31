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
      localStorage.setItem('ENCRYPT', ENCRYPTION_KEY);
      return btoa(unescape(encodeURIComponent(encrypted))); // Encode in Base64 for safe storage
    } catch (error) {
      console.error('Error during encryption:', error.message);
      console.log('Encryption failed');
    }
  };
  
  // Custom decryption function with error handling for unencrypted data
  export const decryptData = (encryptedData) => {
    let ENCRYPT = localStorage.getItem('ENCRYPT');
    try {
      const key = ENCRYPT.split('').reverse().join(''); // Transform key
      const decrypted = decodeURIComponent(escape(atob(encryptedData))); // Decode from Base64
      let originalData = '';
      for (let i = 0; i < decrypted.length; i++) {
        originalData += String.fromCharCode(
          decrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return JSON.parse(originalData); // Parse the decrypted JSON string back to the original data
    } catch (error) {
      console.error('Error during decryption:', error.message);
      console.log('Decryption failed');
      return null; // Return null if decryption fails
    }
  };

  