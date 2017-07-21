/* var reverseWords = function() {
   var line;

   while (line = readln()) {

   }
};

reverseWords(); */
Math.oSin = Math.sin;
Math.oCos = Math.cos;
Math.oTan = Math.tan;

Math.sin = function(angle, option) {
   var radians = angle;
   if (option === "d") {
      radians = angle * 0.01745329252;
   }
   return Math.oSin(radians);
};

Math.cos = function(angle, option) {
   var radians = angle;
   if (option === "d") {
      radians = angle * 0.01745329252;
   }
   return Math.oCos(radians);
};

Math.tan = function(angle, option) {
   var radians = angle;
   if (option === "d") {
      radians = angle * 0.01745329252;
   }
   return Math.oTan(radians);
};

(function() {
   var angle;

   while (angle = parseFloat(readline())) {
      print(Math.sin(angle, "d").toPrecision(5));  // degrees
      print(Math.sin(angle).toPrecision(5));       // radians
      print(Math.cos(angle, "d").toPrecision(5));
      print(Math.cos(angle).toPrecision(5));
      print(Math.tan(angle, "d").toPrecision(5));
      print(Math.tan(angle).toPrecision(5));
   }
})();
