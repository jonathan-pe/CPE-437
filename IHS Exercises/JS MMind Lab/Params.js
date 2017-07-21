/* 700 */
var println = print;
var readln = readline;

var Params = function() {
   //Parameters
   this.maxChar = "";
   this.length = 0;
   this.seed = 1;
   this.randRange = 0;
   this.read = function() {
      var line, params;

      while (true) {
         println("Enter max character, number of characters, and seed");
         line = readln().split(' ');
         if (line.length < 2)
         print("Must have at least two entries");
         else {
            this.maxChar = line[0].toUpperCase().charAt(0);
            this.length = parseInt(line[1]);
            this.seed = parseInt(line[2]);
            
            if (this.maxChar < "A" || this.maxChar > "F")
               println("Max char must be between A and F");
            else if (this.length < 1 || this.length > 10)
               println("Number of chars must be between 1 and 10");
            else if (this.seed < 0 || isNaN(this.seed))
               println("Enter a nonnegative integer for seed");
            else {
               this.randRange
               = this.maxChar.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
               return this;
            }
         }
      }
   };
};
