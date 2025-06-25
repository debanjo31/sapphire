import bcrypt from "bcryptjs";
import crypto from "crypto";

let password = "Pass1234";
const salt = bcrypt.genSaltSync(10);
//Algorithm used to generate the salt is blowfish cipher
// cost factor 10 means 2^10 = 1024 iterations
// cost factor 12 means 2^12 = 4096 iterations
// $2b$10$NfkobK1OMv24CGNrWGtYwu;
// $2b$12$kJ/hQ.dRyx3Dovte8taaau
// Salt generated a 22 character
// Generate a salt with 16 rounds
const hash = bcrypt.hashSync(password, salt);
// first adding the characters of the password to the salt and then hashing it
// The hash is a fixed-size string that represents the password
// Store hash in your password DB

// Salt is random strings that is generated and added to the password before hashing
console.log("Salt:", salt);
console.log("Hash:", hash);

// Custom SHA-256 Implementation
/**
 * Custom SHA-256 based password hashing with salt
 * NOTE: This is for educational purposes. In production, use bcrypt or other established libraries.
 */

/**
 * Generates a random salt of specified length
 * @param {number} length - Length of salt to generate
 * @returns {string} - Generated salt in hex format
 */
function generateCustomSalt(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hashes a password using SHA-256 with salt
 * @param {string} password - Plain text password to hash
 * @returns {object} - Object containing the hashed password and salt
 */
function customHashPassword(password) {
  // Generate a random salt
  const salt = generateCustomSalt();

  // Create a hash using SHA-256 with multiple iterations
  let hash = password + salt;
  // Perform multiple iterations to make it more secure
  for (let i = 0; i < 1000; i++) {
    hash = crypto.createHash("sha256").update(hash).digest("hex");
  }

  // Return both hash and salt (both needed for verification)
  return {
    hash,
    salt,
  };
}

/**
 * Verifies a password using the custom SHA-256 implementation
 * @param {string} password - Plain text password to verify
 * @param {string} storedHash - Previously stored hash
 * @param {string} storedSalt - Previously stored salt
 * @returns {boolean} - True if password matches, false otherwise
 */
function verifyCustomPassword(password, storedHash, storedSalt) {
  // Recreate the hash using the same salt and iterations
  let hash = password + storedSalt;
  for (let i = 0; i < 1000; i++) {
    hash = crypto.createHash("sha256").update(hash).digest("hex");
  }

  // Compare the newly created hash with the stored hash
  return hash === storedHash;
}

// Example usage of custom hashing
const customExample = customHashPassword("Pass1234");
console.log("Custom Salt:", customExample.salt);
console.log("Custom Hash:", customExample.hash);

// Export both implementations
export {
  salt as bcryptSalt,
  hash as bcryptHash,
  customHashPassword,
  verifyCustomPassword,
};

