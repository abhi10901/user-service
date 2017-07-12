module.exports = {
    // Secret key for JWT signing and encription
    "secret": "JWT SECRET PASS",

    // Database connection information
    "database": "mongodb://127.0.0.1:27017/atsdb",

    // Setting port for server
    'port': process.env.PORT || 3000
}