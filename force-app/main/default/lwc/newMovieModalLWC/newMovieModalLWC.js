import { LightningElement, api, wire, track } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import addMovie from "@salesforce/apex/movieController.addMovie";
import MOVIE_CATEGORY from "@salesforce/schema/Movie__c.Category__c";
import getActors from "@salesforce/apex/actorsController.getActors";
import addMovieActor from "@salesforce/apex/movieActor.addMovieActor";

export default class NewMovieModalLwc extends LightningElement {
  @track movieName;
  @track category;
  @track releaseDate;
  @track description;

  @api showModal;
  @track movieCategories;
  @track actors = [];
  @track selectedMovieActors = [];

  connectedCallback() {
    //Can't wire getActor
    //Leverage async await
    getActors().then((actors) => {
      //forEach
      // load just 25 actor for testing
      //truncate
      for (let i = 0; i < 25; i++) {
        this.actors = [
          ...this.actors,
          { value: actors[i].Id, label: actors[i].Name }
        ];
      }
    });
  }
  // retrieving movie categories picklist with a dummy recordType id.
  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",//you can get it with the standard method
    fieldApiName: MOVIE_CATEGORY
  })
  wiredPickListValue({ data, error }) {
    if (data) {
      this.movieCategories = data.values;
    }
    if (error) {
      this.movieCategories = [];//initialize the array to avoid undefined
    }
  }
  // Function to close modal
  closeModal() {
    this.dispatchEvent(new CustomEvent("close"));
    this.selectedMovieActors = [];//no need
  }
  // Function to submit modal form data
  submitMovie(e) {
    const movie = {
      name: this.movieName,
      description: this.description,
      category: this.category,
      releaseDate: this.releaseDate
    };
    const movieID = this.createMovie(JSON.stringify(movie));
    //asyn await
    movieID.then((movieID) => {
      // console.log("movie inserted : " + movieID);
      this.dispatchEvent(new CustomEvent("create", {detail : {id: movieID}}));
      const payload = {
        movie: movieID,
        actors: this.selectedMovieActors
      };
      addMovieActor({ payload: JSON.stringify(payload) })
        .then(() => {
          this.dispatchEvent(new CustomEvent("create"));
          this.selectedMovieActors = [];
        })
        .catch((e) => {
          console.log(e);
        });
    });
    e.preventDefault();
  }

  addSelectedActor() {
    const picklist = this.template.querySelector('[data-id="actrs"]');//class or tag name
    if (picklist.value) {//check if picklist is null(safe operator)
      const uniques = new Set(this.selectedMovieActors);
      if (!uniques.has(picklist.value)) {
        this.selectedMovieActors.push(picklist.value);
      }
    }
  }

  handleDeleteActor() {
    this.selectedMovieActors.pop();
  }

  createMovie(payload) {
    return addMovie({ payload: payload });
  }
  // Handler when user select option from picklist
  handleChange(event) {
    switch (event.target.name) {
      case "mv_name":
        this.movieName = event.target.value;
        break;
      case "category":
        this.category = event.target.value;
        break;
      case "rls_date":
        this.releaseDate = event.target.value;
        break;
      case "description":
        this.description = event.target.value;
        break;
      default:
        console.log("No element matched");
        break;
    }
  }
}