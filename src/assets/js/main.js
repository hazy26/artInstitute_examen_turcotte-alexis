import '../css/style.css';

const nextBtn = document.querySelector('.next-btn');
const previousBtn = document.querySelector('.previous-btn');
const firstPageBtn = document.querySelector('.first-page-btn');
const lastPageBtn = document.querySelector('.last-page-btn');
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
const artworksList = document.querySelector('#artworks-list');
const totalPages = document.querySelector('.total-pages');
const currentPage = document.querySelector('.current-page');

const savedSearches = [];
const savedSearchesHtml = document.querySelector('.saved-searches');

function initiateDetailsBtn(){
  const detailsBtns = document.querySelectorAll('.details-btn');
  const closeBtns = document.querySelectorAll('.close-btn');

  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-modal'));
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.id);
    })
  })
}

function openModal(id){
  const artworkDetails = document.querySelectorAll('.artwork-details')
  for(let i = 0; i < artworkDetails.length; i++){
    if(id == artworkDetails[i].id){
      artworkDetails[i].classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');
    }
  }
}

function searchArtwork(){
  const searchValue =  searchInput.value.toLowerCase();
  const url = `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}`;
  fetchUrl(url);

  savedSearches.push(searchValue);
  console.log(savedSearches);
  localStorage.setItem('search', JSON.stringify(savedSearches));
  savedSearches.forEach(searches => {
    savedSearchesHtml.innerHTML += `<li>${searches}</li>`;
  })
}

function fetchUrl(url){
  fetch(url).
  then(response => response.json()).then(data => {

    //console.log(data);

    if(data.pagination.next_url){
      nextBtn.setAttribute('data-url', data.pagination.next_url);
    }

    if(data.pagination.prev_url){
      previousBtn.setAttribute('data-url', data.pagination.prev_url);
    }

    firstPageBtn.setAttribute('data-url', `https://api.artic.edu/api/v1/artworks?page=1`);
    lastPageBtn.setAttribute('data-url', `https://api.artic.edu/api/v1/artworks?page=${data.pagination.total_pages}`);
    currentPage.textContent = data.pagination.current_page;
    totalPages.textContent = data.pagination.total_pages;

    artworksList.innerHTML = "";
    data.data.forEach(data => {
    artworksList.innerHTML += 
    `<li class="rounded-md bg-slate-800 border-4 border-white">

      <figure class="rounded-t-sm">
        <img class="rounded-t-sm w-full h-80 object-cover" src="https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg" alt="">
      </figure>

      <div class="p-3 flex flex-col gap-4 items-center justify-between text-center text-slate-200 tracking-wide">
        <h2 class="pb-6 text-xl font-bold tracking-wider">${data.title}</h2>
        <button data-modal="${data.id}" class="details-btn bg-slate-200 border-2 border-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-400">Voir les détails</button>  
      <div>
  
      <div id="${data.id}" class="hidden artwork-details fixed overflow-scroll top-0 left-0 bg-slate-900 h-dvh w-dvw flex flex-col gap-8 px-4 py-8">
        <button id="${data.id}" class="close-btn text-2xl self-end hover:text-slate-500">X</button>
        <h3 class="text-xl font-bold tracking-wide max-w-[400px] self-center">${data.title}</h3>
        <figure class="self-center">
          <img class="border-4 border-white" src="https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg" alt="">    
        </figure>
        <div class="text-left flex flex-col gap-3 self-center pb-4 text-lg max-w-[680px]">
          <p class="font-light tracking-wider">Artiste: <span class="font-medium">${data.artist_title}</span></p>
          <p class="font-light tracking-wider">Date de création: <span class="font-medium">${data.date_end}</span></p>
          <p class="font-light tracking-wider">Description: ${data.description}</p>
          <p class="font-light tracking-wider">Termes: ${data.term_titles}</p>
          <p class="font-light tracking-wider">Matériel utilisé: ${data.material_titles}</p> 
        </div>
        <button id="${data.id}" class="close-btn bg-slate-200 border-2 border-slate-200 text-lg tracking-wide text-slate-900 w-fit rounded-md px-4 py-2 self-center hover:bg-slate-400 hover:border-slate-100">Close</button>
      </div>

    </li>`;
    initiateDetailsBtn();
    });
  })
}
fetchUrl('https://api.artic.edu/api/v1/artworks');

[nextBtn, previousBtn, firstPageBtn, lastPageBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-url');
    if(url != 'null'){
      fetchUrl(url);
    }
  });
});

/* searchInput.addEventListener('input', () => {
  searchArtwork();
}); */

searchBtn.addEventListener('click', () => {
  searchArtwork();
})

