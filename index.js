// Import required functions from Firebase functions and logger
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Define a Cloud Function to handle HTTP requests
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
