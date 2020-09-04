// import string from './models/Search'
// import { add as a, multiply as m, ID } from './views/searchView'
// import * as searchView from './views/searchView' 

// console.log(`Using imported function ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(searchView.ID, 4)}. ${string}`)
import axios from 'axios'

async function getResults(query) {
    try {
        const {data} = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${query}`)
        console.log(data.recipes)
    }catch(e) {
        alert(e)
    }

}

getResults('tomato')