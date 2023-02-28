import { LightningElement, api } from 'lwc';

export default class Tile extends LightningElement {
    @api movie;

    handleMovieSelected() {

        const movieSelected = new CustomEvent('movieselect', {detail: this.movie});
        this.dispatchEvent(movieSelected);
    }
}