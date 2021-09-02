async  function searchAnime(event){
     event.preventDefault()   
    try{
        const form = new FormData(this);
        const query = form.get("search");
        let response = await fetch(`https://api.jikan.moe/v3/search/anime?q=${query}&page=1`);         
        var result = await response.json();
        console.log(result);
        updateDom(result);
    }
    catch(err){
        alert(err);
    }
} 

function updateDom(data){
    const searchResults = document.getElementById('search-results');
    const animeByCategories = data.results
        .reduce((acc, anime)=>{

            const {type} = anime;
            if(acc[type] === undefined) acc[type] = [];
            acc[type].push(anime);
            return acc;
        }, {});

        searchResults.innerHTML = Object.keys(animeByCategories).map(key=>{
            const animesHTML = animeByCategories[key]
            .sort((a,b)=>a.episodes-b.episodes)
            .map(anime=>{
                return `
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="card-content">
                            <span class="card-title"><b>${anime.title}</b> </span>
                            <p>${anime.synopsis}</p>
                            <p><b>Start Date:</b>  ${anime.start_date}</p>
                            <p><b>End Date:</b>   ${anime.end_date}</p>
                            <p><b>IMDB rating:</b>   ${anime.score}</p>
                            
                        </div>
                        <div class="card-action">
                            <a href="${anime.url}">Find out more</a>
                        </div>
                    </div>
                `
            }).join("");

            return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="d-row">${animesHTML}</div>
                </section>
            `
        }).join("");
}

function pageLoaded(){
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchAnime);
}

window.addEventListener("load", pageLoaded);