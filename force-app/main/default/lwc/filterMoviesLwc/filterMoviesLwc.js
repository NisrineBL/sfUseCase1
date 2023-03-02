import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FilterMoviesLwc extends LightningElement {
    @track showModal = false;

    handleCreate(event) {
        const toastEvent = new ShowToastEvent({
            title: "Your Movie has been created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.showModal = false;
    }

    handleClose() {
        this.showModal = false;
    }

    handleNewMovie() {
        this.showModal = true;
    }

    
}