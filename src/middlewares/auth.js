const adminAuth = (req, res, next) => {
    console.log("Admin Auth Middleware executed");
     const isAuthorized = true; 
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

const userAuth = (req, res, next) => {
    console.log("User Auth Middleware executed");
     const isAuthorized = true; 
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = { adminAuth, userAuth };