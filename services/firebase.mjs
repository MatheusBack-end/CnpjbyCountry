import process from 'process';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';
const firebase_key = process.env.FIREBASE_KEY;

const firebaseConfig = {
  apiKey: firebase_key,
  authDomain: "cnpjbycountry.firebaseapp.com",
  projectId: "cnpjbycountry",
  storageBucket: "cnpjbycountry.appspot.com",
  messagingSenderId: "159502353043",
  appId: "1:159502353043:web:5a99508f8d2aa9fe95c366",
  measurementId: "G-K4JXSDZB9V"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function set_cnpj(email, city, cnpj) {
  let database = getDatabase();

  set(ref(database, cnpj), {
    municipio: city,
    email: email
  });
}

export async function get_data(cnpj) {
  const dbRef = ref(getDatabase());
  
  try {
    const snapshot = await get(child(dbRef, cnpj));

    if(snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  } catch(error) {
    console.log(error);
  }

  return null;
}
