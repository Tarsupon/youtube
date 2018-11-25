const apiKey = 'AIzaSyAKKgr6RSYXPkxTFlju-sw80-0Hlh9pOmA';
const results = [];

/* Class that keeps information about video */
class Video {
    constructor(id, thumbnail, title, description, author, publicationDate, viewRate) {
      [this._id, this._thumbnail, this._title, this._description, this._author, this._publicationDate, this._viewRate] =
      [id, thumbnail, title, description, author, publicationDate, viewRate];
    }
  
    set id(value) {
      this._id = value;
    }
  
    get id() {
      return this._id;
    }
  
    set thumbnail(value) {
      this._thumbnail = value;
    }
  
    get thumbnail() {
      return this._thumbnail;
    }
  
    set title(value) {
      this._title = value.replace(/\u00a0/g, " "); /* Replace npsp with regular spaces */
    }
  
    get title() {
      return this._title;
    }
  
    set description(value) {
      this._description = value.slice(0, 100).concat('...');
    }
  
    get description() {
      return this._description;
    }
  
    set author(value) {
      this._author = value;
    }
  
    get author() {
      return this._author;
    }
  
    set publicationDate(value) {
      this._publicationDate = new Date(value);
    }
  
    get publicationDate() {
      return this._publicationDate.toLocaleDateString("ru-RU");
    }
  
    set viewRate(value) {
      this._viewRate = value.replace(/(.)(?=(\d{3})+$)/g,'$1,'); /* Make format for decimals */
    }
  
    get viewRate() {
      return this._viewRate;
    }
  };

  const mainContainer = document.createElement('div');
  mainContainer.className = 'main-container';
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'search...';

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  const cardCourusel = document.createElement('div');
  cardCourusel.className = 'card-courusel';
  cardContainer.appendChild(cardCourusel);

  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';
  mainContainer.appendChild(sliderContainer);

  /* Functions to narrow search bar when hovered */
const minimize = () => {
    searchContainer.dataset.minimized = 'true';
  };
  
  /* Functions to expand search bar when hovered */
  const maximize = () => {
    searchContainer.dataset.minimized = 'false';
  };
  
  searchContainer.addEventListener('mouseover', maximize);
  
  searchContainer.addEventListener('mouseout', minimize);

  const searchBtn = document.createElement('img');
  searchBtn.classList.add('search-img');
  searchBtn.src = './img/search.svg';


/* Function to add 4 video cards to the DOM */
function renderResults() {
    for (let i = 0; i < 4; ++i) {
        const card = document.createElement('div');
        card.className = 'card';
        cardCourusel.appendChild(card);
        card.dataset.hidden = "false"; 
    }
    narrow(window.innerWidth);
  };
  /* Function to make more video cards visible on screen expand */
