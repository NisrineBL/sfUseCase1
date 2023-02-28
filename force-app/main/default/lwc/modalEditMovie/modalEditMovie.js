import { LightningElement, api } from 'lwc';

export default class ModalEditMovie extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api isModalOpen;

  closeModal() {
    const closeEvent = new CustomEvent('close');
    this.dispatchEvent(closeEvent);
  }

  handleSuccess(event) {
    this.closeModal();
    const successEvent = new CustomEvent('success', {detail: {id: this.recordId} });
    this.dispatchEvent(successEvent);
  }
}