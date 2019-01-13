import { Constants } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';

class Firebase {
  constructor(config = {}) {
    firebase.initializeApp(config);
    this.firestore = firebase.firestore();
    this.firestore.settings({ timestampsInSnapshots: true });
  }

  async getItems() {
    return this.firestore.collection('items').orderBy('createdAt', 'asc').get();
  }

  addItem = async (content) => {
    return this.firestore.collection('items').add({
      content,
      createdAt: new Date(),
    }).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  completeItem = async (item) => {
    this.firestore.collection('items').doc(item.itemId).delete()
    .then(() => {
      console.log('Document successfully delete!');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
