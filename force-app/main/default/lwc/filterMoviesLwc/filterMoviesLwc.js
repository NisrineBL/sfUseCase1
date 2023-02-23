import { LightningElement } from 'lwc';

export default class FilterMoviesLwc extends LightningElement {
    movie = '';
    changeHandler(event) {
        this.movie = event.target.value;
    }
    handleClick() {
       
    }
}