import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
export default class MoviePreviewLwc extends NavigationMixin(LightningElement) {
  @api movie;
  @track isModalOpen = false;
  handleEdit(event) {
    this.isModalOpen = true;
    console.log(this.movie.Id);
    const nav = this[NavigationMixin.GenerateUrl]({
      type: 'standard__recordPage',
      attributes: {
          recordId: this.movie.Id,
          objectApiName: 'Movie__c',
          actionName: 'edit'
      }
    });
    console.log(nav);
  }

  handleDelete(event) {
    deleteRecord(this.movie.Id)
            .then(() => {
                this.dispatchEvent(CustomEvent('close'));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
  }
  handleClose(event) {
    this.isModalOpen = false;
  }

  handleSuccess(event) {
    const toastEvent = new ShowToastEvent({
      title: "Your Movie has been updated",
      message: "Record ID: " + event.detail.id,
      variant: "success"
    });
    this.dispatchEvent(CustomEvent('close'));
    this.dispatchEvent(toastEvent);
  }
}
