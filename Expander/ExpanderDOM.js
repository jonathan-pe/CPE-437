var Expander = {};

Expander.makeDiv = function(classAttr) {
   var div = document.createElement('div');

   div.setAttribute('class', classAttr);
   return div;
};

Expander.makeExpander = function(root) {
   var control, controls = [], contentBlocks = [], children = root.childNodes;
   var section, controlBlock, content, p;

   section = Expander.makeDiv('section');
   for (p = 0; p < children.length; p++) {
      if (children[p].nodeType !== 3) {
         contentBlocks.push(content = children[p]);
         section.appendChild(content);
      }
   }
   if(contentBlocks.length)
      root.appendChild(section);

   for (p = 0; p < contentBlocks.length; p++) {
      content = contentBlocks[p];
      content.setAttribute('class',
       content.className += ' content-block closed-block');
      controlBlock = Expander.makeDiv('control-block');
      section.removeChild(content);
      control = Expander.makeDiv('control up');
      control.block = controlBlock;
      control.addEventListener('click', function() {
         if(this.block.index - 1 >= 0) {
            var before = this.block.previousSibling;
            section.removeChild(this.block);
            section.insertBefore(this.block, before);
            this.block.index--;
            before.index++;
         }
      });
      controlBlock.appendChild(control);
      control = Expander.makeDiv('control down');
      control.block = controlBlock;
      control.addEventListener('click', function() {
         if(this.block.index + 1 < controls.length) {
            var next = this.block.nextSibling;
            section.removeChild(next);
            section.insertBefore(next, this.block);
            this.block.index++;
            next.index--;
         }
      });
      controlBlock.appendChild(control);
      control = Expander.makeDiv('title closed');
      control.block = controlBlock;
      control.addEventListener('click', function() {
         if(this.block.disabled) {
            this.block.content.classList.remove('closed-block');
            this.classList.remove('closed');
         }
         else {
            this.block.content.classList.add('closed-block');
            this.classList.add('closed');
         }
         this.block.disabled = !this.block.disabled;
      });
      control.appendChild(document.createTextNode
       (content.getAttribute('title')));
      controlBlock.appendChild(control);
      controlBlock.appendChild(content);
      controlBlock.index = p;
      controlBlock.content = content;
      controlBlock.disabled = true;
      controls.push(controlBlock);
      section.appendChild(controlBlock);
   }
};
