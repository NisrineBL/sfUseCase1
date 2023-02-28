public with sharing class MovieActor {
    @AuraEnabled
    public static void addMovieActor(String payload) {
      try {
        List<SObject> movieActorList = new List<SObject>();
        MovieActors payloadMovieActor = (MovieActors) JSON.deserialize(
          payload,
          MovieActors.class
        );
        for (String actorID : payloadMovieActor.actors) {
          SObject movieActor = (SObject) Type.forName('MovieActor__c')
            .newInstance();
          movieActor.put('Actor__c', actorID);
          movieActor.put('Movie__c', payloadMovieActor.movie);
          movieActorList.add(movieActor);
        }
        insert movieActorList;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    @AuraEnabled
    public static List<SObject> getMovieActors() {
      try {
        List<SObject> movieActors = Database.query(
          'SELECT Id FROM MovieActor__c'
        );
        return movieActors;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    @AuraEnabled
    public static void deleteMovieActor(String id) {
      try {
        SObject movieActor = (SObject) Type.forName('MovieActor__c')
          .newInstance();
        movieActor.put('Id', id);
        delete movieActor;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    class MovieActors {
      @AuraEnabled
      public String movie;
  
      @AuraEnabled
      public String[] actors;
    }
  }