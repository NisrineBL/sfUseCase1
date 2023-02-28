public with sharing class MovieController {

    @AuraEnabled
      public static String addMovie(String payload) {
        try {
          Movie payloadMovie = (Movie) JSON.deserialize(payload, Movie.class);
          SObject movie = (SObject) Type.forName('Movie__c').newInstance();
          movie.put('Name', payloadMovie.name);
          movie.put('Description__c', payloadMovie.description);
          movie.put('Category__c', payloadMovie.category);
          movie.put('Release_date__c', payloadMovie.releaseDate);
          insert movie;
          return String.valueOf(movie.Id);
        } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getMovies(){
        try {
            return[
                SELECT Name, Description__c, Release_date__c, Category__c
                FROM Movie__c
                WITH SECURITY_ENFORCED
                ORDER BY Name
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Movie__c> findMovies(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Name, Description__c, Release_date__c, Category__c
            FROM Movie__c
            WHERE Name LIKE :key
            WITH SECURITY_ENFORCED
        ];
    }

    class Movie {
        @AuraEnabled
        public String id;
    
        @AuraEnabled
        public String name;
    
        @AuraEnabled
        public String description;
    
        @AuraEnabled
        public String category;
    
        @AuraEnabled
        public Date releaseDate;
    
        @AuraEnabled
        public Boolean isReleased;
    }
}