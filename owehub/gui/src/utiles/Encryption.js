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
      throw new Error('Encryption failed');
    }
  };
  
  // Custom decryption function
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
      return JSON.parse(decrypted); // Parse decrypted JSON string back to an object
    } catch (error) {
      console.error('Decryption failed:', error.message);
      console.error('Input data causing failure:', encryptedData);
      throw new Error('Decryption failed');
    }
  };
  