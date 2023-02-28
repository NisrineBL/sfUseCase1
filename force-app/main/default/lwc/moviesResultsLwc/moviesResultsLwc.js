import { LightningElement, wire, track } from 'lwc';
import getMovies from '@salesforce/apex/MovieController.getMovies';
import findMovies from '@salesforce/apex/MovieController.findMovies';
import {refreshApex} from '@salesforce/apex';
const DELAY = 300;
export default class MoviesResultsLwc extends LightningElement {

    @track movie;
    @track sidebarVisible = false;

    searchKey = '';

    @wire(getMovies) movies;
    @wire(findMovies, { searchKey: '$searchKey' })
    movies;

    handleInputChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);

    }
    handleMovie(event){
        this.movie= event.detail;
        this.sidebarVisible = true; 
    }
    get isEmpty() {
        return this.movies?.data?.length == 0;
    }

    get sidebarClass() {
        return this.sidebarVisible ? 'show-sidebar' : 'hide-sidebar';
    }

    get contentClass() {
        return this.sidebarVisible ? 'align-content' : 'extend-content';
    }

    handleCloseSidebar() {
        this.sidebarVisible = false;
        refreshApex(this.movies);
    }

}