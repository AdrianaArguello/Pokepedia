/** 
 * Main mehtod
 */
const requests = ( function(){
  
  /**
   * Routes for resources
   */
  const mainUri = 'https://pokeapi.co/api/v2/pokemon/{id}';
  const svgUri  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/{id}.svg';
  const pngUri  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png';

  /**
   * 
   * @returns object pokemons list
   */
  const all = async() => {
    
    const fetchIng = await fetch( mainUri.replace('{id}','') )
    const response = await fetchIng.json();
    
    response.results = response.results.map( pokemon => {
      
      let id      = pokemon.url.split("/");
      id          = id[id.length - 2];

      pokemon.id  = id;
      pokemon.svg = svgUri.replace('{id}',id);
      pokemon.png = pngUri.replace('{id}',id);
      return pokemon;
    })
    
    return response;

  }

  return {all};

} )();