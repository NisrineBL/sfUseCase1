trigger Movie_Trigger on MovieActor__c (after insert) {
    new MovieTriggerHandler().run();
}