const expand = (width) => {
    let elements = cardCourusel.childNodes;
  
    if (width > 1200) {
      elements[3].dataset.hidden = 'false';
    }
  
    if (width > 900) {
      elements[2].dataset.hidden = 'false';
    }
  
    if (width > 600) {
      elements[1].dataset.hidden = 'false';
      }
  };
  
  /* Function to make less video cards visible on screen narrow */
  const narrow = (width) => {
    let elements = cardCourusel.childNodes;
  
    if (width < 1200) {
      elements[3].dataset.hidden = 'true';
    }
  
    if (width < 900) {
      elements[2].dataset.hidden = 'true';
    }
  
    if (width < 600) {
      elements[1].dataset.hidden = 'true';
      }
  };

  /* Function to control the ammount of video cards displayed */
    const windowControl = (width) => {
    width >= windowControl.prevWindowWidth ? expand(width) : narrow (width);
    windowControl.prevWindowWidth = width;
  };
  
  windowControl.prevWindowWidth = window.innerWidth;
  
  window.addEventListener('resize', () => windowControl(window.innerWidth));


  /* Function that clears content from all displayed video cards */
    const clearContent = () => {
    cardCourusel.childNodes.forEach((card) => {
      while (card.firstChild) {
        card.removeChild(card.firstChild);
      }
    });
  };

  /* Function to set content to video cards */
    const setContent = (from) => {
    clearContent();
    
    cardCourusel.childNodes.forEach((card) => {

      const image = document.createElement('img');
      image.classList.add('preview');
      image.src = results[from].thumbnail;
      card.appendChild(image);
  
      const title = document.createElement('a');
      title.classList.add('link');
      title.href = `https://www.youtube.com/watch?v=${results[from].id}`;
      title.textContent = results[from].title;
      card.appendChild(title);
  
      const author = document.createElement('div');
      author.className = 'author';
      card.appendChild(author);

      const authorImg = document.createElement('img');
      authorImg.className = 'author-img';
      authorImg.src = './img/person.svg';
      author.appendChild(authorImg);

      const spanAuthor = document.createElement('span');
      spanAuthor.classList.add('span-author');
      spanAuthor.textContent = results[from].author;
      author.appendChild(spanAuthor);

      const publDate = document.createElement('div');
      publDate.className = 'date';
      card.appendChild(publDate);

      const dateImg = document.createElement('img');
      dateImg.className = 'date-img';
      dateImg.src = './img/calendar.svg';
      publDate.appendChild(dateImg);

      const spanDate = document.createElement('span');
      spanDate.classList.add('span-date');
      spanDate.textContent = results[from].publicationDate;
      publDate.appendChild(spanDate);

      const views = document.createElement('div');
      views.classList.add('view-count');
      card.appendChild(views);

      const viewImg = document.createElement('img');
      viewImg.className = 'view-count-img';
      viewImg.src = './img/eye.svg';
      views.appendChild(viewImg);

      const spanCount = document.createElement('span');
      spanCount.classList.add('span-count');
      spanCount.textContent = results[from++].viewRate;
      views.appendChild(spanCount);

      const description = document.createElement('div');
      description.classList.add('description');
      description.textContent = results[from].description;
      card.appendChild(description);
    });
  };

  /* Function to reset page switches and video cards content */
    const toFirstPage = () => {
    let count = 0;
  
    sliderContainer.childNodes.forEach((pageSwitch) => {
      pageSwitch.dataset.pageNum = count;
      pageSwitch.textContent = ++count;
    });
  
    makeChecked(0);
    setContent(0);
  };
  
  /* Function to add 4 page switches to the DOM*/
  const renderPageSwitches = () => {
    for (let i = 0; i < 4; ++i) {
      const pageSwitch = document.createElement('div');
      pageSwitch.classList.add('point');
      if (!i) pageSwitch.classList.add('checked');
  
      sliderContainer.appendChild(pageSwitch);
    }
  };

/* Function that updates the numbers of page switches */
    const updatePageSwithes = (side) => {
    let value = side === 'right' ? 1 : -1;
  
    sliderContainer.childNodes.forEach((pageSwitch) => {
      pageSwitch.dataset.pageNum = +pageSwitch.dataset.pageNum + value;
      pageSwitch.textContent = +pageSwitch.textContent + value;
    });
  };

  /* Function that makes current page switch checked */
    const makeChecked = (currentSwitch) => {
    sliderContainer.childNodes.forEach((pageSwitch) => {
      pageSwitch.classList.remove('checked');
      if (pageSwitch.dataset.pageNum == currentSwitch) {
        pageSwitch.classList.add('checked');
      }
    });
  };

  /* Once executed function to show video cards on page load */
    const renderItems = (() => {
    let executed = false;
  
    return () => {
      if (!executed) {
        executed = true;
        renderResults();
        cardContainer.appendChild(cardCourusel);
        renderPageSwitches();
        mainContainer.appendChild(sliderContainer);
      }
    };
  })();

  /* Function to add recieved after request items to the results array */
    const getDetailsRequestUrl = (array) => {
    if (!array.length) {
      return Promise.reject("Can't get new url!");
    } else {
      return `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${array.map(video => video.id.videoId).join(',')}&part=snippet,statistics&fields=items(id,%20snippet(title,description,channelTitle,publishedAt,thumbnails(medium(url))),statistics(viewCount))`;
    }
  };

/* Function that creates and fills with information Video objects and adds them to results array */
    const fillResults = (array) => {
    if (!array.length) {
      return Promise.reject('No results!');
    } else {
      array.forEach((data) => {
        const video = new Video();
  
        [video.id, video.thumbnail, video.title, video.description, video.author, video.publicationDate, video.viewRate] =
        [data.id, data.snippet.thumbnails.medium.url, data.snippet.title, data.snippet.description, data.snippet.channelTitle, data.snippet.publishedAt, data.statistics.viewCount];
  
        results.push(video);
      });
      
      return Promise.resolve();
    }
  };

