/* 1,800 */
var println = print;
var readln = readline;

var Pattern = function(params) {
   this.params = params;
   this.letters = [];

   this.read = function() {
      var line, errors, letter;
      do {
         this.letters = [];
         errors = 0;
         if (line = readln()) {
            this.letters = line.toUpperCase().split(" ");
            for (var i = 0; i < this.letters.length; i++) {
               letter = this.letters[i];
               if (letter.length != 1 || letter < 'A' || letter > params.maxChar) {
                  print(this.letters[i], " is not a valid guess");
                  errors++;
               }
            }
            if (this.letters.length < params.length) {
               println("Guess is too short");
               errors++;
            }
            else if (this.letters.length > params.length) {
               println("Guess is too long");
               errors++;
            }
         }
      } while (line && errors);
   };

   this.randomize = function() {
      this.letters = [];
      for (var i = 0; i < params.length; i++) {
         this.letters[i] = String.fromCharCode('A'.charCodeAt(0)
          + Math.random() * params.randRange);
      }
   };

   this.toString = function() {
      return this.letters.join(" ");
   };

   this.match = function(guess) {
      var mMatches = [], gMatches = [];

      var result = {
         exact: 0,
         inexact: 0,
         imperfect: function() {
            if(result.exact != params.length){
               return true;
            }
            return false;
         },
         toString: function() {
            return result.exact + " exact and " + result.inexact + " inexact.";
         }
      };

      for (var i = 0; i < params.length; i++){
         if (this.letters[i] === guess.letters[i]) {
            mMatches[i] = gMatches[i] = true;
            result.exact++;
         }
      }

      for (var i = 0; i < params.length; i++) {
         for (var j = 0; j < guess.params.length; j++) {
            if (!mMatches[i] && !gMatches[j] && this.letters[i] === guess.letters[j]) {
               mMatches[i] = gMatches[j] = true;
               result.inexact++;
            }
         }
      }

      return result;
   };

};
