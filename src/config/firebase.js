import admin from "firebase-admin";
import { firebaseJson } from "./firebase-service-account.js";

const __dirname = new URL('.', import.meta.url).pathname;

const serviceAccount = firebaseJson

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;