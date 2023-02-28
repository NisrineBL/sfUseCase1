import { LightningElement, api, wire, track } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import addMovie from "@salesforce/apex/movieController.addMovie";
import MOVIE_CATEGORY from "@salesforce/schema/Movie__c.Category__c";
import getActors from "@salesforce/apex/actorsController.getActors";
import addMovieActor from "@salesforce/apex/movieActor.addMovieActor";
import deleteMovieActor from "@salesforce/apex/movieActor.deleteMovieActor";
import getMovieActors from "@salesforce/apex/movieActor.getMovieActors";
import actorsDummy from "@salesforce/resourceUrl/actors";


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
    getActors().then((actors) => {
      // load just 25 actor for testing
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
    recordTypeId: "012000000000000AAA",
    fieldApiName: MOVIE_CATEGORY
  })
  wiredPickListValue({ data, error }) {
    if (data) {
      this.movieCategories = data.values;
    }
    if (error) {
      this.movieCategories = [];
    }
  }
  // Function to close modal
  closeModal() {
    this.dispatchEvent(new CustomEvent("close"));
    this.selectedMovieActors = [];
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
    movieID.then((movieID) => {
      console.log("movie inserted : " + movieID);
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
    const picklist = this.template.querySelector('[data-id="actrs"]');
    if (picklist.value) {
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