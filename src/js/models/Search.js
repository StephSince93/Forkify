import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
    }

    async getResults() {
        try {
            const {data} = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`)
            this.result = data.recipes
            //console.log(this.results)
        }catch(e) {
            alert(e)
        }

    }
}
