var readln = readline;
var println = print;

/*
String.prototype.toPigLatin = function() {
   return this.substr(1) + this.charAt(0) + "ay";
}

print(readline().toPigLatin())
*/
/*
function F() {}
function G() {}

a = [new F(), new G(), new F(), [], {}, new F()];

function isConstructedBy(obj, C) {
   return C.prototype.constructor === obj.constructor;
}

for (var i = 0; i < a.length; i++)
   if (isConstructedBy(a[i], F))
      println("Element " + i + " is an F");
   else if (isConstructedBy(a[i], G))
      println("Element " + i + " is a G");
*/

/* var LinkedList = function() {
   this.head = null;
}

LinkedList.prototype.add = function(val) {
   this.head = {data: val, next: this.head};
};

LinkedList.prototype.apply = function(action) {
   for (var temp = this.head; temp; temp = temp.next) {
      action(temp.data);
   }
};

var countOccurrences = function(histogram) {
   return (
      function(i) {
         if(histogram[i]){
            histogram[i]++;
         }
         else{
            histogram[i] = 1;
         }
      }
   );
}

function printHistogram(histogram) {
   for (var i in histogram) {
      if (histogram[i]) {
         println("(#" + i + ":" + histogram[i] +")")
      }
   }
}

var main = function() {
   var list = new LinkedList();
   var histogram = [];
   var test = [];
   while (ln = readln().trim()) {
      list.add(ln)
   }
   test[90] = 1;
   test[90]++;
   list.apply(countOccurrences(histogram))
   printHistogram(histogram)
   for (var i in test) {
      if (test[i]) {
         print("(#" + i + ":" + test[i] +")");
      }
   }
};

main() */

var LinkedList = function() {
   this.head = null;
}

LinkedList.prototype.add = function(val) {
   this.head = {data: val, next: this.head};
   return 1;
};

LinkedList.prototype.forEach = function(action) {
   for (var temp = this.head; temp; temp = temp.next)
      action(temp.data);
};

LinkedList.prototype.mapEach = function(action) {
   for (var temp = this.head; temp; temp = temp.next)
      temp.data = action(temp.data);
};

var mapList = function(list) {
   list.mapEach(
      function(v){
         var s = 0;
         return function(v) {
            s += v;
            return s;
         }
      }()
   );
};

(function() {
   var list = new LinkedList();

   while (ln = readln().trim()) {
      list.add(parseInt(ln))
   }

   mapList(list);
   list.forEach(function(val) {println(val);});
   mapList(list);
   list.forEach(function(val) {println(val);});
   mapList(list);
   list.forEach(function(val) {println(val);});
})();