/* Adds animation when video cards appear */
    const appearAnim = () => {
     cardCourusel.style.animation = 'appear 0.5s linear';
    setTimeout(() => cardCourusel.style.animation = 'none', 500);
  };
  
  /* Adds animation when next page is clicked */
  const slideLeftAnim = () => {
    cardCourusel.style.animation = 'slideLeft 0.5s ease-in-out';
    setTimeout(() => cardCourusel.style.animation = 'none', 500);
  };
  
  /* Adds animation when previous page is clicked */
  const slideRightAnim = () => {
    cardCourusel.style.animation = 'slideRight 0.5s ease-in-out';
    setTimeout(() => cardCourusel.style.animation = 'none', 500);
  };

  /* Function to send http request */
const sendRequest = (url, nextPage) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
  
      xhr.addEventListener('timeout', () => {
        alert('Request Timeout!');
      });
  
      xhr.addEventListener('loadend', () => {
        if (xhr.status != 200) {
          alert(`Request failed. Error ${xhr.status}`);
          return;
        }
  
        sendRequest.pageToken = JSON.parse(xhr.responseText).nextPageToken || sendRequest.pageToken;
  
        resolve(JSON.parse(xhr.responseText).items);
      });
  
      if (nextPage) url += `&pageToken=${sendRequest.pageToken}`;
  
      xhr.open('GET', url, true);
      xhr.send();
    });
  };
  
  sendRequest.pageToken = '';

  /* Function to make request and call necessary functions depending on isNew option */
const makeRequest = (isNew) => {
    const idsRequestUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&maxResults=16&fields=nextPageToken,items(id(videoId))&q=${input.value}`;
  
    if (isNew) {
      results.length = 0;
      sliderControl.prevPage = 0;
      sendRequest(idsRequestUrl, false)
      .then(getDetailsRequestUrl)
      .then(detailsRequestUrl => sendRequest(detailsRequestUrl))
      .then(fillResults)
      .then(renderItems)
      .then(appearAnim)
      .then(toFirstPage)
      .catch(error => alert(`Error occured: ${error}`));
    } else {
      sendRequest(idsRequestUrl, true)
      .then(getDetailsRequestUrl)
      .then(detailsRequestUrl => sendRequest(detailsRequestUrl))
      .then(fillResults)
      .catch(error => alert(`Error occured: ${error}`));
  
      return Promise.resolve();
    }
  };

/* Function to control page switches behaviour */
    const sliderControl = (e) => {
    const pageNum = +e.target.dataset.pageNum;
  
    if (pageNum * 4 + 4 === results.length) {
      makeRequest(false)
      .then(setContent(pageNum));
      sliderControl.prevPage < pageNum ? slideLeftAnim() : slideRightAnim();
    } else {
      setContent(pageNum * 4);
      if (sliderControl.prevPage !== pageNum) {
        sliderControl.prevPage < pageNum ? slideLeftAnim() : slideRightAnim();
      }
    }
  
    if (e.target === sliderContainer.lastChild) {
      updatePageSwithes('right');
    }
  
    if (e.target === sliderContainer.firstChild && pageNum !== 0) {
      updatePageSwithes('left');
    }
  
    makeChecked(pageNum);
  
    sliderControl.prevPage = pageNum;
  };
  
  sliderControl.prevPage = 0;

  /* Function to control video cards and page switches content depending on page number */
sliderContainer.addEventListener('mouseup', (e) => sliderControl(e));

/* Function to make a request if search keyword was entered and if it wasn't the same */
const search = () => {
  if (input.value && input.value !== search.prevKeyword) {
    makeRequest(true);
    search.prevKeyword = input.value;
  }
};

search.prevKeyword = '';

/* Function to catch Enter key press */
input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});

/* Functions to catch search button click */
searchBtn.addEventListener('mouseup', (e) => search());
searchBtn.addEventListener('touchend', (e) => search());

/* Function to create page structure */
const renderPage = () => {
    document.body.appendChild(mainContainer);
    mainContainer.appendChild(searchContainer);
    searchContainer.appendChild(input);
    searchContainer.appendChild(searchBtn);
    mainContainer.appendChild(cardContainer);
};

renderPage();