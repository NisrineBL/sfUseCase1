public with sharing class ActorsController {
    @AuraEnabled
    public static String addActor(String payload) {
      try {
        Actor payloadActor = (Actor) JSON.deserialize(payload, Actor.class);
        SObject actor = (SObject) Type.forName('Actor__c').newInstance();
        actor.put('Name', payloadActor.name);
        actor.put('Gender__c', payloadActor.gender);
        insert actor;
        return String.valueOf(actor.Id);
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    @AuraEnabled(cacheable=true)
    public static List<SObject> getActors() {
      try {
        List<SObject> actors = Database.query(
          'SELECT Name, Gender__c FROM Actor__c'
        );
        return actors;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    class Actor {
      @AuraEnabled
      public String name;
  
      @AuraEnabled
      public String gender;
    }
  }