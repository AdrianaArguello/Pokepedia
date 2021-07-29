/** 
 * Main mehtod
 */
( function(){
  
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
  /**
   * Loading DOM with pokemons list
   */
  const LoadDom = async()=>{

    const PokemonContainer = document.querySelector('.PokemonsGrid');
    const Pokemons = await all();
    
    Pokemons.results.forEach(pokemon => {
      const template = `
        <div data-id="${pokemon.id}" class="col animado">
          <div class="card text-center border-4">
            <img src="${pokemon.png}" loading="lazy" class="card-img-top" alt="${pokemon.name}">
            <div class="card-body">
              <img class="pokeball" loading="lazy" src="./img/svgs/pokeball.svg" alt="pokeball">
              <h5 class="card-title text-capitalize">
                <strong>${pokemon.name}</strong>
              </h5>
            </div>
          </div>
        </div>
      `;
      PokemonContainer.insertAdjacentHTML('beforeend',template);
    });

  }

  LoadDom();

} )();