import admin from "firebase-admin"
import serviceAccount from "../../amp-bot-configuration-firebase-adminsdk-gb92e-0886384295.json"
const databaseURL = "https://amp-bot-configuration.firebaseio.com"
const settings = {/* your settings... */ timestampsInSnapshots: true};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
})

const db = admin.firestore()
db.settings(settings);

const prices = db.collection('maker').doc('prices').get()
  .then(doc => doc.exists ? doc.data() : {})

export {prices}
