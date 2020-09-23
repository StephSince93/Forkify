// import string from './models/Search'
// import { add as a, multiply as m, ID } from './views/searchView'
// import * as searchView from './views/searchView' 

// console.log(`Using imported function ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(searchView.ID, 4)}. ${string}`)
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'

import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'

import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app 
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
*/
const state = {}
window.state = state

/** 
 * SEARCH CONTROLLER 
 */
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
        renderLoader(elements.searchRes)

        try {
            // 4) Search for recipes
            await state.search.getResults()
    
            // 5) Render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)

        } catch(e) {
            alert('Something went wrong with the search :(')
            clearLoader()
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchRes.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)

        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})


/** 
 * RECIPE CONTROLLER 
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '')

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Highlight selected search item
        if (state.search) {
            searchView.highlightedSelected(id)
        }
        // Create new recipe object
        state.recipe = new Recipe(id)

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe()
            
            state.recipe.parseIngredients()
            // Calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()

            // Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)
        } catch(e) {
            console.log(e)
            alert('Error processing recipe!')
        }
        
    }
}

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe))

/** 
 * LIST CONTROLLER 
 */
const controlList = () => {
    // Create a new list IF none yet
    if(!state.list) state.list = new List()

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        console.log(item)
        listView.renderItem(item)
    })

}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state 
        state.list.deleteItem(id)

        // Delete from UI
        listView.deleteItem(id)

    // Handle the count update    
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }
})

/** 
 * LIKE CONTROLLER 
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        )
        // Toggle the like button

        // Add like to UI list
        console.log(state.likes)

    // User HAS liked current recipe
    } else {

        // Remove like to the state
        state.likes.deleteLike(currentID)
        // Toggle the like button

        // Remove like to UI list
        console.log(state.likes)
    }
}



// Handling Recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
        //The * is an alias for all child elements that have the similar class name
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller 
        controlLike()
    }
})

const l = new List()
window.l = l