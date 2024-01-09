const base_url = 'https://receitaws.com.br/v1/cnpj/';


export async function get_data_from_cnpj(cnpj) {
  let request = await fetch(`${base_url}${cnpj}`)

  .then(response => {
    if(!response.ok) {
      if(response.status == 429) {
        console.log('too many requests');
      } else {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
    }
        
    return response.json();
  })

  .then(data => {
    return data;
  })

  .catch(error => {
    return null;
  });

  return request;
}
