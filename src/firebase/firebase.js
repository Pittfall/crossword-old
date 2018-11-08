import * as firebase from "firebase";

import { FirebaseConfig } from "./config/keys";

firebase.initializeApp(FirebaseConfig);

const databaseRef = firebase.database().ref();
export const squareValues = databaseRef.child("squareValues");

export const getSavedCrosswordValues = () => {
   return new Promise((resolve) => {
      squareValues.on('value', snapshot => {
         resolve(snapshot.val());
      });
   });
}