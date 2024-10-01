let corpos = [];

//Criei uma lista em array para armazenar os favoritos 
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//Isso aqui foi pra mudar o H1 de acordo com a filtragem do Usuario 
let reference = document.getElementById('referencia');

function fetchMostraPlanetas() {
    fetch(`https://api.le-systeme-solaire.net/rest/bodies/`)
        .then(function(response) {
            return response.json(); 
        })
        .then(function(data) {
            const listaPlanetas = document.getElementById('planetas');
            corpos = data.bodies;

            
            function planets(planets) {
                
                listaPlanetas.innerHTML = '';

                planets.slice(0, 10).forEach(function(body) {
                    const bodyItem = document.createElement('li');
                    bodyItem.classList.add('bodyItem')

                    bodyItem.innerHTML = `
                        <h2>${body.englishName} ${favorites.includes(body.englishName) ? '★' : ''}</h2>

                        <p><strong>Tipo:</strong> ${body.isPlanet ? 'Planeta' : 'Corpos'}</p>

                        <p><strong>Diâmetro:</strong> ${body.meanRadius} km</p>
                        


                        <button class="favorito" data-name="${body.englishName}">
                            ${favorites.includes(body.englishName) ? 'Eu odiei' : 'Isso é legal'}
                        </button>
                        
                    `;

                    bodyItem.addEventListener('click', function() {
                        exibirDetalhes(body); //Adiciona o evento de clique para surgir as informações
                    });
                    
                    listaPlanetas.appendChild(bodyItem);
                });



                //Procuro todos os elementos na DOM que tem essa classe ai
                const favoriteButtons = document.querySelectorAll('.favorito');
                //Pra cada botão, ele adiciona um evento de click, onde executa a função que eu defini ali embaixo. Só procurar que tu acha <3
                favoriteButtons.forEach(button => {
                    button.addEventListener('click', favoritar);
                });
            }

            
            planets(corpos);

            //Defini a filtragem para planetas, buscando o botão que ta la no HTML chamdado isso ai que ta embaixo.
            document.getElementById('filtroPlaneta').addEventListener('click', function() {
                //Caso a condiçõo isPlanet esteja correta, esse item vai para a array planetasFiltrados
                const planetasfiltrados = corpos.filter(body => body.isPlanet); 
                planets(planetasfiltrados);
                reference.innerHTML = 'Planetas';
            });

            //Mesma coisa só que com corpos
            document.getElementById('filtroCorpos').addEventListener('click', function() {
                const corposfiltrados = corpos.filter(body => body.isPlanet === false); 
                planets(corposfiltrados); 
                reference.innerHTML = 'Corpos';
            });
        })

        //Se tiver erro vai dar erro
        .catch(function(error) {
            console.error(error);
        });
}

//Função criada para favoritar os itens aí
function favoritar(event) {
    //Adiciona um evento para extrair o valor (O nome) de onde o botão favorito foi clicado
    const planetName = event.target.getAttribute('data-name');
    //Caso o planeta esteja na lista, ele faz uma limpeza e só coloca os itens favoritos menos o que você acabou de clicar
    if (favorites.includes(planetName)) {
        favorites = favorites.filter(name => name !== planetName); 
    //Caso não esteja na lista, ele da um push no item para a array favorites
    } else {
        favorites.push(planetName); 
    }
    //Transforma a array em texto JSON antes de salvar no local storage do navegador
    localStorage.setItem('favorites', JSON.stringify(favorites)); 
    fetchMostraPlanetas(); 
}

//Função para das os detalhes pra quem é curioso
function exibirDetalhes(body) {
    const detalhesDiv = document.getElementById('detalhes');
    
    detalhesDiv.innerHTML = `
        <h3>Detalhes de ${body.englishName}</h3>
        <p><strong>Gravidade:</strong> ${body.gravity} m/s²</p>
        <p><strong>Descoberto por:</strong> ${body.discoveredBy ?  body.discoveredBy: 'Desconhecido'}</p>
        <p><strong>Data de Descoberta:</strong> ${body.discoveryDate ? body.discoveryDate: 'Desconhecida'}</p>
        <p><strong>Orbita ao redor de:</strong> ${body.aroundPlanet ? body.aroundPlanet.planet : 'Nenhum'}</p>
    `;
}


fetchMostraPlanetas();