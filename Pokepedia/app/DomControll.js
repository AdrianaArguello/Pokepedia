/**
 * @param Grid : Response, example Grid in app/data.js
 */

(function(Grid){
  
  const Pokemons = Grid;
  const CardsPerPages = 6;

  const PokemonCard = function(pokemon){
    const {id,name,png,weight,height,types} = pokemon;
    const template = `
    <div data-id="${id}" class="col-md-4 pokemonCol">
      <div class="card text-center border-4 h-100">
        
        <div class="flip-box-front h-100">
          <img src="${png}" class="card-img-top" alt="${name}">
          <div class="card-body">
            <img class="pokeball" src="./img/svgs/pokeball.svg" alt="pokeball">
            <h5 class="card-title text-capitalize">
              <strong>${name}</strong>
            </h5>
          </div>
        </div>

        <div class="flip-box-back h-100 d-none">
          <img src="${png}" class="card-img-top" alt="${name}">
          <div class="card-body">
            <strong>Tipo</strong>: ${types.join(", ")}.<br>
            <strong>Peso</strong>: ${weight}.<br>
            <strong>Altura</strong>: ${height}.<br>
          </div>
        </div>
        
      </div>
    </div>
    `;
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
        template += `<li class="page-item MovePage ${i<11?'showPage':'d-none'} ${i==1? 'active': ''}"
                          data-init="${(i*CardsPerPages) - CardsPerPages}" data-end="${i*CardsPerPages}">
                          <a class="page-link" href="#pagination">${i} </a>
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
  let LoadEvents = ()=>{
    
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
        BtnActivePage.classList.remove('active')
        BtnActivePage = (this);
        LoadPokemonsGridDOM(Start,End);
        OverideEvents.FlixCard();
        BtnActivePage.classList.add('active')
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
      OverideEvents.FlixCard();
    });

    const OverideEvents = {
      FlixCard : function(){
        const PokemonCardFront        = document.querySelectorAll('.flip-box-front');
        const PokemonCardBack         = document.querySelectorAll('.flip-box-back');
        
        PokemonCardFront.forEach( (pokemonCardFront,index) =>{
          pokemonCardFront.onmouseover = function(){
            this.classList.add('d-none')
            PokemonCardBack[index].classList.remove('d-none');
          }
          PokemonCardBack[index].onmouseleave = function(){
            this.classList.add('d-none');
            pokemonCardFront.classList.remove('d-none');
          }
        })
      },
      main : function(){
        this.FlixCard();
      }
    }

    return OverideEvents;

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
  LoadEvents = LoadEvents();
  LoadEvents.main();

})(Grid);