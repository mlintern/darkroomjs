(function() {
  'use strict';

  // Inject SVG icons into the DOM
  var element = document.createElement('div');
  element.id = 'darkroom-icons';
  element.style.height = 0;
  element.style.width = 0;
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.innerHTML = '<!-- inject:svg --><svg xmlns="http://www.w3.org/2000/svg"><symbol id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></symbol><symbol id="crop"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2z"/></symbol><symbol id="done"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></symbol><symbol id="download"><path stroke="null" d="M19.47 10.433l-7.5 10.974-7.5-10.974h3.75V-.593h7.5v11.026h3.75zM-13.5 22h56v22h-56z" fill-opacity="null" stroke-opacity="null" stroke-width="null" fill="null"/><path fill-opacity="null" stroke-opacity="null" stroke-width="null" stroke="null" fill="null" d="M28.5 25h5v10h-5z"/></symbol><symbol id="redo"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8.002 8.002 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7z"/></symbol><symbol id="rotate-left"><path d="M0 0h24v24H0z" fill="none"/><path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/></symbol><symbol id="rotate-right"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10zM19.93 11a7.906 7.906 0 0 0-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/></symbol><symbol id="save"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10z"/></symbol><symbol id="undo"><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></symbol></svg><!-- endinject -->';
  document.body.appendChild(element);

})();
;(function() {
  'use strict';

  window.Darkroom = Darkroom;

  // Core object of DarkroomJS.
  // Basically it's a single object, instanciable via an element
  // (it could be a CSS selector or a DOM element), some custom options,
  // and a list of plugin objects (or none to use default ones).
  function Darkroom(element, options, plugins) {
    return this.constructor(element, options, plugins);
  }

  // Create an empty list of plugin objects, which will be filled by
  // other plugin scripts. This is the default plugin list if none is
  // specified in Darkroom'ss constructor.
  Darkroom.plugins = [];

  Darkroom.prototype = {
    // Reference to the main container element
    containerElement: null,

    // Reference to the Fabric canvas object
    canvas: null,

    // Reference to the Fabric image object
    image: null,

    // Reference to the Fabric source canvas object
    sourceCanvas: null,

    // Reference to the Fabric source image object
    sourceImage: null,

    // Track of the original image element
    originalImageElement: null,

    // Stack of transformations to apply to the image source
    transformations: [],

    // Default options
    defaults: {
      // Canvas properties (dimension, ratio, color)
      minWidth: null,
      minHeight: null,
      maxWidth: null,
      maxHeight: null,
      ratio: null,
      backgroundColor: '#fff',

      // Plugins options
      plugins: {},

      // Post-initialisation callback
      initialize: function() { /* noop */ }
    },

    // List of the instancied plugins
    plugins: {},

    // This options are a merge between `defaults` and the options passed
    // through the constructor
    options: {},

    constructor: function(element, options, plugins) {
      this.options = Darkroom.Utils.extend(options, this.defaults);

      if (null === element){
        return;
      }
      console.log(element);
      if (typeof element === 'string') {
        element = document.querySelector(element);
      } else if (element instanceof jQuery) {
        element = element[0];
      } else {
        return;
      }

      var image = new Image();
      image.onload = function() {
        // Initialize the DOM/Fabric elements
        this._initializeDOM(element);
        this._initializeImage();

        // Then initialize the plugins
        this._initializePlugins(Darkroom.plugins);

        // Public method to adjust image according to the canvas
        this.refresh(function() {
          // Execute a custom callback after initialization
          this.options.initialize.bind(this).call();
        }.bind(this));

      }.bind(this);

      //image.crossOrigin = 'anonymous';
      image.src = element.src;
    },

    selfDestroy: function() {
      var container = this.containerElement;
      var image = new Image();
      image.onload = function() {
        container.parentNode.replaceChild(image, container);
      };

      image.src = this.sourceImage.toDataURL();
    },

    // Add ability to attach event listener on the core object.
    // It uses the canvas element to process events.
    addEventListener: function(eventName, callback) {
      var el = this.canvas.getElement();
      if (el.addEventListener){
        el.addEventListener(eventName, callback);
      } else if (el.attachEvent) {
        el.attachEvent('on' + eventName, callback);
      }
    },

    dispatchEvent: function(eventName) {
      // Use the old way of creating event to be IE compatible
      // See https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
      var event = document.createEvent('Event');
      event.initEvent(eventName, true, true);

      this.canvas.getElement().dispatchEvent(event);
    },

    // Adjust image & canvas dimension according to min/max width/height
    // and ratio specified in the options.
    // This method should be called after each image transformation.
    refresh: function(next) {
      var clone = new Image();
      clone.onload = function() {
        this._replaceCurrentImage(new fabric.Image(clone));

        if (next) next();
      }.bind(this);
      clone.src = this.sourceImage.toDataURL();
    },

    _replaceCurrentImage: function(newImage) {
      if (this.image) {
        this.image.remove();
      }

      this.image = newImage;
      this.image.selectable = false;

      // Adjust width or height according to specified ratio
      var viewport = Darkroom.Utils.computeImageViewPort(this.image);
      var canvasWidth = viewport.width;
      var canvasHeight = viewport.height;

      if (null !== this.options.ratio) {
        var canvasRatio = +this.options.ratio;
        var currentRatio = canvasWidth / canvasHeight;

        if (currentRatio > canvasRatio) {
          canvasHeight = canvasWidth / canvasRatio;
        } else if (currentRatio < canvasRatio) {
          canvasWidth = canvasHeight * canvasRatio;
        }
      }

      // Then scale the image to fit into dimension limits
      var scaleMin = 1;
      var scaleMax = 1;
      var scaleX = 1;
      var scaleY = 1;

      if (null !== this.options.maxWidth && this.options.maxWidth < canvasWidth) {
        scaleX =  this.options.maxWidth / canvasWidth;
      }
      if (null !== this.options.maxHeight && this.options.maxHeight < canvasHeight) {
        scaleY =  this.options.maxHeight / canvasHeight;
      }
      scaleMin = Math.min(scaleX, scaleY);

      scaleX = 1;
      scaleY = 1;
      if (null !== this.options.minWidth && this.options.minWidth > canvasWidth) {
        scaleX =  this.options.minWidth / canvasWidth;
      }
      if (null !== this.options.minHeight && this.options.minHeight > canvasHeight) {
        scaleY =  this.options.minHeight / canvasHeight;
      }
      scaleMax = Math.max(scaleX, scaleY);

      var scale = scaleMax * scaleMin; // one should be equals to 1

      canvasWidth *= scale;
      canvasHeight *= scale;

      // Finally place the image in the center of the canvas
      this.image.setScaleX(1 * scale);
      this.image.setScaleY(1 * scale);
      this.canvas.add(this.image);
      this.canvas.setWidth(canvasWidth);
      this.canvas.setHeight(canvasHeight);
      this.canvas.centerObject(this.image);
      this.image.setCoords();
    },

    // Apply the transformation on the current image and save it in the
    // transformations stack (in order to reconstitute the previous states
    // of the image).
    applyTransformation: function(transformation) {
      this.transformations.push(transformation);

      transformation.applyTransformation(
        this.sourceCanvas,
        this.sourceImage,
        this._postTransformation.bind(this)
      );
    },

    _postTransformation: function(newImage) {
      if (newImage)
        this.sourceImage = newImage;

      this.refresh(function() {
        this.dispatchEvent('core:transformation');
      }.bind(this));
    },

    // Initialize image from original element plus re-apply every
    // transformations.
    reinitializeImage: function() {
      this.sourceImage.remove();
      this._initializeImage();
      this._popTransformation(this.transformations.slice());
    },

    _popTransformation: function(transformations) {
      if (0 === transformations.length) {
        this.dispatchEvent('core:reinitialized');
        this.refresh();
        return;
      }

      var transformation = transformations.shift();

      var next = function(newImage) {
        if (newImage) this.sourceImage = newImage;
        this._popTransformation(transformations);
      };

      transformation.applyTransformation(
        this.sourceCanvas,
        this.sourceImage,
        next.bind(this)
      );
    },

    // Create the DOM elements and instanciate the Fabric canvas.
    // The image element is replaced by a new `div` element.
    // However the original image is re-injected in order to keep a trace of it.
    _initializeDOM: function(imageElement) {
      // Container
      var mainContainerElement = document.createElement('div');
      mainContainerElement.className = 'darkroom-container';

      // Toolbar
      var toolbarElement = document.createElement('div');
      toolbarElement.className = 'darkroom-toolbar';
      mainContainerElement.appendChild(toolbarElement);

      // Viewport canvas
      var canvasContainerElement = document.createElement('div');
      canvasContainerElement.className = 'darkroom-image-container';
      var canvasElement = document.createElement('canvas');
      canvasContainerElement.appendChild(canvasElement);
      mainContainerElement.appendChild(canvasContainerElement);

      // Source canvas
      var sourceCanvasContainerElement = document.createElement('div');
      sourceCanvasContainerElement.className = 'darkroom-source-container';
      sourceCanvasContainerElement.style.display = 'none';
      var sourceCanvasElement = document.createElement('canvas');
      sourceCanvasContainerElement.appendChild(sourceCanvasElement);
      mainContainerElement.appendChild(sourceCanvasContainerElement);

      // Original image
      imageElement.parentNode.replaceChild(mainContainerElement, imageElement);
      imageElement.style.display = 'none';
      mainContainerElement.appendChild(imageElement);

      // Instanciate object from elements
      this.containerElement = mainContainerElement;
      this.originalImageElement = imageElement;

      this.toolbar = new Darkroom.UI.Toolbar(toolbarElement);

      this.canvas = new fabric.Canvas(canvasElement, {
        selection: false,
        backgroundColor: this.options.backgroundColor
      });

      this.sourceCanvas = new fabric.Canvas(sourceCanvasElement, {
        selection: false,
        backgroundColor: this.options.backgroundColor
      });
    },

    // Instanciate the Fabric image object.
    // The image is created as a static element with no control,
    // then it is add in the Fabric canvas object.
    _initializeImage: function() {
      this.sourceImage = new fabric.Image(this.originalImageElement, {
        // Some options to make the image static
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        hasControls: false,
        hasBorders: false,
      });

      this.sourceCanvas.add(this.sourceImage);

      // Adjust width or height according to specified ratio
      var viewport = Darkroom.Utils.computeImageViewPort(this.sourceImage);
      var canvasWidth = viewport.width;
      var canvasHeight = viewport.height;

      this.sourceCanvas.setWidth(canvasWidth);
      this.sourceCanvas.setHeight(canvasHeight);
      this.sourceCanvas.centerObject(this.sourceImage);
      this.sourceImage.setCoords();
    },

    // Initialize every plugins.
    // Note that plugins are instanciated in the same order than they
    // are declared in the parameter object.
    _initializePlugins: function(plugins) {
      for (var name in plugins) {
        var plugin = plugins[name];
        var options = this.options.plugins[name];

        // Setting false into the plugin options will disable the plugin
        if (options === false)
          continue;

        // Avoid any issues with _proto_
        if (!plugins.hasOwnProperty(name))
          continue;

        this.plugins[name] = new plugin(this, options);
      }
    },
  };

})();
;(function() {
  'use strict';

  Darkroom.Plugin = Plugin;

  // Define a plugin object. This is the (abstract) parent class which
  // has to be extended for each plugin.
  function Plugin(darkroom, options) {
    this.darkroom = darkroom;
    this.options = Darkroom.Utils.extend(options, this.defaults);
    this.initialize();
  }

  Plugin.prototype = {
    defaults: {},
    initialize: function() { }
  };

  // Inspired by Backbone.js extend capability.
  Plugin.extend = function(protoProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    Darkroom.Utils.extend(child, parent);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) Darkroom.Utils.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
  };

})();
;(function() {
  'use strict';

  Darkroom.Transformation = Transformation;

  function Transformation(options) {
    this.options = options;
  }

  Transformation.prototype = {
    applyTransformation: function(image) { /* no-op */  }
  };

  // Inspired by Backbone.js extend capability.
  Transformation.extend = function(protoProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    Darkroom.Utils.extend(child, parent);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) Darkroom.Utils.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
  };

})();
;(function() {
  'use strict';

  Darkroom.UI = {
    Toolbar: Toolbar,
    ButtonGroup: ButtonGroup,
    Button: Button,
  };

  // Toolbar object.
  function Toolbar(element) {
    this.element = element;
  }

  Toolbar.prototype = {
    createButtonGroup: function(options) {
      var buttonGroup = document.createElement('div');
      buttonGroup.className = 'darkroom-button-group';
      this.element.appendChild(buttonGroup);

      return new ButtonGroup(buttonGroup);
    }
  };

  // ButtonGroup object.
  function ButtonGroup(element) {
    this.element = element;
  }

  ButtonGroup.prototype = {
    createButton: function(options) {
      var defaults = {
        image: 'help',
        type: 'default',
        group: 'default',
        hide: false,
        disabled: false
      };

      options = Darkroom.Utils.extend(options, defaults);

      var buttonElement = document.createElement('button');
      buttonElement.type = 'button';
      buttonElement.className = 'darkroom-button darkroom-button-' + options.type;
      buttonElement.innerHTML = '<svg class="darkroom-icon"><use xlink:href="#' + options.image + '" /></svg>';
      this.element.appendChild(buttonElement);

      var button = new Button(buttonElement);
      button.hide(options.hide);
      button.disable(options.disabled);

      return button;
    }
  };

  // Button object.
  function Button(element) {
    this.element = element;
  }

  Button.prototype = {
    addEventListener: function(eventName, listener) {
      if (this.element.addEventListener){
        this.element.addEventListener(eventName, listener);
      } else if (this.element.attachEvent) {
        this.element.attachEvent('on' + eventName, listener);
      }
    },
    removeEventListener: function(eventName, listener) {
      if (this.element.removeEventListener){
        this.element.removeEventListener(eventName, listener);
      }
    },
    active: function(value) {
      if (value)
        this.element.classList.add('darkroom-button-active');
      else
        this.element.classList.remove('darkroom-button-active');
    },
    hide: function(value) {
      if (value)
        this.element.classList.add('darkroom-button-hidden');
      else
        this.element.classList.remove('darkroom-button-hidden');
    },
    disable: function(value) {
      this.element.disabled = (value) ? true : false;
    }
  };

})();
;(function() {
  'use strict';

  Darkroom.Utils = {
    extend: extend,
    computeImageViewPort: computeImageViewPort,
  };


  // Utility method to easily extend objects.
  function extend(b, a) {
    var prop;
    if (b === undefined) {
      return a;
    }
    for (prop in a) {
      if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
        b[prop] = a[prop];
      }
    }
    return b;
  }

  function computeImageViewPort(image) {
    return {
      height: Math.abs(image.getWidth() * (Math.sin(image.getAngle() * Math.PI / 180))) + Math.abs(image.getHeight() * (Math.cos(image.getAngle() * Math.PI / 180))),
      width: Math.abs(image.getHeight() * (Math.sin(image.getAngle() * Math.PI / 180))) + Math.abs(image.getWidth() * (Math.cos(image.getAngle() * Math.PI / 180))),
    };
  }

})();
;(function() {
  'use strict';

  Darkroom.plugins.download = Darkroom.Plugin.extend({

    defaults: {
      callback: function() {
        var base64EncodedImage = this.darkroom.canvas.toDataURL();
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
;;(function(window, document, Darkroom, fabric) {
  'use strict';

  Darkroom.plugins.history = Darkroom.Plugin.extend({
    undoTransformations: [],

    initialize: function InitDarkroomHistoryPlugin() {
      this._initButtons();

      this.darkroom.addEventListener('core:transformation', this._onTranformationApplied.bind(this));
    },

    undo: function() {
      if (this.darkroom.transformations.length === 0) {
        return;
      }

      var lastTransformation = this.darkroom.transformations.pop();
      this.undoTransformations.unshift(lastTransformation);

      this.darkroom.reinitializeImage();
      this._updateButtons();
    },

    redo: function() {
      if (this.undoTransformations.length === 0) {
        return;
      }

      var cancelTransformation = this.undoTransformations.shift();
      this.darkroom.transformations.push(cancelTransformation);

      this.darkroom.reinitializeImage();
      this._updateButtons();
    },

    _initButtons: function() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.backButton = buttonGroup.createButton({
        image: 'undo',
        disabled: true
      });

      this.forwardButton = buttonGroup.createButton({
        image: 'redo',
        disabled: true
      });

      this.backButton.addEventListener('click', this.undo.bind(this));
      this.forwardButton.addEventListener('click', this.redo.bind(this));

      return this;
    },

    _updateButtons: function() {
      this.backButton.disable((this.darkroom.transformations.length === 0));
      this.forwardButton.disable((this.undoTransformations.length === 0));
    },

    _onTranformationApplied: function() {
      this.undoTransformations = [];
      this._updateButtons();
    }
  });
})(window, document, Darkroom, fabric);
;(function() {
  'use strict';

  var Rotation = Darkroom.Transformation.extend({
    applyTransformation: function(canvas, image, next) {
      var angle = (image.getAngle() + this.options.angle) % 360;
      image.rotate(angle);

      var width, height;
      height = Math.abs(image.getWidth()*(Math.sin(angle*Math.PI/180)))+Math.abs(image.getHeight()*(Math.cos(angle*Math.PI/180)));
      width = Math.abs(image.getHeight()*(Math.sin(angle*Math.PI/180)))+Math.abs(image.getWidth()*(Math.cos(angle*Math.PI/180)));

      canvas.setWidth(width);
      canvas.setHeight(height);

      canvas.centerObject(image);
      image.setCoords();
      canvas.renderAll();

      next();
    }
  });

  Darkroom.plugins.rotate = Darkroom.Plugin.extend({

    initialize: function InitDarkroomRotatePlugin() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      var leftButton = buttonGroup.createButton({
        image: 'rotate-left'
      });

      var rightButton = buttonGroup.createButton({
        image: 'rotate-right'
      });

      leftButton.addEventListener('click', this.rotateLeft.bind(this));
      rightButton.addEventListener('click', this.rotateRight.bind(this));
    },

    rotateLeft: function rotateLeft() {
      this.rotate(-90);
    },

    rotateRight: function rotateRight() {
      this.rotate(90);
    },

    rotate: function rotate(angle) {
      this.darkroom.applyTransformation(
        new Rotation({angle: angle})
      );
    }

  });

})();
;(function() {
  'use strict';

  var Crop = Darkroom.Transformation.extend({
    applyTransformation: function(canvas, image, next) {
      // Snapshot the image delimited by the crop zone
      var snapshot = new Image();
      snapshot.onload = function() {
        // Validate image
        if (height < 1 || width < 1) {
          return;
        }

        var imgInstance = new fabric.Image(this, {
          // options to make the image static
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockUniScaling: true,
          hasControls: false,
          hasBorders: false
        });

        var width = this.width;
        var height = this.height;

        // Update canvas size
        canvas.setWidth(width);
        canvas.setHeight(height);

        // Add image
        image.remove();
        canvas.add(imgInstance);

        next(imgInstance);
      };

      var viewport = Darkroom.Utils.computeImageViewPort(image);
      var imageWidth = viewport.width;
      var imageHeight = viewport.height;

      var left = this.options.left * imageWidth;
      var top = this.options.top * imageHeight;
      var width = Math.min(this.options.width * imageWidth, imageWidth - left);
      var height = Math.min(this.options.height * imageHeight, imageHeight - top);

      snapshot.src = canvas.toDataURL({
        left: left,
        top: top,
        width: width,
        height: height,
      });
    }
  });

  var CropZone = fabric.util.createClass(fabric.Rect, {
    _render: function(ctx) {
      this.callSuper('_render', ctx);

      var canvas = ctx.canvas;
      var dashWidth = 7;

      // Set original scale
      var flipX = this.flipX ? -1 : 1;
      var flipY = this.flipY ? -1 : 1;
      var scaleX = flipX / this.scaleX;
      var scaleY = flipY / this.scaleY;

      ctx.scale(scaleX, scaleY);

      // Overlay rendering
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this._renderOverlay(ctx);

      // Set dashed borders
      if (ctx.setLineDash !== undefined) {
        ctx.setLineDash([dashWidth, dashWidth]);
      } else if (ctx.mozDash !== undefined) {
        ctx.mozDash = [dashWidth, dashWidth];
      }

      // First lines rendering with black
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      this._renderBorders(ctx);
      this._renderGrid(ctx);

      // Re render lines in white
      ctx.lineDashOffset = dashWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      this._renderBorders(ctx);
      this._renderGrid(ctx);

      // Reset scale
      ctx.scale(1/scaleX, 1/scaleY);
    },

    _renderOverlay: function(ctx) {
      var canvas = ctx.canvas;

      //
      //    x0    x1        x2      x3
      // y0 +------------------------+
      //    |\\\\\\\\\\\\\\\\\\\\\\\\|
      //    |\\\\\\\\\\\\\\\\\\\\\\\\|
      // y1 +------+---------+-------+
      //    |\\\\\\|         |\\\\\\\|
      //    |\\\\\\|    0    |\\\\\\\|
      //    |\\\\\\|         |\\\\\\\|
      // y2 +------+---------+-------+
      //    |\\\\\\\\\\\\\\\\\\\\\\\\|
      //    |\\\\\\\\\\\\\\\\\\\\\\\\|
      // y3 +------------------------+
      //

      var x0 = Math.ceil(-this.getWidth() / 2 - this.getLeft());
      var x1 = Math.ceil(-this.getWidth() / 2);
      var x2 = Math.ceil(this.getWidth() / 2);
      var x3 = Math.ceil(this.getWidth() / 2 + (canvas.width - this.getWidth() - this.getLeft()));

      var y0 = Math.ceil(-this.getHeight() / 2 - this.getTop());
      var y1 = Math.ceil(-this.getHeight() / 2);
      var y2 = Math.ceil(this.getHeight() / 2);
      var y3 = Math.ceil(this.getHeight() / 2 + (canvas.height - this.getHeight() - this.getTop()));

      ctx.beginPath();

      // Draw outer rectangle.
      // Numbers are +/-1 so that overlay edges don't get blurry.
      ctx.moveTo(x0 - 1, y0 - 1);
      ctx.lineTo(x3 + 1, y0 - 1);
      ctx.lineTo(x3 + 1, y3 + 1);
      ctx.lineTo(x0 - 1, y3 - 1);
      ctx.lineTo(x0 - 1, y0 - 1);
      ctx.closePath();

      // Draw inner rectangle.
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x1, y1);

      ctx.closePath();
      ctx.fill();
    },

    _renderBorders: function(ctx) {
      ctx.beginPath();
      ctx.moveTo(-this.getWidth()/2, -this.getHeight()/2); // upper left
      ctx.lineTo(this.getWidth()/2, -this.getHeight()/2); // upper right
      ctx.lineTo(this.getWidth()/2, this.getHeight()/2); // down right
      ctx.lineTo(-this.getWidth()/2, this.getHeight()/2); // down left
      ctx.lineTo(-this.getWidth()/2, -this.getHeight()/2); // upper left
      ctx.stroke();
    },

    _renderGrid: function(ctx) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(-this.getWidth()/2 + 1/3 * this.getWidth(), -this.getHeight()/2);
      ctx.lineTo(-this.getWidth()/2 + 1/3 * this.getWidth(), this.getHeight()/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-this.getWidth()/2 + 2/3 * this.getWidth(), -this.getHeight()/2);
      ctx.lineTo(-this.getWidth()/2 + 2/3 * this.getWidth(), this.getHeight()/2);
      ctx.stroke();
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(-this.getWidth()/2, -this.getHeight()/2 + 1/3 * this.getHeight());
      ctx.lineTo(this.getWidth()/2, -this.getHeight()/2 + 1/3 * this.getHeight());
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-this.getWidth()/2, -this.getHeight()/2 + 2/3 * this.getHeight());
      ctx.lineTo(this.getWidth()/2, -this.getHeight()/2 + 2/3 * this.getHeight());
      ctx.stroke();
    }
  });

  Darkroom.plugins.crop = Darkroom.Plugin.extend({
    // Init point
    startX: null,
    startY: null,

    // Keycrop
    isKeyCroping: false,
    isKeyLeft: false,
    isKeyUp: false,

    defaults: {
      // min crop dimension
      minHeight: 1,
      minWidth: 1,
      // ensure crop ratio
      ratio: null,
      // quick crop feature (set a key code to enable it)
      quickCropKey: false
    },

    initialize: function InitDarkroomCropPlugin() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.cropButton = buttonGroup.createButton({
        image: 'crop'
      });
      this.okButton = buttonGroup.createButton({
        image: 'done',
        type: 'success',
        hide: true
      });
      this.cancelButton = buttonGroup.createButton({
        image: 'close',
        type: 'danger',
        hide: true
      });

      // Buttons click
      this.cropButton.addEventListener('click', this.toggleCrop.bind(this));
      this.okButton.addEventListener('click', this.cropCurrentZone.bind(this));
      this.cancelButton.addEventListener('click', this.releaseFocus.bind(this));

      // Canvas events
      this.darkroom.canvas.on('mouse:down', this.onMouseDown.bind(this));
      this.darkroom.canvas.on('mouse:move', this.onMouseMove.bind(this));
      this.darkroom.canvas.on('mouse:up', this.onMouseUp.bind(this));
      this.darkroom.canvas.on('object:moving', this.onObjectMoving.bind(this));
      this.darkroom.canvas.on('object:scaling', this.onObjectScaling.bind(this));

      fabric.util.addListener(fabric.document, 'keydown', this.onKeyDown.bind(this));
      fabric.util.addListener(fabric.document, 'keyup', this.onKeyUp.bind(this));

      this.darkroom.addEventListener('core:transformation', this.releaseFocus.bind(this));
    },

    // Avoid crop zone to go beyond the canvas edges
    onObjectMoving: function(event) {
      if (!this.hasFocus()) {
        return;
      }

      var currentObject = event.target;
      if (currentObject !== this.cropZone) {
        return;
      }

      var canvas = this.darkroom.canvas;
      var x = currentObject.getLeft(), y = currentObject.getTop();
      var w = currentObject.getWidth(), h = currentObject.getHeight();
      var maxX = canvas.getWidth() - w;
      var maxY = canvas.getHeight() - h;

      if (x < 0) {
        currentObject.set('left', 0);
      }
      if (y < 0) {
        currentObject.set('top', 0);
      }
      if (x > maxX) {
        currentObject.set('left', maxX);
      }
      if (y > maxY) {
        currentObject.set('top', maxY);
      }

      this.darkroom.dispatchEvent('crop:update');
    },

    // Prevent crop zone from going beyond the canvas edges (like mouseMove)
    onObjectScaling: function(event) {
      if (!this.hasFocus()) {
        return;
      }

      var preventScaling = false;
      var currentObject = event.target;
      if (currentObject !== this.cropZone) {
        return;
      }

      var canvas = this.darkroom.canvas;
      var pointer = canvas.getPointer(event.e);
      var x = pointer.x;
      var y = pointer.y;

      var minX = currentObject.getLeft();
      var minY = currentObject.getTop();
      var maxX = currentObject.getLeft() + currentObject.getWidth();
      var maxY = currentObject.getTop() + currentObject.getHeight();

      if (null !== this.options.ratio) {
        if (minX < 0 || maxX > canvas.getWidth() || minY < 0 || maxY > canvas.getHeight()) {
          preventScaling = true;
        }
      }

      if (minX < 0 || maxX > canvas.getWidth() || preventScaling) {
        var lastScaleX = this.lastScaleX || 1;
        currentObject.setScaleX(lastScaleX);
      }
      if (minX < 0) {
        currentObject.setLeft(0);
      }
      if (minY < 0 || maxY > canvas.getHeight() || preventScaling) {
        var lastScaleY = this.lastScaleY || 1;
        currentObject.setScaleY(lastScaleY);
      }
      if (minY < 0) {
        currentObject.setTop(0);
      }

      if (currentObject.getWidth() < this.options.minWidth) {
        currentObject.scaleToWidth(this.options.minWidth);
      }
      if (currentObject.getHeight() < this.options.minHeight) {
        currentObject.scaleToHeight(this.options.minHeight);
      }

      this.lastScaleX = currentObject.getScaleX();
      this.lastScaleY = currentObject.getScaleY();

      this.darkroom.dispatchEvent('crop:update');
    },

    // Init crop zone
    onMouseDown: function(event) {
      if (!this.hasFocus()) {
        return;
      }

      var canvas = this.darkroom.canvas;

      // recalculate offset, in case canvas was manipulated since last `calcOffset`
      canvas.calcOffset();
      var pointer = canvas.getPointer(event.e);
      var x = pointer.x;
      var y = pointer.y;
      var point = new fabric.Point(x, y);

      // Check if user want to scale or drag the crop zone.
      var activeObject = canvas.getActiveObject();
      if (activeObject === this.cropZone || this.cropZone.containsPoint(point)) {
        return;
      }

      canvas.discardActiveObject();
      this.cropZone.setWidth(0);
      this.cropZone.setHeight(0);
      this.cropZone.setScaleX(1);
      this.cropZone.setScaleY(1);

      this.startX = x;
      this.startY = y;
    },

    // Extend crop zone
    onMouseMove: function(event) {
      // Quick crop feature
      if (this.isKeyCroping) {
        return this.onMouseMoveKeyCrop(event);
      }

      if (null === this.startX || null === this.startY) {
        return;
      }

      var canvas = this.darkroom.canvas;
      var pointer = canvas.getPointer(event.e);
      var x = pointer.x;
      var y = pointer.y;

      this._renderCropZone(this.startX, this.startY, x, y);
    },

    onMouseMoveKeyCrop: function(event) {
      var canvas = this.darkroom.canvas;
      var zone = this.cropZone;

      var pointer = canvas.getPointer(event.e);
      var x = pointer.x;
      var y = pointer.y;

      if (!zone.left || !zone.top) {
        zone.setTop(y);
        zone.setLeft(x);
      }

      this.isKeyLeft =  x < zone.left + zone.width / 2 ;
      this.isKeyUp = y < zone.top + zone.height / 2 ;

      this._renderCropZone(
        Math.min(zone.left, x),
        Math.min(zone.top, y),
        Math.max(zone.left+zone.width, x),
        Math.max(zone.top+zone.height, y)
      );
    },

    // Finish crop zone
    onMouseUp: function(event) {
      if (null === this.startX || null === this.startY) {
        return;
      }

      var canvas = this.darkroom.canvas;
      this.cropZone.setCoords();
      canvas.setActiveObject(this.cropZone);
      canvas.calcOffset();

      this.startX = null;
      this.startY = null;
    },

    onKeyDown: function(event) {
      if (false === this.options.quickCropKey || event.keyCode !== this.options.quickCropKey || this.isKeyCroping) {
        return;
      }

      // Active quick crop flow
      this.isKeyCroping = true ;
      this.darkroom.canvas.discardActiveObject();
      this.cropZone.setWidth(0);
      this.cropZone.setHeight(0);
      this.cropZone.setScaleX(1);
      this.cropZone.setScaleY(1);
      this.cropZone.setTop(0);
      this.cropZone.setLeft(0);
    },

    onKeyUp: function(event) {
      if (false === this.options.quickCropKey || event.keyCode !== this.options.quickCropKey || !this.isKeyCroping) {
        return;
      }

      // Unactive quick crop flow
      this.isKeyCroping = false;
      this.startX = 1;
      this.startY = 1;
      this.onMouseUp();
    },

    selectZone: function(x, y, width, height, forceDimension) {
      if (!this.hasFocus()) {
        this.requireFocus();
      }

      if (!forceDimension) {
        this._renderCropZone(x, y, x+width, y+height);
      } else {
        this.cropZone.set({
          'left': x,
          'top': y,
          'width': width,
          'height': height
        });
      }

      var canvas = this.darkroom.canvas;
      canvas.bringToFront(this.cropZone);
      this.cropZone.setCoords();
      canvas.setActiveObject(this.cropZone);
      canvas.calcOffset();

      this.darkroom.dispatchEvent('crop:update');
    },

    toggleCrop: function() {
      if (!this.hasFocus()) {
        this.requireFocus();
      } else {
        this.releaseFocus();
      }
    },

    cropCurrentZone: function() {
      if (!this.hasFocus()) {
        return;
      }

      // Avoid croping empty zone
      if (this.cropZone.width < 1 && this.cropZone.height < 1) {
        return;
      }

      var image = this.darkroom.image;

      // Compute crop zone dimensions
      var top = this.cropZone.getTop() - image.getTop();
      var left = this.cropZone.getLeft() - image.getLeft();
      var width = this.cropZone.getWidth();
      var height = this.cropZone.getHeight();

      // Adjust dimensions to image only
      if (top < 0) {
        height += top;
        top = 0;
      }

      if (left < 0) {
        width += left;
        left = 0;
      }

      // Apply crop transformation.
      // Make sure to use relative dimension since the crop will be applied
      // on the source image.
      this.darkroom.applyTransformation(new Crop({
        top: top / image.getHeight(),
        left: left / image.getWidth(),
        width: width / image.getWidth(),
        height: height / image.getHeight(),
      }));
    },

    // Test wether crop zone is set
    hasFocus: function() {
      return this.cropZone !== undefined;
    },

    // Create the crop zone
    requireFocus: function() {
      this.cropZone = new CropZone({
        fill: 'transparent',
        hasBorders: false,
        originX: 'left',
        originY: 'top',
        //stroke: '#444',
        //strokeDashArray: [5, 5],
        //borderColor: '#444',
        cornerColor: '#444',
        cornerSize: 8,
        transparentCorners: false,
        lockRotation: true,
        hasRotatingPoint: false,
      });

      if (null !== this.options.ratio) {
        this.cropZone.set('lockUniScaling', true);
      }

      this.darkroom.canvas.add(this.cropZone);
      this.darkroom.canvas.defaultCursor = 'crosshair';

      this.cropButton.active(true);
      this.okButton.hide(false);
      this.cancelButton.hide(false);
    },

    // Remove the crop zone
    releaseFocus: function() {
      if (undefined === this.cropZone) {
        return;
      }

      this.cropZone.remove();
      this.cropZone = undefined;

      this.cropButton.active(false);
      this.okButton.hide(true);
      this.cancelButton.hide(true);

      this.darkroom.canvas.defaultCursor = 'default';

      this.darkroom.dispatchEvent('crop:update');
    },

    _renderCropZone: function(fromX, fromY, toX, toY) {
      var canvas = this.darkroom.canvas;

      var isRight = (toX > fromX);
      var isLeft = !isRight;
      var isDown = (toY > fromY);
      var isUp = !isDown;

      var minWidth = Math.min(+this.options.minWidth, canvas.getWidth());
      var minHeight = Math.min(+this.options.minHeight, canvas.getHeight());

      // Define corner coordinates
      var leftX = Math.min(fromX, toX);
      var rightX = Math.max(fromX, toX);
      var topY = Math.min(fromY, toY);
      var bottomY = Math.max(fromY, toY);

      // Replace current point into the canvas
      leftX = Math.max(0, leftX);
      rightX = Math.min(canvas.getWidth(), rightX);
      topY = Math.max(0, topY);
      bottomY = Math.min(canvas.getHeight(), bottomY);

      // Recalibrate coordinates according to given options
      if (rightX - leftX < minWidth) {
        if (isRight) {
          rightX = leftX + minWidth;
        } else {
          leftX = rightX - minWidth;
        }
      }
      if (bottomY - topY < minHeight) {
        if (isDown) {
          bottomY = topY + minHeight;
        } else {
          topY = bottomY - minHeight;
        }
      }

      // Truncate truncate according to canvas dimensions
      if (leftX < 0) {
        // Translate to the left
        rightX += Math.abs(leftX);
        leftX = 0;
      }
      if (rightX > canvas.getWidth()) {
        // Translate to the right
        leftX -= (rightX - canvas.getWidth());
        rightX = canvas.getWidth();
      }
      if (topY < 0) {
        // Translate to the bottom
        bottomY += Math.abs(topY);
        topY = 0;
      }
      if (bottomY > canvas.getHeight()) {
        // Translate to the right
        topY -= (bottomY - canvas.getHeight());
        bottomY = canvas.getHeight();
      }

      var width = rightX - leftX;
      var height = bottomY - topY;
      var currentRatio = width / height;

      if (this.options.ratio && +this.options.ratio !== currentRatio) {
        var ratio = +this.options.ratio;

        if(this.isKeyCroping) {
          isLeft = this.isKeyLeft;
          isUp = this.isKeyUp;
        }

        if (currentRatio < ratio) {
          var newWidth = height * ratio;
          if (isLeft) {
            leftX -= (newWidth - width);
          }
          width = newWidth;
        } else if (currentRatio > ratio) {
          var newHeight = height / (ratio * height / width);
          if (isUp) {
            topY -= (newHeight - height);
          }
          height = newHeight;
        }

        if (leftX < 0) {
          leftX = 0;
          //TODO
        }
        if (topY < 0) {
          topY = 0;
          //TODO
        }
        if (leftX + width > canvas.getWidth()) {
          var newWidth = canvas.getWidth() - leftX;
          height = newWidth * height / width;
          width = newWidth;
          if (isUp) {
            topY = fromY - height;
          }
        }
        if (topY + height > canvas.getHeight()) {
          var newHeight = canvas.getHeight() - topY;
          width = width * newHeight / height;
          height = newHeight;
          if (isLeft) {
            leftX = fromX - width;
          }
        }
      }

      // Apply coordinates
      this.cropZone.left = leftX;
      this.cropZone.top = topY;
      this.cropZone.width = width;
      this.cropZone.height = height;

      this.darkroom.canvas.bringToFront(this.cropZone);

      this.darkroom.dispatchEvent('crop:update');
    }
  });

})();
;(function() {
  'use strict';

  Darkroom.plugins.save = Darkroom.Plugin.extend({

    defaults: {
      callback: function() {
        this.darkroom.selfDestroy();
      }
    },

    initialize: function InitializeDarkroomSavePlugin() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.destroyButton = buttonGroup.createButton({
        image: 'save'
      });

      this.destroyButton.addEventListener('click', this.options.callback.bind(this));
    },
  });

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImRhcmtyb29tLmpzIiwicGx1Z2luLmpzIiwidHJhbnNmb3JtYXRpb24uanMiLCJ1aS5qcyIsInV0aWxzLmpzIiwiZGFya3Jvb20uZG93bmxvYWQuanMiLCJkYXJrcm9vbS5oaXN0b3J5LmpzIiwiZGFya3Jvb20ucm90YXRlLmpzIiwiZGFya3Jvb20uY3JvcC5qcyIsImRhcmtyb29tLnNhdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N0ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkYXJrcm9vbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEluamVjdCBTVkcgaWNvbnMgaW50byB0aGUgRE9NXG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGVsZW1lbnQuaWQgPSAnZGFya3Jvb20taWNvbnMnO1xuICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IDA7XG4gIGVsZW1lbnQuc3R5bGUud2lkdGggPSAwO1xuICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gJzwhLS0gaW5qZWN0OnN2ZyAtLT48IS0tIGVuZGluamVjdCAtLT4nO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgd2luZG93LkRhcmtyb29tID0gRGFya3Jvb207XG5cbiAgLy8gQ29yZSBvYmplY3Qgb2YgRGFya3Jvb21KUy5cbiAgLy8gQmFzaWNhbGx5IGl0J3MgYSBzaW5nbGUgb2JqZWN0LCBpbnN0YW5jaWFibGUgdmlhIGFuIGVsZW1lbnRcbiAgLy8gKGl0IGNvdWxkIGJlIGEgQ1NTIHNlbGVjdG9yIG9yIGEgRE9NIGVsZW1lbnQpLCBzb21lIGN1c3RvbSBvcHRpb25zLFxuICAvLyBhbmQgYSBsaXN0IG9mIHBsdWdpbiBvYmplY3RzIChvciBub25lIHRvIHVzZSBkZWZhdWx0IG9uZXMpLlxuICBmdW5jdGlvbiBEYXJrcm9vbShlbGVtZW50LCBvcHRpb25zLCBwbHVnaW5zKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucywgcGx1Z2lucyk7XG4gIH1cblxuICAvLyBDcmVhdGUgYW4gZW1wdHkgbGlzdCBvZiBwbHVnaW4gb2JqZWN0cywgd2hpY2ggd2lsbCBiZSBmaWxsZWQgYnlcbiAgLy8gb3RoZXIgcGx1Z2luIHNjcmlwdHMuIFRoaXMgaXMgdGhlIGRlZmF1bHQgcGx1Z2luIGxpc3QgaWYgbm9uZSBpc1xuICAvLyBzcGVjaWZpZWQgaW4gRGFya3Jvb20nc3MgY29uc3RydWN0b3IuXG4gIERhcmtyb29tLnBsdWdpbnMgPSBbXTtcblxuICBEYXJrcm9vbS5wcm90b3R5cGUgPSB7XG4gICAgLy8gUmVmZXJlbmNlIHRvIHRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50XG4gICAgY29udGFpbmVyRWxlbWVudDogbnVsbCxcblxuICAgIC8vIFJlZmVyZW5jZSB0byB0aGUgRmFicmljIGNhbnZhcyBvYmplY3RcbiAgICBjYW52YXM6IG51bGwsXG5cbiAgICAvLyBSZWZlcmVuY2UgdG8gdGhlIEZhYnJpYyBpbWFnZSBvYmplY3RcbiAgICBpbWFnZTogbnVsbCxcblxuICAgIC8vIFJlZmVyZW5jZSB0byB0aGUgRmFicmljIHNvdXJjZSBjYW52YXMgb2JqZWN0XG4gICAgc291cmNlQ2FudmFzOiBudWxsLFxuXG4gICAgLy8gUmVmZXJlbmNlIHRvIHRoZSBGYWJyaWMgc291cmNlIGltYWdlIG9iamVjdFxuICAgIHNvdXJjZUltYWdlOiBudWxsLFxuXG4gICAgLy8gVHJhY2sgb2YgdGhlIG9yaWdpbmFsIGltYWdlIGVsZW1lbnRcbiAgICBvcmlnaW5hbEltYWdlRWxlbWVudDogbnVsbCxcblxuICAgIC8vIFN0YWNrIG9mIHRyYW5zZm9ybWF0aW9ucyB0byBhcHBseSB0byB0aGUgaW1hZ2Ugc291cmNlXG4gICAgdHJhbnNmb3JtYXRpb25zOiBbXSxcblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAvLyBDYW52YXMgcHJvcGVydGllcyAoZGltZW5zaW9uLCByYXRpbywgY29sb3IpXG4gICAgICBtaW5XaWR0aDogbnVsbCxcbiAgICAgIG1pbkhlaWdodDogbnVsbCxcbiAgICAgIG1heFdpZHRoOiBudWxsLFxuICAgICAgbWF4SGVpZ2h0OiBudWxsLFxuICAgICAgcmF0aW86IG51bGwsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcblxuICAgICAgLy8gUGx1Z2lucyBvcHRpb25zXG4gICAgICBwbHVnaW5zOiB7fSxcblxuICAgICAgLy8gUG9zdC1pbml0aWFsaXNhdGlvbiBjYWxsYmFja1xuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7IC8qIG5vb3AgKi8gfVxuICAgIH0sXG5cbiAgICAvLyBMaXN0IG9mIHRoZSBpbnN0YW5jaWVkIHBsdWdpbnNcbiAgICBwbHVnaW5zOiB7fSxcblxuICAgIC8vIFRoaXMgb3B0aW9ucyBhcmUgYSBtZXJnZSBiZXR3ZWVuIGBkZWZhdWx0c2AgYW5kIHRoZSBvcHRpb25zIHBhc3NlZFxuICAgIC8vIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yXG4gICAgb3B0aW9uczoge30sXG5cbiAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucywgcGx1Z2lucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gRGFya3Jvb20uVXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHRoaXMuZGVmYXVsdHMpO1xuXG4gICAgICBpZiAobnVsbCA9PT0gZWxlbWVudCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudFswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgRE9NL0ZhYnJpYyBlbGVtZW50c1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplRE9NKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplSW1hZ2UoKTtcblxuICAgICAgICAvLyBUaGVuIGluaXRpYWxpemUgdGhlIHBsdWdpbnNcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZVBsdWdpbnMoRGFya3Jvb20ucGx1Z2lucyk7XG5cbiAgICAgICAgLy8gUHVibGljIG1ldGhvZCB0byBhZGp1c3QgaW1hZ2UgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXNcbiAgICAgICAgdGhpcy5yZWZyZXNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIEV4ZWN1dGUgYSBjdXN0b20gY2FsbGJhY2sgYWZ0ZXIgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbGl6ZS5iaW5kKHRoaXMpLmNhbGwoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvL2ltYWdlLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgICBpbWFnZS5zcmMgPSBlbGVtZW50LnNyYztcbiAgICB9LFxuXG4gICAgc2VsZkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWxlbWVudDtcbiAgICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRhaW5lci5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChpbWFnZSwgY29udGFpbmVyKTtcbiAgICAgIH07XG5cbiAgICAgIGltYWdlLnNyYyA9IHRoaXMuc291cmNlSW1hZ2UudG9EYXRhVVJMKCk7XG4gICAgfSxcblxuICAgIC8vIEFkZCBhYmlsaXR5IHRvIGF0dGFjaCBldmVudCBsaXN0ZW5lciBvbiB0aGUgY29yZSBvYmplY3QuXG4gICAgLy8gSXQgdXNlcyB0aGUgY2FudmFzIGVsZW1lbnQgdG8gcHJvY2VzcyBldmVudHMuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGVsID0gdGhpcy5jYW52YXMuZ2V0RWxlbWVudCgpO1xuICAgICAgaWYgKGVsLmFkZEV2ZW50TGlzdGVuZXIpe1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIGlmIChlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgLy8gVXNlIHRoZSBvbGQgd2F5IG9mIGNyZWF0aW5nIGV2ZW50IHRvIGJlIElFIGNvbXBhdGlibGVcbiAgICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9HdWlkZS9FdmVudHMvQ3JlYXRpbmdfYW5kX3RyaWdnZXJpbmdfZXZlbnRzXG4gICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgIGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpO1xuXG4gICAgICB0aGlzLmNhbnZhcy5nZXRFbGVtZW50KCkuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSxcblxuICAgIC8vIEFkanVzdCBpbWFnZSAmIGNhbnZhcyBkaW1lbnNpb24gYWNjb3JkaW5nIHRvIG1pbi9tYXggd2lkdGgvaGVpZ2h0XG4gICAgLy8gYW5kIHJhdGlvIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9ucy5cbiAgICAvLyBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIGVhY2ggaW1hZ2UgdHJhbnNmb3JtYXRpb24uXG4gICAgcmVmcmVzaDogZnVuY3Rpb24obmV4dCkge1xuICAgICAgdmFyIGNsb25lID0gbmV3IEltYWdlKCk7XG4gICAgICBjbG9uZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fcmVwbGFjZUN1cnJlbnRJbWFnZShuZXcgZmFicmljLkltYWdlKGNsb25lKSk7XG5cbiAgICAgICAgaWYgKG5leHQpIG5leHQoKTtcbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIGNsb25lLnNyYyA9IHRoaXMuc291cmNlSW1hZ2UudG9EYXRhVVJMKCk7XG4gICAgfSxcblxuICAgIF9yZXBsYWNlQ3VycmVudEltYWdlOiBmdW5jdGlvbihuZXdJbWFnZSkge1xuICAgICAgaWYgKHRoaXMuaW1hZ2UpIHtcbiAgICAgICAgdGhpcy5pbWFnZS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbWFnZSA9IG5ld0ltYWdlO1xuICAgICAgdGhpcy5pbWFnZS5zZWxlY3RhYmxlID0gZmFsc2U7XG5cbiAgICAgIC8vIEFkanVzdCB3aWR0aCBvciBoZWlnaHQgYWNjb3JkaW5nIHRvIHNwZWNpZmllZCByYXRpb1xuICAgICAgdmFyIHZpZXdwb3J0ID0gRGFya3Jvb20uVXRpbHMuY29tcHV0ZUltYWdlVmlld1BvcnQodGhpcy5pbWFnZSk7XG4gICAgICB2YXIgY2FudmFzV2lkdGggPSB2aWV3cG9ydC53aWR0aDtcbiAgICAgIHZhciBjYW52YXNIZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XG5cbiAgICAgIGlmIChudWxsICE9PSB0aGlzLm9wdGlvbnMucmF0aW8pIHtcbiAgICAgICAgdmFyIGNhbnZhc1JhdGlvID0gK3RoaXMub3B0aW9ucy5yYXRpbztcbiAgICAgICAgdmFyIGN1cnJlbnRSYXRpbyA9IGNhbnZhc1dpZHRoIC8gY2FudmFzSGVpZ2h0O1xuXG4gICAgICAgIGlmIChjdXJyZW50UmF0aW8gPiBjYW52YXNSYXRpbykge1xuICAgICAgICAgIGNhbnZhc0hlaWdodCA9IGNhbnZhc1dpZHRoIC8gY2FudmFzUmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFJhdGlvIDwgY2FudmFzUmF0aW8pIHtcbiAgICAgICAgICBjYW52YXNXaWR0aCA9IGNhbnZhc0hlaWdodCAqIGNhbnZhc1JhdGlvO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZW4gc2NhbGUgdGhlIGltYWdlIHRvIGZpdCBpbnRvIGRpbWVuc2lvbiBsaW1pdHNcbiAgICAgIHZhciBzY2FsZU1pbiA9IDE7XG4gICAgICB2YXIgc2NhbGVNYXggPSAxO1xuICAgICAgdmFyIHNjYWxlWCA9IDE7XG4gICAgICB2YXIgc2NhbGVZID0gMTtcblxuICAgICAgaWYgKG51bGwgIT09IHRoaXMub3B0aW9ucy5tYXhXaWR0aCAmJiB0aGlzLm9wdGlvbnMubWF4V2lkdGggPCBjYW52YXNXaWR0aCkge1xuICAgICAgICBzY2FsZVggPSAgdGhpcy5vcHRpb25zLm1heFdpZHRoIC8gY2FudmFzV2lkdGg7XG4gICAgICB9XG4gICAgICBpZiAobnVsbCAhPT0gdGhpcy5vcHRpb25zLm1heEhlaWdodCAmJiB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IDwgY2FudmFzSGVpZ2h0KSB7XG4gICAgICAgIHNjYWxlWSA9ICB0aGlzLm9wdGlvbnMubWF4SGVpZ2h0IC8gY2FudmFzSGVpZ2h0O1xuICAgICAgfVxuICAgICAgc2NhbGVNaW4gPSBNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSk7XG5cbiAgICAgIHNjYWxlWCA9IDE7XG4gICAgICBzY2FsZVkgPSAxO1xuICAgICAgaWYgKG51bGwgIT09IHRoaXMub3B0aW9ucy5taW5XaWR0aCAmJiB0aGlzLm9wdGlvbnMubWluV2lkdGggPiBjYW52YXNXaWR0aCkge1xuICAgICAgICBzY2FsZVggPSAgdGhpcy5vcHRpb25zLm1pbldpZHRoIC8gY2FudmFzV2lkdGg7XG4gICAgICB9XG4gICAgICBpZiAobnVsbCAhPT0gdGhpcy5vcHRpb25zLm1pbkhlaWdodCAmJiB0aGlzLm9wdGlvbnMubWluSGVpZ2h0ID4gY2FudmFzSGVpZ2h0KSB7XG4gICAgICAgIHNjYWxlWSA9ICB0aGlzLm9wdGlvbnMubWluSGVpZ2h0IC8gY2FudmFzSGVpZ2h0O1xuICAgICAgfVxuICAgICAgc2NhbGVNYXggPSBNYXRoLm1heChzY2FsZVgsIHNjYWxlWSk7XG5cbiAgICAgIHZhciBzY2FsZSA9IHNjYWxlTWF4ICogc2NhbGVNaW47IC8vIG9uZSBzaG91bGQgYmUgZXF1YWxzIHRvIDFcblxuICAgICAgY2FudmFzV2lkdGggKj0gc2NhbGU7XG4gICAgICBjYW52YXNIZWlnaHQgKj0gc2NhbGU7XG5cbiAgICAgIC8vIEZpbmFsbHkgcGxhY2UgdGhlIGltYWdlIGluIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhc1xuICAgICAgdGhpcy5pbWFnZS5zZXRTY2FsZVgoMSAqIHNjYWxlKTtcbiAgICAgIHRoaXMuaW1hZ2Uuc2V0U2NhbGVZKDEgKiBzY2FsZSk7XG4gICAgICB0aGlzLmNhbnZhcy5hZGQodGhpcy5pbWFnZSk7XG4gICAgICB0aGlzLmNhbnZhcy5zZXRXaWR0aChjYW52YXNXaWR0aCk7XG4gICAgICB0aGlzLmNhbnZhcy5zZXRIZWlnaHQoY2FudmFzSGVpZ2h0KTtcbiAgICAgIHRoaXMuY2FudmFzLmNlbnRlck9iamVjdCh0aGlzLmltYWdlKTtcbiAgICAgIHRoaXMuaW1hZ2Uuc2V0Q29vcmRzKCk7XG4gICAgfSxcblxuICAgIC8vIEFwcGx5IHRoZSB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgY3VycmVudCBpbWFnZSBhbmQgc2F2ZSBpdCBpbiB0aGVcbiAgICAvLyB0cmFuc2Zvcm1hdGlvbnMgc3RhY2sgKGluIG9yZGVyIHRvIHJlY29uc3RpdHV0ZSB0aGUgcHJldmlvdXMgc3RhdGVzXG4gICAgLy8gb2YgdGhlIGltYWdlKS5cbiAgICBhcHBseVRyYW5zZm9ybWF0aW9uOiBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbikge1xuICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbnMucHVzaCh0cmFuc2Zvcm1hdGlvbik7XG5cbiAgICAgIHRyYW5zZm9ybWF0aW9uLmFwcGx5VHJhbnNmb3JtYXRpb24oXG4gICAgICAgIHRoaXMuc291cmNlQ2FudmFzLFxuICAgICAgICB0aGlzLnNvdXJjZUltYWdlLFxuICAgICAgICB0aGlzLl9wb3N0VHJhbnNmb3JtYXRpb24uYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgX3Bvc3RUcmFuc2Zvcm1hdGlvbjogZnVuY3Rpb24obmV3SW1hZ2UpIHtcbiAgICAgIGlmIChuZXdJbWFnZSlcbiAgICAgICAgdGhpcy5zb3VyY2VJbWFnZSA9IG5ld0ltYWdlO1xuXG4gICAgICB0aGlzLnJlZnJlc2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnY29yZTp0cmFuc2Zvcm1hdGlvbicpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbWFnZSBmcm9tIG9yaWdpbmFsIGVsZW1lbnQgcGx1cyByZS1hcHBseSBldmVyeVxuICAgIC8vIHRyYW5zZm9ybWF0aW9ucy5cbiAgICByZWluaXRpYWxpemVJbWFnZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNvdXJjZUltYWdlLnJlbW92ZSgpO1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZUltYWdlKCk7XG4gICAgICB0aGlzLl9wb3BUcmFuc2Zvcm1hdGlvbih0aGlzLnRyYW5zZm9ybWF0aW9ucy5zbGljZSgpKTtcbiAgICB9LFxuXG4gICAgX3BvcFRyYW5zZm9ybWF0aW9uOiBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbnMpIHtcbiAgICAgIGlmICgwID09PSB0cmFuc2Zvcm1hdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnY29yZTpyZWluaXRpYWxpemVkJyk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0cmFuc2Zvcm1hdGlvbiA9IHRyYW5zZm9ybWF0aW9ucy5zaGlmdCgpO1xuXG4gICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKG5ld0ltYWdlKSB7XG4gICAgICAgIGlmIChuZXdJbWFnZSkgdGhpcy5zb3VyY2VJbWFnZSA9IG5ld0ltYWdlO1xuICAgICAgICB0aGlzLl9wb3BUcmFuc2Zvcm1hdGlvbih0cmFuc2Zvcm1hdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgdHJhbnNmb3JtYXRpb24uYXBwbHlUcmFuc2Zvcm1hdGlvbihcbiAgICAgICAgdGhpcy5zb3VyY2VDYW52YXMsXG4gICAgICAgIHRoaXMuc291cmNlSW1hZ2UsXG4gICAgICAgIG5leHQuYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgLy8gQ3JlYXRlIHRoZSBET00gZWxlbWVudHMgYW5kIGluc3RhbmNpYXRlIHRoZSBGYWJyaWMgY2FudmFzLlxuICAgIC8vIFRoZSBpbWFnZSBlbGVtZW50IGlzIHJlcGxhY2VkIGJ5IGEgbmV3IGBkaXZgIGVsZW1lbnQuXG4gICAgLy8gSG93ZXZlciB0aGUgb3JpZ2luYWwgaW1hZ2UgaXMgcmUtaW5qZWN0ZWQgaW4gb3JkZXIgdG8ga2VlcCBhIHRyYWNlIG9mIGl0LlxuICAgIF9pbml0aWFsaXplRE9NOiBmdW5jdGlvbihpbWFnZUVsZW1lbnQpIHtcbiAgICAgIC8vIENvbnRhaW5lclxuICAgICAgdmFyIG1haW5Db250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtYWluQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnZGFya3Jvb20tY29udGFpbmVyJztcblxuICAgICAgLy8gVG9vbGJhclxuICAgICAgdmFyIHRvb2xiYXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0b29sYmFyRWxlbWVudC5jbGFzc05hbWUgPSAnZGFya3Jvb20tdG9vbGJhcic7XG4gICAgICBtYWluQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZCh0b29sYmFyRWxlbWVudCk7XG5cbiAgICAgIC8vIFZpZXdwb3J0IGNhbnZhc1xuICAgICAgdmFyIGNhbnZhc0NvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNhbnZhc0NvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2Rhcmtyb29tLWltYWdlLWNvbnRhaW5lcic7XG4gICAgICB2YXIgY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgY2FudmFzQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChjYW52YXNFbGVtZW50KTtcbiAgICAgIG1haW5Db250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGNhbnZhc0NvbnRhaW5lckVsZW1lbnQpO1xuXG4gICAgICAvLyBTb3VyY2UgY2FudmFzXG4gICAgICB2YXIgc291cmNlQ2FudmFzQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgc291cmNlQ2FudmFzQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnZGFya3Jvb20tc291cmNlLWNvbnRhaW5lcic7XG4gICAgICBzb3VyY2VDYW52YXNDb250YWluZXJFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB2YXIgc291cmNlQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgc291cmNlQ2FudmFzQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChzb3VyY2VDYW52YXNFbGVtZW50KTtcbiAgICAgIG1haW5Db250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHNvdXJjZUNhbnZhc0NvbnRhaW5lckVsZW1lbnQpO1xuXG4gICAgICAvLyBPcmlnaW5hbCBpbWFnZVxuICAgICAgaW1hZ2VFbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1haW5Db250YWluZXJFbGVtZW50LCBpbWFnZUVsZW1lbnQpO1xuICAgICAgaW1hZ2VFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBtYWluQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChpbWFnZUVsZW1lbnQpO1xuXG4gICAgICAvLyBJbnN0YW5jaWF0ZSBvYmplY3QgZnJvbSBlbGVtZW50c1xuICAgICAgdGhpcy5jb250YWluZXJFbGVtZW50ID0gbWFpbkNvbnRhaW5lckVsZW1lbnQ7XG4gICAgICB0aGlzLm9yaWdpbmFsSW1hZ2VFbGVtZW50ID0gaW1hZ2VFbGVtZW50O1xuXG4gICAgICB0aGlzLnRvb2xiYXIgPSBuZXcgRGFya3Jvb20uVUkuVG9vbGJhcih0b29sYmFyRWxlbWVudCk7XG5cbiAgICAgIHRoaXMuY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoY2FudmFzRWxlbWVudCwge1xuICAgICAgICBzZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvdXJjZUNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKHNvdXJjZUNhbnZhc0VsZW1lbnQsIHtcbiAgICAgICAgc2VsZWN0aW9uOiBmYWxzZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gSW5zdGFuY2lhdGUgdGhlIEZhYnJpYyBpbWFnZSBvYmplY3QuXG4gICAgLy8gVGhlIGltYWdlIGlzIGNyZWF0ZWQgYXMgYSBzdGF0aWMgZWxlbWVudCB3aXRoIG5vIGNvbnRyb2wsXG4gICAgLy8gdGhlbiBpdCBpcyBhZGQgaW4gdGhlIEZhYnJpYyBjYW52YXMgb2JqZWN0LlxuICAgIF9pbml0aWFsaXplSW1hZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zb3VyY2VJbWFnZSA9IG5ldyBmYWJyaWMuSW1hZ2UodGhpcy5vcmlnaW5hbEltYWdlRWxlbWVudCwge1xuICAgICAgICAvLyBTb21lIG9wdGlvbnMgdG8gbWFrZSB0aGUgaW1hZ2Ugc3RhdGljXG4gICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxuICAgICAgICBldmVudGVkOiBmYWxzZSxcbiAgICAgICAgbG9ja01vdmVtZW50WDogdHJ1ZSxcbiAgICAgICAgbG9ja01vdmVtZW50WTogdHJ1ZSxcbiAgICAgICAgbG9ja1JvdGF0aW9uOiB0cnVlLFxuICAgICAgICBsb2NrU2NhbGluZ1g6IHRydWUsXG4gICAgICAgIGxvY2tTY2FsaW5nWTogdHJ1ZSxcbiAgICAgICAgbG9ja1VuaVNjYWxpbmc6IHRydWUsXG4gICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgaGFzQm9yZGVyczogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zb3VyY2VDYW52YXMuYWRkKHRoaXMuc291cmNlSW1hZ2UpO1xuXG4gICAgICAvLyBBZGp1c3Qgd2lkdGggb3IgaGVpZ2h0IGFjY29yZGluZyB0byBzcGVjaWZpZWQgcmF0aW9cbiAgICAgIHZhciB2aWV3cG9ydCA9IERhcmtyb29tLlV0aWxzLmNvbXB1dGVJbWFnZVZpZXdQb3J0KHRoaXMuc291cmNlSW1hZ2UpO1xuICAgICAgdmFyIGNhbnZhc1dpZHRoID0gdmlld3BvcnQud2lkdGg7XG4gICAgICB2YXIgY2FudmFzSGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xuXG4gICAgICB0aGlzLnNvdXJjZUNhbnZhcy5zZXRXaWR0aChjYW52YXNXaWR0aCk7XG4gICAgICB0aGlzLnNvdXJjZUNhbnZhcy5zZXRIZWlnaHQoY2FudmFzSGVpZ2h0KTtcbiAgICAgIHRoaXMuc291cmNlQ2FudmFzLmNlbnRlck9iamVjdCh0aGlzLnNvdXJjZUltYWdlKTtcbiAgICAgIHRoaXMuc291cmNlSW1hZ2Uuc2V0Q29vcmRzKCk7XG4gICAgfSxcblxuICAgIC8vIEluaXRpYWxpemUgZXZlcnkgcGx1Z2lucy5cbiAgICAvLyBOb3RlIHRoYXQgcGx1Z2lucyBhcmUgaW5zdGFuY2lhdGVkIGluIHRoZSBzYW1lIG9yZGVyIHRoYW4gdGhleVxuICAgIC8vIGFyZSBkZWNsYXJlZCBpbiB0aGUgcGFyYW1ldGVyIG9iamVjdC5cbiAgICBfaW5pdGlhbGl6ZVBsdWdpbnM6IGZ1bmN0aW9uKHBsdWdpbnMpIHtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gcGx1Z2lucykge1xuICAgICAgICB2YXIgcGx1Z2luID0gcGx1Z2luc1tuYW1lXTtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMucGx1Z2luc1tuYW1lXTtcblxuICAgICAgICAvLyBTZXR0aW5nIGZhbHNlIGludG8gdGhlIHBsdWdpbiBvcHRpb25zIHdpbGwgZGlzYWJsZSB0aGUgcGx1Z2luXG4gICAgICAgIGlmIChvcHRpb25zID09PSBmYWxzZSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAvLyBBdm9pZCBhbnkgaXNzdWVzIHdpdGggX3Byb3RvX1xuICAgICAgICBpZiAoIXBsdWdpbnMuaGFzT3duUHJvcGVydHkobmFtZSkpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zW25hbWVdID0gbmV3IHBsdWdpbih0aGlzLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRGFya3Jvb20uUGx1Z2luID0gUGx1Z2luO1xuXG4gIC8vIERlZmluZSBhIHBsdWdpbiBvYmplY3QuIFRoaXMgaXMgdGhlIChhYnN0cmFjdCkgcGFyZW50IGNsYXNzIHdoaWNoXG4gIC8vIGhhcyB0byBiZSBleHRlbmRlZCBmb3IgZWFjaCBwbHVnaW4uXG4gIGZ1bmN0aW9uIFBsdWdpbihkYXJrcm9vbSwgb3B0aW9ucykge1xuICAgIHRoaXMuZGFya3Jvb20gPSBkYXJrcm9vbTtcbiAgICB0aGlzLm9wdGlvbnMgPSBEYXJrcm9vbS5VdGlscy5leHRlbmQob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBQbHVnaW4ucHJvdG90eXBlID0ge1xuICAgIGRlZmF1bHRzOiB7fSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHsgfVxuICB9O1xuXG4gIC8vIEluc3BpcmVkIGJ5IEJhY2tib25lLmpzIGV4dGVuZCBjYXBhYmlsaXR5LlxuICBQbHVnaW4uZXh0ZW5kID0gZnVuY3Rpb24ocHJvdG9Qcm9wcykge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgIHZhciBjaGlsZDtcblxuICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcbiAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQgPSBmdW5jdGlvbigpeyByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgfVxuXG4gICAgRGFya3Jvb20uVXRpbHMuZXh0ZW5kKGNoaWxkLCBwYXJlbnQpO1xuXG4gICAgdmFyIFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uKCl7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfTtcbiAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlKCk7XG5cbiAgICBpZiAocHJvdG9Qcm9wcykgRGFya3Jvb20uVXRpbHMuZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG5cbiAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRGFya3Jvb20uVHJhbnNmb3JtYXRpb24gPSBUcmFuc2Zvcm1hdGlvbjtcblxuICBmdW5jdGlvbiBUcmFuc2Zvcm1hdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIFRyYW5zZm9ybWF0aW9uLnByb3RvdHlwZSA9IHtcbiAgICBhcHBseVRyYW5zZm9ybWF0aW9uOiBmdW5jdGlvbihpbWFnZSkgeyAvKiBuby1vcCAqLyAgfVxuICB9O1xuXG4gIC8vIEluc3BpcmVkIGJ5IEJhY2tib25lLmpzIGV4dGVuZCBjYXBhYmlsaXR5LlxuICBUcmFuc2Zvcm1hdGlvbi5leHRlbmQgPSBmdW5jdGlvbihwcm90b1Byb3BzKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZCA9IGZ1bmN0aW9uKCl7IHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICB9XG5cbiAgICBEYXJrcm9vbS5VdGlscy5leHRlbmQoY2hpbGQsIHBhcmVudCk7XG5cbiAgICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9O1xuICAgIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGUoKTtcblxuICAgIGlmIChwcm90b1Byb3BzKSBEYXJrcm9vbS5VdGlscy5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcblxuICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBEYXJrcm9vbS5VSSA9IHtcbiAgICBUb29sYmFyOiBUb29sYmFyLFxuICAgIEJ1dHRvbkdyb3VwOiBCdXR0b25Hcm91cCxcbiAgICBCdXR0b246IEJ1dHRvbixcbiAgfTtcblxuICAvLyBUb29sYmFyIG9iamVjdC5cbiAgZnVuY3Rpb24gVG9vbGJhcihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuXG4gIFRvb2xiYXIucHJvdG90eXBlID0ge1xuICAgIGNyZWF0ZUJ1dHRvbkdyb3VwOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgYnV0dG9uR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGJ1dHRvbkdyb3VwLmNsYXNzTmFtZSA9ICdkYXJrcm9vbS1idXR0b24tZ3JvdXAnO1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkdyb3VwKTtcblxuICAgICAgcmV0dXJuIG5ldyBCdXR0b25Hcm91cChidXR0b25Hcm91cCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEJ1dHRvbkdyb3VwIG9iamVjdC5cbiAgZnVuY3Rpb24gQnV0dG9uR3JvdXAoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cblxuICBCdXR0b25Hcm91cC5wcm90b3R5cGUgPSB7XG4gICAgY3JlYXRlQnV0dG9uOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIGltYWdlOiAnaGVscCcsXG4gICAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICAgICAgZ3JvdXA6ICdkZWZhdWx0JyxcbiAgICAgICAgaGlkZTogZmFsc2UsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgb3B0aW9ucyA9IERhcmtyb29tLlV0aWxzLmV4dGVuZChvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAgIHZhciBidXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBidXR0b25FbGVtZW50LnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGJ1dHRvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ2Rhcmtyb29tLWJ1dHRvbiBkYXJrcm9vbS1idXR0b24tJyArIG9wdGlvbnMudHlwZTtcbiAgICAgIGJ1dHRvbkVsZW1lbnQuaW5uZXJIVE1MID0gJzxzdmcgY2xhc3M9XCJkYXJrcm9vbS1pY29uXCI+PHVzZSB4bGluazpocmVmPVwiIycgKyBvcHRpb25zLmltYWdlICsgJ1wiIC8+PC9zdmc+JztcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b25FbGVtZW50KTtcblxuICAgICAgdmFyIGJ1dHRvbiA9IG5ldyBCdXR0b24oYnV0dG9uRWxlbWVudCk7XG4gICAgICBidXR0b24uaGlkZShvcHRpb25zLmhpZGUpO1xuICAgICAgYnV0dG9uLmRpc2FibGUob3B0aW9ucy5kaXNhYmxlZCk7XG5cbiAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuICB9O1xuXG4gIC8vIEJ1dHRvbiBvYmplY3QuXG4gIGZ1bmN0aW9uIEJ1dHRvbihlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUgPSB7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgbGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSxcbiAgICBhY3RpdmU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUpXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrcm9vbS1idXR0b24tYWN0aXZlJyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrcm9vbS1idXR0b24tYWN0aXZlJyk7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlKVxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGFya3Jvb20tYnV0dG9uLWhpZGRlbicpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFya3Jvb20tYnV0dG9uLWhpZGRlbicpO1xuICAgIH0sXG4gICAgZGlzYWJsZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5kaXNhYmxlZCA9ICh2YWx1ZSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRGFya3Jvb20uVXRpbHMgPSB7XG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgY29tcHV0ZUltYWdlVmlld1BvcnQ6IGNvbXB1dGVJbWFnZVZpZXdQb3J0LFxuICB9O1xuXG5cbiAgLy8gVXRpbGl0eSBtZXRob2QgdG8gZWFzaWx5IGV4dGVuZCBvYmplY3RzLlxuICBmdW5jdGlvbiBleHRlbmQoYiwgYSkge1xuICAgIHZhciBwcm9wO1xuICAgIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmb3IgKHByb3AgaW4gYSkge1xuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgYi5oYXNPd25Qcm9wZXJ0eShwcm9wKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYltwcm9wXSA9IGFbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZUltYWdlVmlld1BvcnQoaW1hZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBNYXRoLmFicyhpbWFnZS5nZXRXaWR0aCgpICogKE1hdGguc2luKGltYWdlLmdldEFuZ2xlKCkgKiBNYXRoLlBJIC8gMTgwKSkpICsgTWF0aC5hYnMoaW1hZ2UuZ2V0SGVpZ2h0KCkgKiAoTWF0aC5jb3MoaW1hZ2UuZ2V0QW5nbGUoKSAqIE1hdGguUEkgLyAxODApKSksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoaW1hZ2UuZ2V0SGVpZ2h0KCkgKiAoTWF0aC5zaW4oaW1hZ2UuZ2V0QW5nbGUoKSAqIE1hdGguUEkgLyAxODApKSkgKyBNYXRoLmFicyhpbWFnZS5nZXRXaWR0aCgpICogKE1hdGguY29zKGltYWdlLmdldEFuZ2xlKCkgKiBNYXRoLlBJIC8gMTgwKSkpLFxuICAgIH07XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIERhcmtyb29tLnBsdWdpbnMuZG93bmxvYWQgPSBEYXJrcm9vbS5QbHVnaW4uZXh0ZW5kKHtcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBiYXNlNjRFbmNvZGVkSW1hZ2UgPSB0aGlzLmRhcmtyb29tLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgdmFyIGEgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBhLmhyZWYgPSBiYXNlNjRFbmNvZGVkSW1hZ2U7XG4gICAgICAgIGEuZG93bmxvYWQgPSAnZG93bmxvYWQucG5nJztcbiAgICAgICAgYS5jbGljaygpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiBJbml0aWFsaXplRGFya3Jvb21TYXZlUGx1Z2luKCkge1xuICAgICAgdmFyIGJ1dHRvbkdyb3VwID0gdGhpcy5kYXJrcm9vbS50b29sYmFyLmNyZWF0ZUJ1dHRvbkdyb3VwKCk7XG5cbiAgICAgIHRoaXMuZGVzdHJveUJ1dHRvbiA9IGJ1dHRvbkdyb3VwLmNyZWF0ZUJ1dHRvbih7XG4gICAgICAgIGltYWdlOiAnZG93bmxvYWQnXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kZXN0cm95QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcHRpb25zLmNhbGxiYWNrLmJpbmQodGhpcykpO1xuICAgIH0sXG4gIH0pO1xuXG59KSgpO1xuIiwiOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBEYXJrcm9vbSwgZmFicmljKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBEYXJrcm9vbS5wbHVnaW5zLmhpc3RvcnkgPSBEYXJrcm9vbS5QbHVnaW4uZXh0ZW5kKHtcbiAgICB1bmRvVHJhbnNmb3JtYXRpb25zOiBbXSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIEluaXREYXJrcm9vbUhpc3RvcnlQbHVnaW4oKSB7XG4gICAgICB0aGlzLl9pbml0QnV0dG9ucygpO1xuXG4gICAgICB0aGlzLmRhcmtyb29tLmFkZEV2ZW50TGlzdGVuZXIoJ2NvcmU6dHJhbnNmb3JtYXRpb24nLCB0aGlzLl9vblRyYW5mb3JtYXRpb25BcHBsaWVkLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICB1bmRvOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmRhcmtyb29tLnRyYW5zZm9ybWF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGFzdFRyYW5zZm9ybWF0aW9uID0gdGhpcy5kYXJrcm9vbS50cmFuc2Zvcm1hdGlvbnMucG9wKCk7XG4gICAgICB0aGlzLnVuZG9UcmFuc2Zvcm1hdGlvbnMudW5zaGlmdChsYXN0VHJhbnNmb3JtYXRpb24pO1xuXG4gICAgICB0aGlzLmRhcmtyb29tLnJlaW5pdGlhbGl6ZUltYWdlKCk7XG4gICAgICB0aGlzLl91cGRhdGVCdXR0b25zKCk7XG4gICAgfSxcblxuICAgIHJlZG86IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudW5kb1RyYW5zZm9ybWF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FuY2VsVHJhbnNmb3JtYXRpb24gPSB0aGlzLnVuZG9UcmFuc2Zvcm1hdGlvbnMuc2hpZnQoKTtcbiAgICAgIHRoaXMuZGFya3Jvb20udHJhbnNmb3JtYXRpb25zLnB1c2goY2FuY2VsVHJhbnNmb3JtYXRpb24pO1xuXG4gICAgICB0aGlzLmRhcmtyb29tLnJlaW5pdGlhbGl6ZUltYWdlKCk7XG4gICAgICB0aGlzLl91cGRhdGVCdXR0b25zKCk7XG4gICAgfSxcblxuICAgIF9pbml0QnV0dG9uczogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYnV0dG9uR3JvdXAgPSB0aGlzLmRhcmtyb29tLnRvb2xiYXIuY3JlYXRlQnV0dG9uR3JvdXAoKTtcblxuICAgICAgdGhpcy5iYWNrQnV0dG9uID0gYnV0dG9uR3JvdXAuY3JlYXRlQnV0dG9uKHtcbiAgICAgICAgaW1hZ2U6ICd1bmRvJyxcbiAgICAgICAgZGlzYWJsZWQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmZvcndhcmRCdXR0b24gPSBidXR0b25Hcm91cC5jcmVhdGVCdXR0b24oe1xuICAgICAgICBpbWFnZTogJ3JlZG8nLFxuICAgICAgICBkaXNhYmxlZDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudW5kby5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZm9yd2FyZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVkby5iaW5kKHRoaXMpKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91cGRhdGVCdXR0b25zOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYmFja0J1dHRvbi5kaXNhYmxlKCh0aGlzLmRhcmtyb29tLnRyYW5zZm9ybWF0aW9ucy5sZW5ndGggPT09IDApKTtcbiAgICAgIHRoaXMuZm9yd2FyZEJ1dHRvbi5kaXNhYmxlKCh0aGlzLnVuZG9UcmFuc2Zvcm1hdGlvbnMubGVuZ3RoID09PSAwKSk7XG4gICAgfSxcblxuICAgIF9vblRyYW5mb3JtYXRpb25BcHBsaWVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudW5kb1RyYW5zZm9ybWF0aW9ucyA9IFtdO1xuICAgICAgdGhpcy5fdXBkYXRlQnV0dG9ucygpO1xuICAgIH1cbiAgfSk7XG59KSh3aW5kb3csIGRvY3VtZW50LCBEYXJrcm9vbSwgZmFicmljKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBSb3RhdGlvbiA9IERhcmtyb29tLlRyYW5zZm9ybWF0aW9uLmV4dGVuZCh7XG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbjogZnVuY3Rpb24oY2FudmFzLCBpbWFnZSwgbmV4dCkge1xuICAgICAgdmFyIGFuZ2xlID0gKGltYWdlLmdldEFuZ2xlKCkgKyB0aGlzLm9wdGlvbnMuYW5nbGUpICUgMzYwO1xuICAgICAgaW1hZ2Uucm90YXRlKGFuZ2xlKTtcblxuICAgICAgdmFyIHdpZHRoLCBoZWlnaHQ7XG4gICAgICBoZWlnaHQgPSBNYXRoLmFicyhpbWFnZS5nZXRXaWR0aCgpKihNYXRoLnNpbihhbmdsZSpNYXRoLlBJLzE4MCkpKStNYXRoLmFicyhpbWFnZS5nZXRIZWlnaHQoKSooTWF0aC5jb3MoYW5nbGUqTWF0aC5QSS8xODApKSk7XG4gICAgICB3aWR0aCA9IE1hdGguYWJzKGltYWdlLmdldEhlaWdodCgpKihNYXRoLnNpbihhbmdsZSpNYXRoLlBJLzE4MCkpKStNYXRoLmFicyhpbWFnZS5nZXRXaWR0aCgpKihNYXRoLmNvcyhhbmdsZSpNYXRoLlBJLzE4MCkpKTtcblxuICAgICAgY2FudmFzLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgIGNhbnZhcy5zZXRIZWlnaHQoaGVpZ2h0KTtcblxuICAgICAgY2FudmFzLmNlbnRlck9iamVjdChpbWFnZSk7XG4gICAgICBpbWFnZS5zZXRDb29yZHMoKTtcbiAgICAgIGNhbnZhcy5yZW5kZXJBbGwoKTtcblxuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgRGFya3Jvb20ucGx1Z2lucy5yb3RhdGUgPSBEYXJrcm9vbS5QbHVnaW4uZXh0ZW5kKHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIEluaXREYXJrcm9vbVJvdGF0ZVBsdWdpbigpIHtcbiAgICAgIHZhciBidXR0b25Hcm91cCA9IHRoaXMuZGFya3Jvb20udG9vbGJhci5jcmVhdGVCdXR0b25Hcm91cCgpO1xuXG4gICAgICB2YXIgbGVmdEJ1dHRvbiA9IGJ1dHRvbkdyb3VwLmNyZWF0ZUJ1dHRvbih7XG4gICAgICAgIGltYWdlOiAncm90YXRlLWxlZnQnXG4gICAgICB9KTtcblxuICAgICAgdmFyIHJpZ2h0QnV0dG9uID0gYnV0dG9uR3JvdXAuY3JlYXRlQnV0dG9uKHtcbiAgICAgICAgaW1hZ2U6ICdyb3RhdGUtcmlnaHQnXG4gICAgICB9KTtcblxuICAgICAgbGVmdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucm90YXRlTGVmdC5iaW5kKHRoaXMpKTtcbiAgICAgIHJpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5yb3RhdGVSaWdodC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgcm90YXRlTGVmdDogZnVuY3Rpb24gcm90YXRlTGVmdCgpIHtcbiAgICAgIHRoaXMucm90YXRlKC05MCk7XG4gICAgfSxcblxuICAgIHJvdGF0ZVJpZ2h0OiBmdW5jdGlvbiByb3RhdGVSaWdodCgpIHtcbiAgICAgIHRoaXMucm90YXRlKDkwKTtcbiAgICB9LFxuXG4gICAgcm90YXRlOiBmdW5jdGlvbiByb3RhdGUoYW5nbGUpIHtcbiAgICAgIHRoaXMuZGFya3Jvb20uYXBwbHlUcmFuc2Zvcm1hdGlvbihcbiAgICAgICAgbmV3IFJvdGF0aW9uKHthbmdsZTogYW5nbGV9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgQ3JvcCA9IERhcmtyb29tLlRyYW5zZm9ybWF0aW9uLmV4dGVuZCh7XG4gICAgYXBwbHlUcmFuc2Zvcm1hdGlvbjogZnVuY3Rpb24oY2FudmFzLCBpbWFnZSwgbmV4dCkge1xuICAgICAgLy8gU25hcHNob3QgdGhlIGltYWdlIGRlbGltaXRlZCBieSB0aGUgY3JvcCB6b25lXG4gICAgICB2YXIgc25hcHNob3QgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIHNuYXBzaG90Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBWYWxpZGF0ZSBpbWFnZVxuICAgICAgICBpZiAoaGVpZ2h0IDwgMSB8fCB3aWR0aCA8IDEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW1nSW5zdGFuY2UgPSBuZXcgZmFicmljLkltYWdlKHRoaXMsIHtcbiAgICAgICAgICAvLyBvcHRpb25zIHRvIG1ha2UgdGhlIGltYWdlIHN0YXRpY1xuICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxuICAgICAgICAgIGV2ZW50ZWQ6IGZhbHNlLFxuICAgICAgICAgIGxvY2tNb3ZlbWVudFg6IHRydWUsXG4gICAgICAgICAgbG9ja01vdmVtZW50WTogdHJ1ZSxcbiAgICAgICAgICBsb2NrUm90YXRpb246IHRydWUsXG4gICAgICAgICAgbG9ja1NjYWxpbmdYOiB0cnVlLFxuICAgICAgICAgIGxvY2tTY2FsaW5nWTogdHJ1ZSxcbiAgICAgICAgICBsb2NrVW5pU2NhbGluZzogdHJ1ZSxcbiAgICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXG4gICAgICAgICAgaGFzQm9yZGVyczogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBjYW52YXMgc2l6ZVxuICAgICAgICBjYW52YXMuc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICBjYW52YXMuc2V0SGVpZ2h0KGhlaWdodCk7XG5cbiAgICAgICAgLy8gQWRkIGltYWdlXG4gICAgICAgIGltYWdlLnJlbW92ZSgpO1xuICAgICAgICBjYW52YXMuYWRkKGltZ0luc3RhbmNlKTtcblxuICAgICAgICBuZXh0KGltZ0luc3RhbmNlKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciB2aWV3cG9ydCA9IERhcmtyb29tLlV0aWxzLmNvbXB1dGVJbWFnZVZpZXdQb3J0KGltYWdlKTtcbiAgICAgIHZhciBpbWFnZVdpZHRoID0gdmlld3BvcnQud2lkdGg7XG4gICAgICB2YXIgaW1hZ2VIZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XG5cbiAgICAgIHZhciBsZWZ0ID0gdGhpcy5vcHRpb25zLmxlZnQgKiBpbWFnZVdpZHRoO1xuICAgICAgdmFyIHRvcCA9IHRoaXMub3B0aW9ucy50b3AgKiBpbWFnZUhlaWdodDtcbiAgICAgIHZhciB3aWR0aCA9IE1hdGgubWluKHRoaXMub3B0aW9ucy53aWR0aCAqIGltYWdlV2lkdGgsIGltYWdlV2lkdGggLSBsZWZ0KTtcbiAgICAgIHZhciBoZWlnaHQgPSBNYXRoLm1pbih0aGlzLm9wdGlvbnMuaGVpZ2h0ICogaW1hZ2VIZWlnaHQsIGltYWdlSGVpZ2h0IC0gdG9wKTtcblxuICAgICAgc25hcHNob3Quc3JjID0gY2FudmFzLnRvRGF0YVVSTCh7XG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHRvcDogdG9wLFxuICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgQ3JvcFpvbmUgPSBmYWJyaWMudXRpbC5jcmVhdGVDbGFzcyhmYWJyaWMuUmVjdCwge1xuICAgIF9yZW5kZXI6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgdGhpcy5jYWxsU3VwZXIoJ19yZW5kZXInLCBjdHgpO1xuXG4gICAgICB2YXIgY2FudmFzID0gY3R4LmNhbnZhcztcbiAgICAgIHZhciBkYXNoV2lkdGggPSA3O1xuXG4gICAgICAvLyBTZXQgb3JpZ2luYWwgc2NhbGVcbiAgICAgIHZhciBmbGlwWCA9IHRoaXMuZmxpcFggPyAtMSA6IDE7XG4gICAgICB2YXIgZmxpcFkgPSB0aGlzLmZsaXBZID8gLTEgOiAxO1xuICAgICAgdmFyIHNjYWxlWCA9IGZsaXBYIC8gdGhpcy5zY2FsZVg7XG4gICAgICB2YXIgc2NhbGVZID0gZmxpcFkgLyB0aGlzLnNjYWxlWTtcblxuICAgICAgY3R4LnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcblxuICAgICAgLy8gT3ZlcmxheSByZW5kZXJpbmdcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcbiAgICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoY3R4KTtcblxuICAgICAgLy8gU2V0IGRhc2hlZCBib3JkZXJzXG4gICAgICBpZiAoY3R4LnNldExpbmVEYXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFtkYXNoV2lkdGgsIGRhc2hXaWR0aF0pO1xuICAgICAgfSBlbHNlIGlmIChjdHgubW96RGFzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGN0eC5tb3pEYXNoID0gW2Rhc2hXaWR0aCwgZGFzaFdpZHRoXTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgbGluZXMgcmVuZGVyaW5nIHdpdGggYmxhY2tcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuMiknO1xuICAgICAgdGhpcy5fcmVuZGVyQm9yZGVycyhjdHgpO1xuICAgICAgdGhpcy5fcmVuZGVyR3JpZChjdHgpO1xuXG4gICAgICAvLyBSZSByZW5kZXIgbGluZXMgaW4gd2hpdGVcbiAgICAgIGN0eC5saW5lRGFzaE9mZnNldCA9IGRhc2hXaWR0aDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCknO1xuICAgICAgdGhpcy5fcmVuZGVyQm9yZGVycyhjdHgpO1xuICAgICAgdGhpcy5fcmVuZGVyR3JpZChjdHgpO1xuXG4gICAgICAvLyBSZXNldCBzY2FsZVxuICAgICAgY3R4LnNjYWxlKDEvc2NhbGVYLCAxL3NjYWxlWSk7XG4gICAgfSxcblxuICAgIF9yZW5kZXJPdmVybGF5OiBmdW5jdGlvbihjdHgpIHtcbiAgICAgIHZhciBjYW52YXMgPSBjdHguY2FudmFzO1xuXG4gICAgICAvL1xuICAgICAgLy8gICAgeDAgICAgeDEgICAgICAgIHgyICAgICAgeDNcbiAgICAgIC8vIHkwICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAvLyAgICB8XFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcfFxuICAgICAgLy8gICAgfFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXHxcbiAgICAgIC8vIHkxICstLS0tLS0rLS0tLS0tLS0tKy0tLS0tLS0rXG4gICAgICAvLyAgICB8XFxcXFxcXFxcXFxcfCAgICAgICAgIHxcXFxcXFxcXFxcXFxcXHxcbiAgICAgIC8vICAgIHxcXFxcXFxcXFxcXFx8ICAgIDAgICAgfFxcXFxcXFxcXFxcXFxcfFxuICAgICAgLy8gICAgfFxcXFxcXFxcXFxcXHwgICAgICAgICB8XFxcXFxcXFxcXFxcXFx8XG4gICAgICAvLyB5MiArLS0tLS0tKy0tLS0tLS0tLSstLS0tLS0tK1xuICAgICAgLy8gICAgfFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXHxcbiAgICAgIC8vICAgIHxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFx8XG4gICAgICAvLyB5MyArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgLy9cblxuICAgICAgdmFyIHgwID0gTWF0aC5jZWlsKC10aGlzLmdldFdpZHRoKCkgLyAyIC0gdGhpcy5nZXRMZWZ0KCkpO1xuICAgICAgdmFyIHgxID0gTWF0aC5jZWlsKC10aGlzLmdldFdpZHRoKCkgLyAyKTtcbiAgICAgIHZhciB4MiA9IE1hdGguY2VpbCh0aGlzLmdldFdpZHRoKCkgLyAyKTtcbiAgICAgIHZhciB4MyA9IE1hdGguY2VpbCh0aGlzLmdldFdpZHRoKCkgLyAyICsgKGNhbnZhcy53aWR0aCAtIHRoaXMuZ2V0V2lkdGgoKSAtIHRoaXMuZ2V0TGVmdCgpKSk7XG5cbiAgICAgIHZhciB5MCA9IE1hdGguY2VpbCgtdGhpcy5nZXRIZWlnaHQoKSAvIDIgLSB0aGlzLmdldFRvcCgpKTtcbiAgICAgIHZhciB5MSA9IE1hdGguY2VpbCgtdGhpcy5nZXRIZWlnaHQoKSAvIDIpO1xuICAgICAgdmFyIHkyID0gTWF0aC5jZWlsKHRoaXMuZ2V0SGVpZ2h0KCkgLyAyKTtcbiAgICAgIHZhciB5MyA9IE1hdGguY2VpbCh0aGlzLmdldEhlaWdodCgpIC8gMiArIChjYW52YXMuaGVpZ2h0IC0gdGhpcy5nZXRIZWlnaHQoKSAtIHRoaXMuZ2V0VG9wKCkpKTtcblxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAvLyBEcmF3IG91dGVyIHJlY3RhbmdsZS5cbiAgICAgIC8vIE51bWJlcnMgYXJlICsvLTEgc28gdGhhdCBvdmVybGF5IGVkZ2VzIGRvbid0IGdldCBibHVycnkuXG4gICAgICBjdHgubW92ZVRvKHgwIC0gMSwgeTAgLSAxKTtcbiAgICAgIGN0eC5saW5lVG8oeDMgKyAxLCB5MCAtIDEpO1xuICAgICAgY3R4LmxpbmVUbyh4MyArIDEsIHkzICsgMSk7XG4gICAgICBjdHgubGluZVRvKHgwIC0gMSwgeTMgLSAxKTtcbiAgICAgIGN0eC5saW5lVG8oeDAgLSAxLCB5MCAtIDEpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAvLyBEcmF3IGlubmVyIHJlY3RhbmdsZS5cbiAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgIGN0eC5saW5lVG8oeDEsIHkyKTtcbiAgICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICAgIGN0eC5saW5lVG8oeDIsIHkxKTtcbiAgICAgIGN0eC5saW5lVG8oeDEsIHkxKTtcblxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9LFxuXG4gICAgX3JlbmRlckJvcmRlcnM6IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygtdGhpcy5nZXRXaWR0aCgpLzIsIC10aGlzLmdldEhlaWdodCgpLzIpOyAvLyB1cHBlciBsZWZ0XG4gICAgICBjdHgubGluZVRvKHRoaXMuZ2V0V2lkdGgoKS8yLCAtdGhpcy5nZXRIZWlnaHQoKS8yKTsgLy8gdXBwZXIgcmlnaHRcbiAgICAgIGN0eC5saW5lVG8odGhpcy5nZXRXaWR0aCgpLzIsIHRoaXMuZ2V0SGVpZ2h0KCkvMik7IC8vIGRvd24gcmlnaHRcbiAgICAgIGN0eC5saW5lVG8oLXRoaXMuZ2V0V2lkdGgoKS8yLCB0aGlzLmdldEhlaWdodCgpLzIpOyAvLyBkb3duIGxlZnRcbiAgICAgIGN0eC5saW5lVG8oLXRoaXMuZ2V0V2lkdGgoKS8yLCAtdGhpcy5nZXRIZWlnaHQoKS8yKTsgLy8gdXBwZXIgbGVmdFxuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG5cbiAgICBfcmVuZGVyR3JpZDogZnVuY3Rpb24oY3R4KSB7XG4gICAgICAvLyBWZXJ0aWNhbCBsaW5lc1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygtdGhpcy5nZXRXaWR0aCgpLzIgKyAxLzMgKiB0aGlzLmdldFdpZHRoKCksIC10aGlzLmdldEhlaWdodCgpLzIpO1xuICAgICAgY3R4LmxpbmVUbygtdGhpcy5nZXRXaWR0aCgpLzIgKyAxLzMgKiB0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCkvMik7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC10aGlzLmdldFdpZHRoKCkvMiArIDIvMyAqIHRoaXMuZ2V0V2lkdGgoKSwgLXRoaXMuZ2V0SGVpZ2h0KCkvMik7XG4gICAgICBjdHgubGluZVRvKC10aGlzLmdldFdpZHRoKCkvMiArIDIvMyAqIHRoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKS8yKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIC8vIEhvcml6b250YWwgbGluZXNcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oLXRoaXMuZ2V0V2lkdGgoKS8yLCAtdGhpcy5nZXRIZWlnaHQoKS8yICsgMS8zICogdGhpcy5nZXRIZWlnaHQoKSk7XG4gICAgICBjdHgubGluZVRvKHRoaXMuZ2V0V2lkdGgoKS8yLCAtdGhpcy5nZXRIZWlnaHQoKS8yICsgMS8zICogdGhpcy5nZXRIZWlnaHQoKSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC10aGlzLmdldFdpZHRoKCkvMiwgLXRoaXMuZ2V0SGVpZ2h0KCkvMiArIDIvMyAqIHRoaXMuZ2V0SGVpZ2h0KCkpO1xuICAgICAgY3R4LmxpbmVUbyh0aGlzLmdldFdpZHRoKCkvMiwgLXRoaXMuZ2V0SGVpZ2h0KCkvMiArIDIvMyAqIHRoaXMuZ2V0SGVpZ2h0KCkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgRGFya3Jvb20ucGx1Z2lucy5jcm9wID0gRGFya3Jvb20uUGx1Z2luLmV4dGVuZCh7XG4gICAgLy8gSW5pdCBwb2ludFxuICAgIHN0YXJ0WDogbnVsbCxcbiAgICBzdGFydFk6IG51bGwsXG5cbiAgICAvLyBLZXljcm9wXG4gICAgaXNLZXlDcm9waW5nOiBmYWxzZSxcbiAgICBpc0tleUxlZnQ6IGZhbHNlLFxuICAgIGlzS2V5VXA6IGZhbHNlLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIC8vIG1pbiBjcm9wIGRpbWVuc2lvblxuICAgICAgbWluSGVpZ2h0OiAxLFxuICAgICAgbWluV2lkdGg6IDEsXG4gICAgICAvLyBlbnN1cmUgY3JvcCByYXRpb1xuICAgICAgcmF0aW86IG51bGwsXG4gICAgICAvLyBxdWljayBjcm9wIGZlYXR1cmUgKHNldCBhIGtleSBjb2RlIHRvIGVuYWJsZSBpdClcbiAgICAgIHF1aWNrQ3JvcEtleTogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gSW5pdERhcmtyb29tQ3JvcFBsdWdpbigpIHtcbiAgICAgIHZhciBidXR0b25Hcm91cCA9IHRoaXMuZGFya3Jvb20udG9vbGJhci5jcmVhdGVCdXR0b25Hcm91cCgpO1xuXG4gICAgICB0aGlzLmNyb3BCdXR0b24gPSBidXR0b25Hcm91cC5jcmVhdGVCdXR0b24oe1xuICAgICAgICBpbWFnZTogJ2Nyb3AnXG4gICAgICB9KTtcbiAgICAgIHRoaXMub2tCdXR0b24gPSBidXR0b25Hcm91cC5jcmVhdGVCdXR0b24oe1xuICAgICAgICBpbWFnZTogJ2RvbmUnLFxuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIGhpZGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jYW5jZWxCdXR0b24gPSBidXR0b25Hcm91cC5jcmVhdGVCdXR0b24oe1xuICAgICAgICBpbWFnZTogJ2Nsb3NlJyxcbiAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgIGhpZGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBCdXR0b25zIGNsaWNrXG4gICAgICB0aGlzLmNyb3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZUNyb3AuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLm9rQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jcm9wQ3VycmVudFpvbmUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVsZWFzZUZvY3VzLmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBDYW52YXMgZXZlbnRzXG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5vbignbW91c2U6ZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5vbignbW91c2U6bW92ZScsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5vbignbW91c2U6dXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGFya3Jvb20uY2FudmFzLm9uKCdvYmplY3Q6bW92aW5nJywgdGhpcy5vbk9iamVjdE1vdmluZy5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGFya3Jvb20uY2FudmFzLm9uKCdvYmplY3Q6c2NhbGluZycsIHRoaXMub25PYmplY3RTY2FsaW5nLmJpbmQodGhpcykpO1xuXG4gICAgICBmYWJyaWMudXRpbC5hZGRMaXN0ZW5lcihmYWJyaWMuZG9jdW1lbnQsICdrZXlkb3duJywgdGhpcy5vbktleURvd24uYmluZCh0aGlzKSk7XG4gICAgICBmYWJyaWMudXRpbC5hZGRMaXN0ZW5lcihmYWJyaWMuZG9jdW1lbnQsICdrZXl1cCcsIHRoaXMub25LZXlVcC5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5kYXJrcm9vbS5hZGRFdmVudExpc3RlbmVyKCdjb3JlOnRyYW5zZm9ybWF0aW9uJywgdGhpcy5yZWxlYXNlRm9jdXMuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIC8vIEF2b2lkIGNyb3Agem9uZSB0byBnbyBiZXlvbmQgdGhlIGNhbnZhcyBlZGdlc1xuICAgIG9uT2JqZWN0TW92aW5nOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudE9iamVjdCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGlmIChjdXJyZW50T2JqZWN0ICE9PSB0aGlzLmNyb3Bab25lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZGFya3Jvb20uY2FudmFzO1xuICAgICAgdmFyIHggPSBjdXJyZW50T2JqZWN0LmdldExlZnQoKSwgeSA9IGN1cnJlbnRPYmplY3QuZ2V0VG9wKCk7XG4gICAgICB2YXIgdyA9IGN1cnJlbnRPYmplY3QuZ2V0V2lkdGgoKSwgaCA9IGN1cnJlbnRPYmplY3QuZ2V0SGVpZ2h0KCk7XG4gICAgICB2YXIgbWF4WCA9IGNhbnZhcy5nZXRXaWR0aCgpIC0gdztcbiAgICAgIHZhciBtYXhZID0gY2FudmFzLmdldEhlaWdodCgpIC0gaDtcblxuICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgIGN1cnJlbnRPYmplY3Quc2V0KCdsZWZ0JywgMCk7XG4gICAgICB9XG4gICAgICBpZiAoeSA8IDApIHtcbiAgICAgICAgY3VycmVudE9iamVjdC5zZXQoJ3RvcCcsIDApO1xuICAgICAgfVxuICAgICAgaWYgKHggPiBtYXhYKSB7XG4gICAgICAgIGN1cnJlbnRPYmplY3Quc2V0KCdsZWZ0JywgbWF4WCk7XG4gICAgICB9XG4gICAgICBpZiAoeSA+IG1heFkpIHtcbiAgICAgICAgY3VycmVudE9iamVjdC5zZXQoJ3RvcCcsIG1heFkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRhcmtyb29tLmRpc3BhdGNoRXZlbnQoJ2Nyb3A6dXBkYXRlJyk7XG4gICAgfSxcblxuICAgIC8vIFByZXZlbnQgY3JvcCB6b25lIGZyb20gZ29pbmcgYmV5b25kIHRoZSBjYW52YXMgZWRnZXMgKGxpa2UgbW91c2VNb3ZlKVxuICAgIG9uT2JqZWN0U2NhbGluZzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHByZXZlbnRTY2FsaW5nID0gZmFsc2U7XG4gICAgICB2YXIgY3VycmVudE9iamVjdCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIGlmIChjdXJyZW50T2JqZWN0ICE9PSB0aGlzLmNyb3Bab25lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZGFya3Jvb20uY2FudmFzO1xuICAgICAgdmFyIHBvaW50ZXIgPSBjYW52YXMuZ2V0UG9pbnRlcihldmVudC5lKTtcbiAgICAgIHZhciB4ID0gcG9pbnRlci54O1xuICAgICAgdmFyIHkgPSBwb2ludGVyLnk7XG5cbiAgICAgIHZhciBtaW5YID0gY3VycmVudE9iamVjdC5nZXRMZWZ0KCk7XG4gICAgICB2YXIgbWluWSA9IGN1cnJlbnRPYmplY3QuZ2V0VG9wKCk7XG4gICAgICB2YXIgbWF4WCA9IGN1cnJlbnRPYmplY3QuZ2V0TGVmdCgpICsgY3VycmVudE9iamVjdC5nZXRXaWR0aCgpO1xuICAgICAgdmFyIG1heFkgPSBjdXJyZW50T2JqZWN0LmdldFRvcCgpICsgY3VycmVudE9iamVjdC5nZXRIZWlnaHQoKTtcblxuICAgICAgaWYgKG51bGwgIT09IHRoaXMub3B0aW9ucy5yYXRpbykge1xuICAgICAgICBpZiAobWluWCA8IDAgfHwgbWF4WCA+IGNhbnZhcy5nZXRXaWR0aCgpIHx8IG1pblkgPCAwIHx8IG1heFkgPiBjYW52YXMuZ2V0SGVpZ2h0KCkpIHtcbiAgICAgICAgICBwcmV2ZW50U2NhbGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1pblggPCAwIHx8IG1heFggPiBjYW52YXMuZ2V0V2lkdGgoKSB8fCBwcmV2ZW50U2NhbGluZykge1xuICAgICAgICB2YXIgbGFzdFNjYWxlWCA9IHRoaXMubGFzdFNjYWxlWCB8fCAxO1xuICAgICAgICBjdXJyZW50T2JqZWN0LnNldFNjYWxlWChsYXN0U2NhbGVYKTtcbiAgICAgIH1cbiAgICAgIGlmIChtaW5YIDwgMCkge1xuICAgICAgICBjdXJyZW50T2JqZWN0LnNldExlZnQoMCk7XG4gICAgICB9XG4gICAgICBpZiAobWluWSA8IDAgfHwgbWF4WSA+IGNhbnZhcy5nZXRIZWlnaHQoKSB8fCBwcmV2ZW50U2NhbGluZykge1xuICAgICAgICB2YXIgbGFzdFNjYWxlWSA9IHRoaXMubGFzdFNjYWxlWSB8fCAxO1xuICAgICAgICBjdXJyZW50T2JqZWN0LnNldFNjYWxlWShsYXN0U2NhbGVZKTtcbiAgICAgIH1cbiAgICAgIGlmIChtaW5ZIDwgMCkge1xuICAgICAgICBjdXJyZW50T2JqZWN0LnNldFRvcCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRPYmplY3QuZ2V0V2lkdGgoKSA8IHRoaXMub3B0aW9ucy5taW5XaWR0aCkge1xuICAgICAgICBjdXJyZW50T2JqZWN0LnNjYWxlVG9XaWR0aCh0aGlzLm9wdGlvbnMubWluV2lkdGgpO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRPYmplY3QuZ2V0SGVpZ2h0KCkgPCB0aGlzLm9wdGlvbnMubWluSGVpZ2h0KSB7XG4gICAgICAgIGN1cnJlbnRPYmplY3Quc2NhbGVUb0hlaWdodCh0aGlzLm9wdGlvbnMubWluSGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXN0U2NhbGVYID0gY3VycmVudE9iamVjdC5nZXRTY2FsZVgoKTtcbiAgICAgIHRoaXMubGFzdFNjYWxlWSA9IGN1cnJlbnRPYmplY3QuZ2V0U2NhbGVZKCk7XG5cbiAgICAgIHRoaXMuZGFya3Jvb20uZGlzcGF0Y2hFdmVudCgnY3JvcDp1cGRhdGUnKTtcbiAgICB9LFxuXG4gICAgLy8gSW5pdCBjcm9wIHpvbmVcbiAgICBvbk1vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZGFya3Jvb20uY2FudmFzO1xuXG4gICAgICAvLyByZWNhbGN1bGF0ZSBvZmZzZXQsIGluIGNhc2UgY2FudmFzIHdhcyBtYW5pcHVsYXRlZCBzaW5jZSBsYXN0IGBjYWxjT2Zmc2V0YFxuICAgICAgY2FudmFzLmNhbGNPZmZzZXQoKTtcbiAgICAgIHZhciBwb2ludGVyID0gY2FudmFzLmdldFBvaW50ZXIoZXZlbnQuZSk7XG4gICAgICB2YXIgeCA9IHBvaW50ZXIueDtcbiAgICAgIHZhciB5ID0gcG9pbnRlci55O1xuICAgICAgdmFyIHBvaW50ID0gbmV3IGZhYnJpYy5Qb2ludCh4LCB5KTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdXNlciB3YW50IHRvIHNjYWxlIG9yIGRyYWcgdGhlIGNyb3Agem9uZS5cbiAgICAgIHZhciBhY3RpdmVPYmplY3QgPSBjYW52YXMuZ2V0QWN0aXZlT2JqZWN0KCk7XG4gICAgICBpZiAoYWN0aXZlT2JqZWN0ID09PSB0aGlzLmNyb3Bab25lIHx8IHRoaXMuY3JvcFpvbmUuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjYW52YXMuZGlzY2FyZEFjdGl2ZU9iamVjdCgpO1xuICAgICAgdGhpcy5jcm9wWm9uZS5zZXRXaWR0aCgwKTtcbiAgICAgIHRoaXMuY3JvcFpvbmUuc2V0SGVpZ2h0KDApO1xuICAgICAgdGhpcy5jcm9wWm9uZS5zZXRTY2FsZVgoMSk7XG4gICAgICB0aGlzLmNyb3Bab25lLnNldFNjYWxlWSgxKTtcblxuICAgICAgdGhpcy5zdGFydFggPSB4O1xuICAgICAgdGhpcy5zdGFydFkgPSB5O1xuICAgIH0sXG5cbiAgICAvLyBFeHRlbmQgY3JvcCB6b25lXG4gICAgb25Nb3VzZU1vdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAvLyBRdWljayBjcm9wIGZlYXR1cmVcbiAgICAgIGlmICh0aGlzLmlzS2V5Q3JvcGluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5vbk1vdXNlTW92ZUtleUNyb3AoZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAobnVsbCA9PT0gdGhpcy5zdGFydFggfHwgbnVsbCA9PT0gdGhpcy5zdGFydFkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2FudmFzID0gdGhpcy5kYXJrcm9vbS5jYW52YXM7XG4gICAgICB2YXIgcG9pbnRlciA9IGNhbnZhcy5nZXRQb2ludGVyKGV2ZW50LmUpO1xuICAgICAgdmFyIHggPSBwb2ludGVyLng7XG4gICAgICB2YXIgeSA9IHBvaW50ZXIueTtcblxuICAgICAgdGhpcy5fcmVuZGVyQ3JvcFpvbmUodGhpcy5zdGFydFgsIHRoaXMuc3RhcnRZLCB4LCB5KTtcbiAgICB9LFxuXG4gICAgb25Nb3VzZU1vdmVLZXlDcm9wOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZGFya3Jvb20uY2FudmFzO1xuICAgICAgdmFyIHpvbmUgPSB0aGlzLmNyb3Bab25lO1xuXG4gICAgICB2YXIgcG9pbnRlciA9IGNhbnZhcy5nZXRQb2ludGVyKGV2ZW50LmUpO1xuICAgICAgdmFyIHggPSBwb2ludGVyLng7XG4gICAgICB2YXIgeSA9IHBvaW50ZXIueTtcblxuICAgICAgaWYgKCF6b25lLmxlZnQgfHwgIXpvbmUudG9wKSB7XG4gICAgICAgIHpvbmUuc2V0VG9wKHkpO1xuICAgICAgICB6b25lLnNldExlZnQoeCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNLZXlMZWZ0ID0gIHggPCB6b25lLmxlZnQgKyB6b25lLndpZHRoIC8gMiA7XG4gICAgICB0aGlzLmlzS2V5VXAgPSB5IDwgem9uZS50b3AgKyB6b25lLmhlaWdodCAvIDIgO1xuXG4gICAgICB0aGlzLl9yZW5kZXJDcm9wWm9uZShcbiAgICAgICAgTWF0aC5taW4oem9uZS5sZWZ0LCB4KSxcbiAgICAgICAgTWF0aC5taW4oem9uZS50b3AsIHkpLFxuICAgICAgICBNYXRoLm1heCh6b25lLmxlZnQrem9uZS53aWR0aCwgeCksXG4gICAgICAgIE1hdGgubWF4KHpvbmUudG9wK3pvbmUuaGVpZ2h0LCB5KVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgLy8gRmluaXNoIGNyb3Agem9uZVxuICAgIG9uTW91c2VVcDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChudWxsID09PSB0aGlzLnN0YXJ0WCB8fCBudWxsID09PSB0aGlzLnN0YXJ0WSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmRhcmtyb29tLmNhbnZhcztcbiAgICAgIHRoaXMuY3JvcFpvbmUuc2V0Q29vcmRzKCk7XG4gICAgICBjYW52YXMuc2V0QWN0aXZlT2JqZWN0KHRoaXMuY3JvcFpvbmUpO1xuICAgICAgY2FudmFzLmNhbGNPZmZzZXQoKTtcblxuICAgICAgdGhpcy5zdGFydFggPSBudWxsO1xuICAgICAgdGhpcy5zdGFydFkgPSBudWxsO1xuICAgIH0sXG5cbiAgICBvbktleURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZmFsc2UgPT09IHRoaXMub3B0aW9ucy5xdWlja0Nyb3BLZXkgfHwgZXZlbnQua2V5Q29kZSAhPT0gdGhpcy5vcHRpb25zLnF1aWNrQ3JvcEtleSB8fCB0aGlzLmlzS2V5Q3JvcGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEFjdGl2ZSBxdWljayBjcm9wIGZsb3dcbiAgICAgIHRoaXMuaXNLZXlDcm9waW5nID0gdHJ1ZSA7XG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XG4gICAgICB0aGlzLmNyb3Bab25lLnNldFdpZHRoKDApO1xuICAgICAgdGhpcy5jcm9wWm9uZS5zZXRIZWlnaHQoMCk7XG4gICAgICB0aGlzLmNyb3Bab25lLnNldFNjYWxlWCgxKTtcbiAgICAgIHRoaXMuY3JvcFpvbmUuc2V0U2NhbGVZKDEpO1xuICAgICAgdGhpcy5jcm9wWm9uZS5zZXRUb3AoMCk7XG4gICAgICB0aGlzLmNyb3Bab25lLnNldExlZnQoMCk7XG4gICAgfSxcblxuICAgIG9uS2V5VXA6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZmFsc2UgPT09IHRoaXMub3B0aW9ucy5xdWlja0Nyb3BLZXkgfHwgZXZlbnQua2V5Q29kZSAhPT0gdGhpcy5vcHRpb25zLnF1aWNrQ3JvcEtleSB8fCAhdGhpcy5pc0tleUNyb3BpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBVbmFjdGl2ZSBxdWljayBjcm9wIGZsb3dcbiAgICAgIHRoaXMuaXNLZXlDcm9waW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXJ0WCA9IDE7XG4gICAgICB0aGlzLnN0YXJ0WSA9IDE7XG4gICAgICB0aGlzLm9uTW91c2VVcCgpO1xuICAgIH0sXG5cbiAgICBzZWxlY3Rab25lOiBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBmb3JjZURpbWVuc2lvbikge1xuICAgICAgaWYgKCF0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlRm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3JjZURpbWVuc2lvbikge1xuICAgICAgICB0aGlzLl9yZW5kZXJDcm9wWm9uZSh4LCB5LCB4K3dpZHRoLCB5K2hlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNyb3Bab25lLnNldCh7XG4gICAgICAgICAgJ2xlZnQnOiB4LFxuICAgICAgICAgICd0b3AnOiB5LFxuICAgICAgICAgICd3aWR0aCc6IHdpZHRoLFxuICAgICAgICAgICdoZWlnaHQnOiBoZWlnaHRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjYW52YXMgPSB0aGlzLmRhcmtyb29tLmNhbnZhcztcbiAgICAgIGNhbnZhcy5icmluZ1RvRnJvbnQodGhpcy5jcm9wWm9uZSk7XG4gICAgICB0aGlzLmNyb3Bab25lLnNldENvb3JkcygpO1xuICAgICAgY2FudmFzLnNldEFjdGl2ZU9iamVjdCh0aGlzLmNyb3Bab25lKTtcbiAgICAgIGNhbnZhcy5jYWxjT2Zmc2V0KCk7XG5cbiAgICAgIHRoaXMuZGFya3Jvb20uZGlzcGF0Y2hFdmVudCgnY3JvcDp1cGRhdGUnKTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlQ3JvcDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgICB0aGlzLnJlcXVpcmVGb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY3JvcEN1cnJlbnRab25lOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQXZvaWQgY3JvcGluZyBlbXB0eSB6b25lXG4gICAgICBpZiAodGhpcy5jcm9wWm9uZS53aWR0aCA8IDEgJiYgdGhpcy5jcm9wWm9uZS5oZWlnaHQgPCAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGltYWdlID0gdGhpcy5kYXJrcm9vbS5pbWFnZTtcblxuICAgICAgLy8gQ29tcHV0ZSBjcm9wIHpvbmUgZGltZW5zaW9uc1xuICAgICAgdmFyIHRvcCA9IHRoaXMuY3JvcFpvbmUuZ2V0VG9wKCkgLSBpbWFnZS5nZXRUb3AoKTtcbiAgICAgIHZhciBsZWZ0ID0gdGhpcy5jcm9wWm9uZS5nZXRMZWZ0KCkgLSBpbWFnZS5nZXRMZWZ0KCk7XG4gICAgICB2YXIgd2lkdGggPSB0aGlzLmNyb3Bab25lLmdldFdpZHRoKCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jcm9wWm9uZS5nZXRIZWlnaHQoKTtcblxuICAgICAgLy8gQWRqdXN0IGRpbWVuc2lvbnMgdG8gaW1hZ2Ugb25seVxuICAgICAgaWYgKHRvcCA8IDApIHtcbiAgICAgICAgaGVpZ2h0ICs9IHRvcDtcbiAgICAgICAgdG9wID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGxlZnQgPCAwKSB7XG4gICAgICAgIHdpZHRoICs9IGxlZnQ7XG4gICAgICAgIGxlZnQgPSAwO1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBjcm9wIHRyYW5zZm9ybWF0aW9uLlxuICAgICAgLy8gTWFrZSBzdXJlIHRvIHVzZSByZWxhdGl2ZSBkaW1lbnNpb24gc2luY2UgdGhlIGNyb3Agd2lsbCBiZSBhcHBsaWVkXG4gICAgICAvLyBvbiB0aGUgc291cmNlIGltYWdlLlxuICAgICAgdGhpcy5kYXJrcm9vbS5hcHBseVRyYW5zZm9ybWF0aW9uKG5ldyBDcm9wKHtcbiAgICAgICAgdG9wOiB0b3AgLyBpbWFnZS5nZXRIZWlnaHQoKSxcbiAgICAgICAgbGVmdDogbGVmdCAvIGltYWdlLmdldFdpZHRoKCksXG4gICAgICAgIHdpZHRoOiB3aWR0aCAvIGltYWdlLmdldFdpZHRoKCksXG4gICAgICAgIGhlaWdodDogaGVpZ2h0IC8gaW1hZ2UuZ2V0SGVpZ2h0KCksXG4gICAgICB9KSk7XG4gICAgfSxcblxuICAgIC8vIFRlc3Qgd2V0aGVyIGNyb3Agem9uZSBpcyBzZXRcbiAgICBoYXNGb2N1czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcm9wWm9uZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBDcmVhdGUgdGhlIGNyb3Agem9uZVxuICAgIHJlcXVpcmVGb2N1czogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNyb3Bab25lID0gbmV3IENyb3Bab25lKHtcbiAgICAgICAgZmlsbDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgaGFzQm9yZGVyczogZmFsc2UsXG4gICAgICAgIG9yaWdpblg6ICdsZWZ0JyxcbiAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgIC8vc3Ryb2tlOiAnIzQ0NCcsXG4gICAgICAgIC8vc3Ryb2tlRGFzaEFycmF5OiBbNSwgNV0sXG4gICAgICAgIC8vYm9yZGVyQ29sb3I6ICcjNDQ0JyxcbiAgICAgICAgY29ybmVyQ29sb3I6ICcjNDQ0JyxcbiAgICAgICAgY29ybmVyU2l6ZTogOCxcbiAgICAgICAgdHJhbnNwYXJlbnRDb3JuZXJzOiBmYWxzZSxcbiAgICAgICAgbG9ja1JvdGF0aW9uOiB0cnVlLFxuICAgICAgICBoYXNSb3RhdGluZ1BvaW50OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAobnVsbCAhPT0gdGhpcy5vcHRpb25zLnJhdGlvKSB7XG4gICAgICAgIHRoaXMuY3JvcFpvbmUuc2V0KCdsb2NrVW5pU2NhbGluZycsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5hZGQodGhpcy5jcm9wWm9uZSk7XG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5kZWZhdWx0Q3Vyc29yID0gJ2Nyb3NzaGFpcic7XG5cbiAgICAgIHRoaXMuY3JvcEJ1dHRvbi5hY3RpdmUodHJ1ZSk7XG4gICAgICB0aGlzLm9rQnV0dG9uLmhpZGUoZmFsc2UpO1xuICAgICAgdGhpcy5jYW5jZWxCdXR0b24uaGlkZShmYWxzZSk7XG4gICAgfSxcblxuICAgIC8vIFJlbW92ZSB0aGUgY3JvcCB6b25lXG4gICAgcmVsZWFzZUZvY3VzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMuY3JvcFpvbmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyb3Bab25lLnJlbW92ZSgpO1xuICAgICAgdGhpcy5jcm9wWm9uZSA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy5jcm9wQnV0dG9uLmFjdGl2ZShmYWxzZSk7XG4gICAgICB0aGlzLm9rQnV0dG9uLmhpZGUodHJ1ZSk7XG4gICAgICB0aGlzLmNhbmNlbEJ1dHRvbi5oaWRlKHRydWUpO1xuXG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5kZWZhdWx0Q3Vyc29yID0gJ2RlZmF1bHQnO1xuXG4gICAgICB0aGlzLmRhcmtyb29tLmRpc3BhdGNoRXZlbnQoJ2Nyb3A6dXBkYXRlJyk7XG4gICAgfSxcblxuICAgIF9yZW5kZXJDcm9wWm9uZTogZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCB0b1gsIHRvWSkge1xuICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuZGFya3Jvb20uY2FudmFzO1xuXG4gICAgICB2YXIgaXNSaWdodCA9ICh0b1ggPiBmcm9tWCk7XG4gICAgICB2YXIgaXNMZWZ0ID0gIWlzUmlnaHQ7XG4gICAgICB2YXIgaXNEb3duID0gKHRvWSA+IGZyb21ZKTtcbiAgICAgIHZhciBpc1VwID0gIWlzRG93bjtcblxuICAgICAgdmFyIG1pbldpZHRoID0gTWF0aC5taW4oK3RoaXMub3B0aW9ucy5taW5XaWR0aCwgY2FudmFzLmdldFdpZHRoKCkpO1xuICAgICAgdmFyIG1pbkhlaWdodCA9IE1hdGgubWluKCt0aGlzLm9wdGlvbnMubWluSGVpZ2h0LCBjYW52YXMuZ2V0SGVpZ2h0KCkpO1xuXG4gICAgICAvLyBEZWZpbmUgY29ybmVyIGNvb3JkaW5hdGVzXG4gICAgICB2YXIgbGVmdFggPSBNYXRoLm1pbihmcm9tWCwgdG9YKTtcbiAgICAgIHZhciByaWdodFggPSBNYXRoLm1heChmcm9tWCwgdG9YKTtcbiAgICAgIHZhciB0b3BZID0gTWF0aC5taW4oZnJvbVksIHRvWSk7XG4gICAgICB2YXIgYm90dG9tWSA9IE1hdGgubWF4KGZyb21ZLCB0b1kpO1xuXG4gICAgICAvLyBSZXBsYWNlIGN1cnJlbnQgcG9pbnQgaW50byB0aGUgY2FudmFzXG4gICAgICBsZWZ0WCA9IE1hdGgubWF4KDAsIGxlZnRYKTtcbiAgICAgIHJpZ2h0WCA9IE1hdGgubWluKGNhbnZhcy5nZXRXaWR0aCgpLCByaWdodFgpO1xuICAgICAgdG9wWSA9IE1hdGgubWF4KDAsIHRvcFkpO1xuICAgICAgYm90dG9tWSA9IE1hdGgubWluKGNhbnZhcy5nZXRIZWlnaHQoKSwgYm90dG9tWSk7XG5cbiAgICAgIC8vIFJlY2FsaWJyYXRlIGNvb3JkaW5hdGVzIGFjY29yZGluZyB0byBnaXZlbiBvcHRpb25zXG4gICAgICBpZiAocmlnaHRYIC0gbGVmdFggPCBtaW5XaWR0aCkge1xuICAgICAgICBpZiAoaXNSaWdodCkge1xuICAgICAgICAgIHJpZ2h0WCA9IGxlZnRYICsgbWluV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVmdFggPSByaWdodFggLSBtaW5XaWR0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGJvdHRvbVkgLSB0b3BZIDwgbWluSGVpZ2h0KSB7XG4gICAgICAgIGlmIChpc0Rvd24pIHtcbiAgICAgICAgICBib3R0b21ZID0gdG9wWSArIG1pbkhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3BZID0gYm90dG9tWSAtIG1pbkhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUcnVuY2F0ZSB0cnVuY2F0ZSBhY2NvcmRpbmcgdG8gY2FudmFzIGRpbWVuc2lvbnNcbiAgICAgIGlmIChsZWZ0WCA8IDApIHtcbiAgICAgICAgLy8gVHJhbnNsYXRlIHRvIHRoZSBsZWZ0XG4gICAgICAgIHJpZ2h0WCArPSBNYXRoLmFicyhsZWZ0WCk7XG4gICAgICAgIGxlZnRYID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChyaWdodFggPiBjYW52YXMuZ2V0V2lkdGgoKSkge1xuICAgICAgICAvLyBUcmFuc2xhdGUgdG8gdGhlIHJpZ2h0XG4gICAgICAgIGxlZnRYIC09IChyaWdodFggLSBjYW52YXMuZ2V0V2lkdGgoKSk7XG4gICAgICAgIHJpZ2h0WCA9IGNhbnZhcy5nZXRXaWR0aCgpO1xuICAgICAgfVxuICAgICAgaWYgKHRvcFkgPCAwKSB7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSB0byB0aGUgYm90dG9tXG4gICAgICAgIGJvdHRvbVkgKz0gTWF0aC5hYnModG9wWSk7XG4gICAgICAgIHRvcFkgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKGJvdHRvbVkgPiBjYW52YXMuZ2V0SGVpZ2h0KCkpIHtcbiAgICAgICAgLy8gVHJhbnNsYXRlIHRvIHRoZSByaWdodFxuICAgICAgICB0b3BZIC09IChib3R0b21ZIC0gY2FudmFzLmdldEhlaWdodCgpKTtcbiAgICAgICAgYm90dG9tWSA9IGNhbnZhcy5nZXRIZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHdpZHRoID0gcmlnaHRYIC0gbGVmdFg7XG4gICAgICB2YXIgaGVpZ2h0ID0gYm90dG9tWSAtIHRvcFk7XG4gICAgICB2YXIgY3VycmVudFJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmF0aW8gJiYgK3RoaXMub3B0aW9ucy5yYXRpbyAhPT0gY3VycmVudFJhdGlvKSB7XG4gICAgICAgIHZhciByYXRpbyA9ICt0aGlzLm9wdGlvbnMucmF0aW87XG5cbiAgICAgICAgaWYodGhpcy5pc0tleUNyb3BpbmcpIHtcbiAgICAgICAgICBpc0xlZnQgPSB0aGlzLmlzS2V5TGVmdDtcbiAgICAgICAgICBpc1VwID0gdGhpcy5pc0tleVVwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRSYXRpbyA8IHJhdGlvKSB7XG4gICAgICAgICAgdmFyIG5ld1dpZHRoID0gaGVpZ2h0ICogcmF0aW87XG4gICAgICAgICAgaWYgKGlzTGVmdCkge1xuICAgICAgICAgICAgbGVmdFggLT0gKG5ld1dpZHRoIC0gd2lkdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aWR0aCA9IG5ld1dpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRSYXRpbyA+IHJhdGlvKSB7XG4gICAgICAgICAgdmFyIG5ld0hlaWdodCA9IGhlaWdodCAvIChyYXRpbyAqIGhlaWdodCAvIHdpZHRoKTtcbiAgICAgICAgICBpZiAoaXNVcCkge1xuICAgICAgICAgICAgdG9wWSAtPSAobmV3SGVpZ2h0IC0gaGVpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlZnRYIDwgMCkge1xuICAgICAgICAgIGxlZnRYID0gMDtcbiAgICAgICAgICAvL1RPRE9cbiAgICAgICAgfVxuICAgICAgICBpZiAodG9wWSA8IDApIHtcbiAgICAgICAgICB0b3BZID0gMDtcbiAgICAgICAgICAvL1RPRE9cbiAgICAgICAgfVxuICAgICAgICBpZiAobGVmdFggKyB3aWR0aCA+IGNhbnZhcy5nZXRXaWR0aCgpKSB7XG4gICAgICAgICAgdmFyIG5ld1dpZHRoID0gY2FudmFzLmdldFdpZHRoKCkgLSBsZWZ0WDtcbiAgICAgICAgICBoZWlnaHQgPSBuZXdXaWR0aCAqIGhlaWdodCAvIHdpZHRoO1xuICAgICAgICAgIHdpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgICAgaWYgKGlzVXApIHtcbiAgICAgICAgICAgIHRvcFkgPSBmcm9tWSAtIGhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvcFkgKyBoZWlnaHQgPiBjYW52YXMuZ2V0SGVpZ2h0KCkpIHtcbiAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gY2FudmFzLmdldEhlaWdodCgpIC0gdG9wWTtcbiAgICAgICAgICB3aWR0aCA9IHdpZHRoICogbmV3SGVpZ2h0IC8gaGVpZ2h0O1xuICAgICAgICAgIGhlaWdodCA9IG5ld0hlaWdodDtcbiAgICAgICAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICAgICAgICBsZWZ0WCA9IGZyb21YIC0gd2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGNvb3JkaW5hdGVzXG4gICAgICB0aGlzLmNyb3Bab25lLmxlZnQgPSBsZWZ0WDtcbiAgICAgIHRoaXMuY3JvcFpvbmUudG9wID0gdG9wWTtcbiAgICAgIHRoaXMuY3JvcFpvbmUud2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMuY3JvcFpvbmUuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICB0aGlzLmRhcmtyb29tLmNhbnZhcy5icmluZ1RvRnJvbnQodGhpcy5jcm9wWm9uZSk7XG5cbiAgICAgIHRoaXMuZGFya3Jvb20uZGlzcGF0Y2hFdmVudCgnY3JvcDp1cGRhdGUnKTtcbiAgICB9XG4gIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRGFya3Jvb20ucGx1Z2lucy5zYXZlID0gRGFya3Jvb20uUGx1Z2luLmV4dGVuZCh7XG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRhcmtyb29tLnNlbGZEZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIEluaXRpYWxpemVEYXJrcm9vbVNhdmVQbHVnaW4oKSB7XG4gICAgICB2YXIgYnV0dG9uR3JvdXAgPSB0aGlzLmRhcmtyb29tLnRvb2xiYXIuY3JlYXRlQnV0dG9uR3JvdXAoKTtcblxuICAgICAgdGhpcy5kZXN0cm95QnV0dG9uID0gYnV0dG9uR3JvdXAuY3JlYXRlQnV0dG9uKHtcbiAgICAgICAgaW1hZ2U6ICdzYXZlJ1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGVzdHJveUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3B0aW9ucy5jYWxsYmFjay5iaW5kKHRoaXMpKTtcbiAgICB9LFxuICB9KTtcblxufSkoKTtcbiJdfQ==
