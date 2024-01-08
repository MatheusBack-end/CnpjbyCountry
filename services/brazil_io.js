const process = require('process');

const api_key = process.env.API_KEY;
const base_url = 'https://api.brasil.io/v1/dataset/socios-brasil/empresas/data/';

async function get_cnpjs(state, size) {
  let compose_url = `${base_url}?search=&cnpj=&uf=${state}&page_size=${size}`;

  let request = await fetch(compose_url, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${api_key}`,
      'Content-Type': 'aplication/json'
    }
  })

  .then(response => {
    if(!response.ok) {
      throw new Error(`Error on request: ${response.status}`);
    }

    return response.json();
  })

  .then(data => {
    return data;
  })

  .catch(error => {
    console.log(error);

    return null;
  });

  console.log(request.results);
  return request?.results;
}

get_cnpjs('SP', 200);
