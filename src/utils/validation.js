const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  const email = (emailId || "").trim().toLowerCase();

  if (!firstName || !lastName) {
    throw new Error("First Name and Last Name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email Id is invalid");
  } else if (!email.endsWith("@gmail.com")) {
    throw new Error("Email must be a gmail.com address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = {
  validateSignupData,
};