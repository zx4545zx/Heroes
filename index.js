require('dotenv').config()
import './src/main.scss'

document.addEventListener('DOMContentLoaded', function () {
  let listHeroesDom = document.getElementById('list-heroes')
  let headerHero = document.querySelector('h1')
  let formHero = document.querySelector("#form-hero")
  let btnSubmitHero = document.querySelector('#btn-submit-hero')

  // let idHero = document.querySelector('.hero'); // !! Error Test
  // let formWrapper = document.querySelector('.form-wrapper');

  if (listHeroesDom == null) { return }
  let heroUrl = process.env.API_URL + "/heroes"
  formHero.setAttribute("action", heroUrl);
  fetch(heroUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    }
  }).then(resp => resp.json())
    .then(data => {
      addHeaderTitleToHeroesList(headerHero) //Head HeroList
      buildHeroDom(listHeroesDom, data) //Hero List

      // idHero.onclick = createHero(formWrapper,data,idHero); // !! Error Test

    })

  // Get all available jobs from backend
  let heroJobUrl = process.env.API_URL + "/hero_jobs"
  fetch(heroJobUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.API_CREDENTIAL
    }
  }).then(resp => resp.json())
    .then(data => {

      let jobWrapper = document.getElementById('job-wrapper')
      if (jobWrapper == null) { return }
      buildJobDropdown(jobWrapper, data)
    })

    // Click Submit Button
  btnSubmitHero.onclick = () => {
    console.log('make POST request');
    createHero();
  }

  // Create Hero
  function createHero() {
    let name = formHero.querySelector('#name').value;
    let job = formHero.querySelector('#job').value;
    let image = formHero.querySelector('#image').files[0];

    let formData = new FormData()
    formData.append('hero[name]', name);
    formData.append('hero[job]', job);
    formData.append('hero[image]', image);

    let createHeroUrl = heroUrl
    fetch(createHeroUrl, {
      method: "POST",
      headers: {
        'Authorization': process.env.API_CREDENTIAL
      },
      body: formData,
      mode:'cors'
    }).then(resp => resp.json())
      .then(data => {
        insertNewHero(listHeroesDom, data)
      })
  }

})

// Add new Hero to List
function insertNewHero(heroList, hero) {
  let htmlStr = `
      <div id="${hero.id}" class="hero"}">
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.level}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
        <div>${hero.job}</div>
      </div>
    `
  heroList.insertAdjacentHTML('afterbegin', htmlStr)
}

// Hero Job Dropdown
function buildJobDropdown(targetDom, data) {
  targetDom.insertAdjacentHTML('afterbegin', `
    <select id="job" name="hero[job]">
      ${data.jobs.map(item => { return `<option value=${item}>${item}</option>` })}
      <option value=""></option>
    </select>
  `)
}

// Head HeroList
function addHeaderTitleToHeroesList(targetDom) {
  targetDom.insertAdjacentHTML('afterend', `
    <div class="hero-header">
      <div>Name</div>
      <div>Level</div>
      <div>HP</div>
      <div>MP</div>
      <div>Job</div>
    </div>
  `)
}

// Show Hero List
function buildHeroDom(targetDom, data) {
  data.forEach(hero => {
    let htmlStr = `
      <div id="${hero.id}" class="hero"}">
        <a href="" class="hero-name">${hero.name}</a>
        <div>${hero.level}</div>
        <div>${hero.hp}</div>
        <div>${hero.mp}</div>
        <div>${hero.job}</div>
      </div>
    `
    targetDom.insertAdjacentHTML('beforeend', htmlStr)
  })
}

// !! Error Test
// function buildHeroProfile(targetDom,data,idHero) {
//   let htmlStr = `
//     <div class="hero-profile">
//       <div class="level-profile">${data.level}</div>
//       <img class="img-profile" src="${data.image}" alt="#">

//       <input type="text" id="name" name="hero[name]" placeholder="${data.name}"/>
//       <div id="job-wrapper"></div>

//       <div class="status-profile">
//         <label for="hp-txt">HP</label>
//         <div class="hp-profile">${data.hp}</div>
//         <label for="mp-txt">MP</label>
//         <div class="mp-profile">${data.mp}</div>
//       </div>
//     </div>
//     `
//     if (idHero.id == data.id) {
//       targetDom.insertAdjacentHTML('beforeend', htmlStr)
//     } else return
// }