import process from "process";

const api_key = process.env.API_KEY;
const firebase_key = process.env.FIREBASE_KEY;

const url = 'https://receitaws.com.br/v1/cnpj/';
const database_url = 'https://api.brasil.io/v1/dataset/socios-brasil/empresas/data/?search=&cnpj=&uf=SP&page_size=200';

function get_email_by_cnpj(cnpj) {
    let data = null;

    fetch(url + cnpj)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        return response.json();
      })
      .then(response_data => {
        if(response_data != null) {
          let email = response_data.email;

          save_data(cnpj, response_data.municipio, email);
            if(response_data.municipio == 'Louveira') {
                console.log("its work");
            } else {
                console.log(response_data.municipio);
            }

            console.log(response_data.email);
        } else {
            console.log("data is null");
        }

        data = response_data;
      })
      .catch(error => {
        //console.error('Erro:', error);
        console.log('exception!');
      });    

      return data;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_database() {
    fetch(database_url, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${api_key}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    return response.json();
  })
  .then(async data => {
    let i = 0;
    for(; i < 200; i++) {
      let db_d = await db_get(data.results[i].cnpj);

      if(db_d == null) {
        get_email_by_cnpj(data.results[i].cnpj);
        await sleep(15000);
      } else {
        console.log("exists in fibase! (ignore)");
      }
    }

    console.log("end all requires");
  })
  .catch(error => {
    //console.error('Erro:', error);
  });
}

get_database();

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";

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

function save_data(cnpj, municipio, email) {
  let database = getDatabase();

  //console.log(email);

  set(ref(database, cnpj), {
    municipio: municipio,
    email: email
  });
}

async function db_get(cnpj) {
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
}

console.log('hello, node');
