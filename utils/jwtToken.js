const sendToken = function (user, statusCode, res) {
  const token = user.getJwtToken();

  // Set token in cookies
  const options = {
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
    httpOnly: true, // Prevents JavaScript access to the cookie
  };

  res.cookie("token", token, options); // Set the cookie with the token
  res.status(statusCode).send({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
