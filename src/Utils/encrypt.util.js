const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * 
 * Compares a plain text password with a hashed password using bcrypt.
 * @async
 * @param {Object} options - The options object.
 * @param {string} options.plainPassword - The plain text password to compare.
 * @param {string} options.hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the passwords match.
 * 
 */

const comparePassword = async ({ plainPassword, hashedPassword }) => {
  const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isPasswordMatch
};



/**
*  

* - `@param {string} user.username`: Specifies the `username` property of the `user` object as a string.
* - `@param {string} user.email`: Specifies the `email` property of the `user` object as a string.
* - `@param {string} user.id`: Specifies the `id` property of the `user` object as a string.
* - `@returns {string}`: Specifies the return type as a string.
* 
*/
const createAccessToken=({username , email , id})=>{
        const accessToken = jwt.sign(
        {
          user: {
            username: username,
            email: email,
            id: id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    return accessToken
}

module.exports = {
    comparePassword , createAccessToken
};
