(function() {
  'use strict';

  Darkroom.plugins.download = Darkroom.Plugin.extend({

    defaults: {
      callback: function() {
        var base64EncodedImage = dkrm.canvas.toDataURL();
        var a  = document.createElement('a');
        a.href = base64EncodedImage;
        a.download = 'download.png';
        a.click();
      }
    },

    initialize: function InitializeDarkroomSavePlugin() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.destroyButton = buttonGroup.createButton({
        image: 'download'
      });

      this.destroyButton.addEventListener('click', this.options.callback.bind(this));
    },
  });

})();
