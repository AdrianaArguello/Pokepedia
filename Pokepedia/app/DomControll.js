/**
 * @param Grid : Response, example Grid in app/data.js
 */

(function(Grid){
  
  const Pokemons = Grid;
  const CardsPerPages = 6;

  const PokemonCard = function(pokemon){
    const {id,name,png} = pokemon;
    const template = `
      <div data-id="${id}" class="col animado pokemonCol">
        <div class="card text-center border-4">
          <img src="${png}" class="card-img-top" alt="${name}">
          <div class="card-body">
            <img class="pokeball" src="./img/svgs/pokeball.svg" alt="pokeball">
            <h5 class="card-title text-capitalize">
              <strong>${name}</strong>
            </h5>
          </div>
        </div>
      </div>`;
    return template;
  };

  /**
   * 
   * @returns Pokemon grid template html
   */
  const LoadGridPokemons = ()=>{

    const PokemonsCards = Pokemons.results
           .map(pokemon => PokemonCard(pokemon));
    return PokemonsCards;
  }

  /**
   * 
   * @returns Nav pagination template
   */
  const LoadPagination = ()=>{

    const PokemonsCount = Pokemons.count;

    let template = `<ul id="PokemonsPagination" class="pagination pagination-sm justify-content-center">`;
        template += `<li id="PrePage" class="page-item">
                      <a class="page-link" href="#pagination" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>`;

      for(let i = 1; i<=(PokemonsCount/CardsPerPages) + 1;i++)
        template += `<li class="page-item MovePage ${i<11?'showPage':'d-none'}"
                          data-init="${(i*CardsPerPages) - CardsPerPages}" data-end="${i*CardsPerPages}">
                          <a class="page-link" href="#pagination">${i}</a>
                      </li>`;
        template += `
                    <li class="page-item" id="NextPage">
                      <a class="page-link" href="#pagination" aria-label="Next">
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
    
    const BtnPagination   = document.querySelectorAll('.MovePage');
    const BtnNextPage     = document.querySelector('#NextPage');
    const BtnBackPage     = document.querySelector('#PrePage');
    const InputFindByName = document.querySelector('#searchPokemon');
    const FormFindByName  = document.querySelector('.FormFindByName');
    let BtnActivePage     = BtnPagination[0];

    BtnPagination.forEach((value)=>{
      value.onclick = function(){
        const Start  = this.dataset.init;
        const End    = this.dataset.end;
        BtnActivePage = (this);
        LoadPokemonsGridDOM(Start,End);
      }
    });
    /**
     * 
     * @param {*} procedure : callback( pointer , btnVisibles ) => boolean 
     * @returns 
     */
    const MovePointer = function(procedure){
      let btnPagination = [...BtnPagination];
      const pointer     = {start:0,end:0};

      btnPagination = btnPagination
        .filter( (btnPage) => btnPage
                      .classList.contains('showPage'));
      
      if( procedure(pointer,btnPagination) ){
        return;
      }

      btnPagination.forEach( btnPage => {
        btnPage.classList.remove('showPage');
        btnPage.classList.add('d-none');
      });

      btnPagination = [...BtnPagination].slice(pointer.start,pointer.end);
      btnPagination[0].onclick();

      btnPagination.forEach( (BtnPage) => {
          BtnPage.classList.remove('d-none');
          BtnPage.classList.add('showPage');
        });
    }

    BtnNextPage.addEventListener('click', function(){
      MovePointer(
        /**
         * 
         * @param {*} pointer 
         * @param {*} btnPagination 
         * @returns boolean
         */
        function(pointer,btnPagination){
          pointer.start = [... BtnPagination]
                            .indexOf(
                              btnPagination[btnPagination.length -1 ]
                            ) + 1;
          pointer.end   = pointer.start + 10;
          return pointer.start == Math.round(Pokemons.count/ 6+1)-1;
        }
      );
    });

    BtnBackPage.addEventListener('click',function(){
      MovePointer(
        /**
         * 
         * @param {*} pointer 
         * @param {*} btnPagination 
         * @returns 
         */
        function(pointer,btnPagination){
          pointer.end = ( [... BtnPagination]
                          .indexOf(
                            btnPagination[btnPagination.length -1 ]
                          ) + 1 ) - 10;
          pointer.start   = pointer.end - 10;
          return pointer.start == -10
        }
      );
    });

    InputFindByName.addEventListener('input',function(e){
      if(!e.target.value){
        BtnActivePage.onclick();
      }
    });

    FormFindByName.addEventListener('submit',function(e){
      e.preventDefault();
      const PokemonName          = InputFindByName.value.toLowerCase();
      const pokemon              = Pokemons.findByName(PokemonName);
      const PokemonContainer     = document.querySelector('.PokemonsGrid');
      PokemonContainer.innerHTML = pokemon == null? '': PokemonCard(pokemon);
    })

  }

  /**
   * Loads the entire Pokemon's grid according to an interval
   * @param {*} start 
   * @param {*} end 
   */
  const LoadPokemonsGridDOM = (start,end)=>{
    const PokemonContainer        = document.querySelector('.PokemonsGrid');
    const PokemonsCards           = LoadGridPokemons();
    PokemonContainer.innerHTML    = PokemonsCards.slice(start,end).join(" ");
  }
  /**
   * Load DOM only once
   */
  const LoadDOM = ()=>{
    const paginationContainer     = document.querySelector('.navigation');
    const Datalist                = document.querySelector('#DataListPokemon');
    const PokemonsPagination      = LoadPagination();
    paginationContainer.innerHTML = PokemonsPagination;
    Datalist.innerHTML = Pokemons.results
      .map( 
        pokemon => 
        `<option data-id="${pokemon.id}" value="${pokemon.name}"></option>`
      )
    .join(" ");
  }
  LoadPokemonsGridDOM(0,CardsPerPages);
  LoadDOM();
  LoadEvents();

})(Grid);