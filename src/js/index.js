// import string from './models/Search'
// import { add as a, multiply as m, ID } from './views/searchView'
// import * as searchView from './views/searchView' 

// console.log(`Using imported function ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(searchView.ID, 4)}. ${string}`)
import Search from './models/Search'
import * as searchView from './views/searchView'
import { elements } from './views/base'
/** Global state of the app 
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
*/
const state = {}

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput() //TODO
    console.log(query)

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query)

        // 3) Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        // 4) Search for recipes
        await state.search.getResults()

        // 5) Render results on UI
        searchView.renderResults(state.search.result)
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})