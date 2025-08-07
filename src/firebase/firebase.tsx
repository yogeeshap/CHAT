import { db } from "./config";
import { collection, getDocs,addDoc } from "firebase/firestore";

export const getMessage = async (dbCollection:string) => {
    const querySnapshot = await getDocs(collection(db, dbCollection))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
    
export const sendMessage = async (messageBody:object,dbCollection:string) => {
    try {
      await addDoc(collection(db, dbCollection), messageBody);
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };
