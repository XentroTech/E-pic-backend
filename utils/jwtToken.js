const sendToken = function (user, statusCode, res) {
  const token = user.getJwtToken();

  res.status(statusCode).set("Authorization", `Bearer ${token}`).send({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
