public with sharing class MovieTriggerHelper {
    public MovieTriggerHelper() {

    }

    public static void updateNumberOfMoviesInActors(Map<Id, MovieActor__c> newMovies){
        Set<Id> actorIds = new Set<Id>();
        Set<Id> movieIds = new Set<Id>();
        for(Id maId : newMovies.keySet()) {
            actorIds.add(newMovies.get(maId).Actor__c);
            movieIds.add(newMovies.get(maId).Movie__c);
        }


        Map<Id, Integer> moviesCount = new Map<Id, Integer>();
        Map<Id, Integer> mCount = new Map<Id, Integer>();
        Map<Id, Integer> fCount = new Map<Id, Integer>();

        for(AggregateResult ar : 
        [SELECT Actor__c, COUNT(Movie__c) movieCount FROM MovieActor__c WHERE Actor__c IN :actorIds GROUP BY Actor__c]) {
            moviesCount.put((Id) ar.get('Actor__c'), (Integer) ar.get('movieCount'));
        }

        for(AggregateResult maleCount : 
        [SELECT Movie__c,COUNT(Actor__c) actors FROM MovieActor__c WHERE Actor__r.Gender__c='Male' GROUP BY Movie__c]) {
            mCount.put((Id) maleCount.get('Movie__c'), (Integer) maleCount.get('actors'));
        }

        for(AggregateResult femaleCount : 
        [SELECT Movie__c,COUNT(Actor__c) actors FROM MovieActor__c WHERE Actor__r.Gender__c='Female' GROUP BY Movie__c]) {
            fCount.put((Id) femaleCount.get('Movie__c'), (Integer) femaleCount.get('actors'));
        }

        List<Actor__c> actorsToUpdate = new List<Actor__c>();

        List<Movie__c> moviesToUpdate = new List<Movie__c>();

        for(Id movieId : movieIds) {
            Integer maleCount = mCount.get(movieId) != null ? mCount.get(movieId) : 0;
            Integer femaleCount = fCount.get(movieId) != null ? fCount.get(movieId) : 0;
            Movie__c movie = new Movie__c(
                Id=movieId, 
                MaleActorsPercentage__c=(decimal) (maleCount/(maleCount + femaleCount) * 100), 
                FemaleActorsPercentage__c=(decimal) (femaleCount/(maleCount + femaleCount) * 100));
            System.debug('movie : ' + movie);
            moviesToUpdate.add(movie);
        }



        for (Id actorId : actorIds) {
            Integer movieCount = moviesCount.get(actorId);
            if(movieCount == null) {
                movieCount = 0;
            }

            Actor__c actor = new Actor__c(Id=actorId, Number_of_movies__c=movieCount);
            actorsToUpdate.add(actor);
        }

        if(actorsToUpdate.size() > 0) {
            update actorsToUpdate;
        }

        if(moviesToUpdate.size() > 0) {
            update moviesToUpdate;
        }
    }
}