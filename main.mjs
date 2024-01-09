import process from "process";
import { get_data, set_cnpj } from './services/firebase.mjs';
import { get_data_from_cnpj } from './services/receita_federal.mjs';
import { get_cnpjs } from './services/brazil_io.mjs';

let cnpj_pool = []
const request_rate = 10000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clear_pool() {
  for(let i = 0; i < cnpj_pool.length; i++) {
    let cnpj = cnpj_pool[i];
    let data = await get_data_from_cnpj(cnpj);

    if(data == null) {
      await sleep(request_rate);
      continue;
    }

    await set_cnpj(data.email, data.municipio, cnpj);
    console.log(`save in database ${cnpj}`);
    cnpj_pool[i] = null;

    await sleep(request_rate);
  }

  asort_array();

  if(cnpj_pool.length > 0) {
    console.log(`init pool, length: ${cnpj_pool.length}`)
    await clear_pool();
  } else {
    console.log('end page');
    process.exit();
  }
}

function asort_array() {
  for(let i = 0; i < cnpj_pool.length; i++) {
    if(cnpj_pool[i] == null) {
      cnpj_pool.splice(i, 1);
      i--;
    }
  }
}

async function main() {
  const size = 200;
  const cnpjs = await get_cnpjs('SP', 2, size);

  for(let i = 0; i < size; i++) {
    let cnpj = cnpjs[i].cnpj;

    if(await get_data(cnpj) == null) {
      let data = await get_data_from_cnpj(cnpj);

      if(data == null) {
        cnpj_pool.push(cnpj);
        await sleep(request_rate);

        continue;
      }

      await set_cnpj(data.email, data.municipio, cnpj);
      console.log(`save in database ${cnpj}`);

      await sleep(request_rate);
    } else {
      console.log(`exist in database ${i}`);
    }
  }

  if(cnpj_pool.length > 0) {
    console.log(`init pool, length: ${cnpj_pool.length}`); 

    await clear_pool();
  }

  console.log('end page');
  process.exit();
}

main();
