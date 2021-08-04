 /**
   * Routes for resources
   */
  const mainUri = 'https://pokeapi.co/api/v2/pokemon/{id}';
  const svgUri  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/{id}.svg';
  const pngUri  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png';

  const list = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898"

  const test = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10"

  const tiposES = new Map()

    tiposES.set("bug","Bicho")
    tiposES.set("dragon","Dragón")
    tiposES.set("electric","Eléctrico")
    tiposES.set("fairy","Hada")
    tiposES.set("fighting","Lucha")
    tiposES.set("fire","Fuego")
    tiposES.set("flying","Volador")
    tiposES.set("ghost","Fantasma")
    tiposES.set("grass","Planta")
    tiposES.set("ground","Tierra")
    tiposES.set("ice","Hielo")
    tiposES.set("normal","Normal")
    tiposES.set("poison","Veneno")
    tiposES.set("psychic","Psíquico")
    tiposES.set("rock","Roca")
    tiposES.set("steel","Acero")
    tiposES.set("water","Agua")
    tiposES.set("dark","Siniestro")

  /**
   * 
   * @returns object pokemons list
   */
  const all = async() => {
    
    const fetchIng = await fetch( list )
    const response = await  fetchIng.json();
    let pokemon 
    const arr = []

    const len = response.results.length
    let i 

    for(i = 0;i<len;i++){
      pokemon = await pokeSearch(i+1)
      arr.push({
        "id": i+1,
        "name": response.results[i].name,
        "url": response.results[i].url,
        "svg": svgUri.replace("{id}",i+1),
        "png":pngUri.replace("{id}",i+1),
        "types": typeFormat(pokemon.types),
        "weight": weightFormat(pokemon.weight),
        "height": heightFormat(pokemon.height)
      })
    }

    
    return arr;

  }

  const typeFormat = types =>{
    let i 
    const len = types.length

    const arr = []

    for(i = 0; i<len;i++){

      arr.push(tiposES.get(types[i].type.name))
    }

    return arr
  }

  const pokeSearch = async id =>{
    const poke = await fetch(mainUri.replace("{id}",id))

    return poke.json()
  }

  const weightFormat = weight => (weight/10)+" kg"

  const heightFormat = height => (height/10)+" m"


  const findByName = (name,arr) => {

    const value = arr.find(e => e.name === name)

    return value? value:{}
  } 
  /**
   * Loading DOM with pokemons list
   */
  const LoadDom = async()=>{
    const Pokemons = await all();
    const poketest = findByName("charizard",Pokemons)
    const doc = document.querySelector(".ola")

    const len = Pokemons.length

    const obj = {
      "count":len,
      "results": Pokemons
    }

    
    doc.innerHTML += JSON.stringify(obj)

    console.log(obj)
    
  }

  LoadDom();