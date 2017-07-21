/* 150 */
Math.random = function(seed) {
   if(seed != null){
      Math.seed = seed;
   }
   else{
      Math.seed = (Math.seed * 131071 + 524287) % 8191;
      return Math.seed / 8191;
   }
};
