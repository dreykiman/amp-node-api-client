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

const getconfig = (confname) => {
  return db.collection('config').doc(confname).get()
    .then(doc => doc.exists ? doc.data() : {})
}

const getprices = db.collection('maker').doc('prices').get()
  .then(doc => doc.exists ? doc.data() : {})

const getspreadmap = db.collection('maker').doc('spreads').get()
  .then(doc => doc.exists ? doc.data() : {})

export {getspreadmap, getprices, getconfig}
