/**
 * 
 * @param {*} check: default's valor is true
 */
Grid.__proto__.Offline = function (check = true){
    const uri = check? './img/sprites/':'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/';
    const svg = uri + 'dream-world/{id}.svg';
    const png = uri + 'official-artwork/{id}.png';
    
    this.results.forEach(result => {
      result.png = png.replace('{id}',result.id);
      result.svg = svg.replace('{id}',result.id);
    });
    
    console.log( check? 'now is offline' : 'now is online' );
}
/**
 * 
 * @param {*} PokemonName Pokemon's name
 * @returns Pokemon object
 */
Grid.__proto__.findByName = function(PokemonName){
  const pokemon = this.results.find(pokemon => pokemon.name === PokemonName );
  return pokemon? pokemon:null;
}
//Grid.Offline();