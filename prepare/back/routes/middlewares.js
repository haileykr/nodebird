exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {//passport-provided!
        next();
    } else {
        res.status(401).send('Login Required.');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {//passport-provided!
        next();
    } else {
        res.status(401).send('No access to logged-in user.');
    }
}