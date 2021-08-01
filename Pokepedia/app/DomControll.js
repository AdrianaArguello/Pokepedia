/**
 * @param Grid : Response, example Grid in /test/FetchingData.js
 */

(function(Grid){
  
  Grid.Offline(); 
  const Pokemons = Grid;
  const CardsPerPages = 6;

  /**
   * 
   * @returns Pokemon Card template html
   */
  const LoadGridPokemons = ()=>{

    const PokemonsCards = Pokemons.results.map(pokemon => {
      const template = `
      <div data-id="${pokemon.id}" class="col animado pokemonCol">
        <div class="card text-center border-4">
          <img src="${pokemon.png}" class="card-img-top" alt="${pokemon.name}">
          <div class="card-body">
            <img class="pokeball" src="./img/svgs/pokeball.svg" alt="pokeball">
            <h5 class="card-title text-capitalize">
              <strong>${pokemon.name}</strong>
            </h5>
          </div>
        </div>
      </div>`;
      return template;
    });

    return PokemonsCards;
  }

  /**
   * 
   * @returns Nav pagination template
   */
  const LoadPagination = ()=>{

    const PokemonsCount = Pokemons.results.length;

    let template = `<ul id="PokemonsPagination" class="pagination pagination-sm justify-content-center">`;
        template += `<li id="PrePage" class="page-item">
                      <a class="page-link" href="#PokemonsPagination" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>`;

      for(let i = 1; i<=(PokemonsCount/CardsPerPages);i++)
        template += `<li class="page-item MovePage ${i<11?'showPage':'d-none'}"
                          data-init="${(i*CardsPerPages) - CardsPerPages}" data-end="${i*CardsPerPages}">
                          <a class="page-link" href="#PokemonsGrid">${i}</a>
                      </li>`;
        template += `
                    <li class="page-item" id="NextPage">
                      <a class="page-link" href="#NextPage" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                      </a>
                    </li>`;

      template += `</ul>`;

    return template;
  }
  /**
   * load DOM events
   */
  const LoadEvents = ()=>{
    
    const BtnPagination = document.querySelectorAll('.MovePage');
    const BtnNextPage   = document.querySelector('#NextPage');
    
    BtnPagination.forEach((value)=>{
      value.onclick = function(){
        const Start  = this.dataset.init;
        const End    = this.dataset.end;
        LoadDom(Start,End);
      }
    });

    BtnNextPage.onclick = function(){
      
    }

  }

  /**
   * Loads the entire grid according to an interval
   * @param {*} start 
   * @param {*} end 
   */

  const LoadDom = (start,end)=>{

    const PokemonContainer        = document.querySelector('.PokemonsGrid');
    const paginationContainer     = document.querySelector('.navigation');
    const Datalist                = document.querySelector('#DataListPokemon');

    const PokemonsCards           = LoadGridPokemons();
    const PokemonsPagination      = LoadPagination();

    PokemonContainer.innerHTML    = PokemonsCards.slice(start,end).join(" ");
    paginationContainer.innerHTML = PokemonsPagination;

    Datalist.innerHTML = Pokemons.results.map( pokemon => `<option data-id="${pokemon.id}" value="${pokemon.name}"></option>`)
                          .join(" ");

    LoadEvents();
  }


  LoadDom(0,CardsPerPages);

})(Grid);