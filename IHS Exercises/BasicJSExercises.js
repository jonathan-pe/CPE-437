/* Warmup

   function Quadratic(a, b, c){
   var discriminant = b * b - (4 * a * c), solution1, solution2;
   if (discriminant < 0) {
      print("No Solution");
   }
   else if (discriminant === 0) {
      solution1 = -b / (2 * a)
      print("Solution: " + solution1);
   }
   else {
      solution1 = (-b + Math.sqrt(discriminant))/(2 * a)
      solution2 = (-b - Math.sqrt(discriminant))/(2 * a)
      print("Solutions: " + solution1 + " " + solution2);
   }
};

var input;
input = readline().split(" ");
Quadratic(input[0], input[1], input[2]); */

/* String Operations
function PigLatin(message) {
   return (
      message.substring(1, message.length).concat(message.charAt(0) + "ay")
   );
}

print(PigLatin(readline())); */

/* Class Properties

   var Sample = function(first, last) {
   this.f = first;
   this.l = last;
   this.mostRecent = this;
   this.print = function() {
      print(last + ", " + first);
   };
};

var main = function() {
   var sample = new Sample("John", "Doe");

   sample.print();
   if (Sample.mostRecent === sample) {
      Sample.mostRecent.print();
   }

   sample = new Sample("Jane", "Smith");
   sample.print();
   if (Sample.mostRecent === sample) {
      Sample.mostRecent.print();
   }
};

main(); */

/* 
var record =

{id: 42,
email: "jsmith@nodomain.com",
name: {
   first: "John",
   last: "Smith"
},
};
;

print("Id:", record.id, " Email:", record.email, " Name:",
 record.name.first + " " + record.name.last);
*/
