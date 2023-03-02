public with sharing class MovieTriggerHandler extends TriggerHandler{

    private Map<Id, MovieActor__c> newMap;
    public MovieTriggerHandler() {
        this.newMap = (Map<Id, MovieActor__c>) Trigger.newMap;
    }

    public override void afterInsert(){
        MovieTriggerHelper.updateNumberOfMoviesInActors(newMap);
    }

}