$.makeDiv = function(classAttr) {
   return $('<div></div>').addClass(classAttr);
};
$.makeExpander = function(root) {
   root.children().each(function(p) {
      var content = $(this).addClass('content-block closed-block');
      root.append($.makeDiv('control-block').append($.makeDiv('control up')
       .click(function() {
          $(this).parent().insertBefore($(this).parent().prev());
       }))
       .append($.makeDiv('control down').click(function(){
          $(this).parent().insertAfter($(this).parent().next());
       }))
       .append($.makeDiv('title closed').click(function(){
          if ($(this).hasClass('closed')) {
             $(this).removeClass('closed').next().removeClass('closed-block');
          }
          else {
             $(this).addClass('closed').next().addClass('closed-block');
          }})
       .append($(this).attr('title'))).append(content));
   });
};
