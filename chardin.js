(function() {
  var decorators = {};

  (function($, window) {
    var chardin;

    chardin = (function() {
      function chardin(el) {
        window.chardinTimeouts = [];
        this.$el = $(el);
        this.clickBlacklist = '';
        this.helperLayers = {};
        this.transitionEndEvent = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
      }

      chardin.prototype.preOverlaySetup      = function() {};
      chardin.prototype.postOverlaySetup     = function() {};
      chardin.prototype.getElements          = function() { return this.$el.find('*[data-intro]:visible'); };
      chardin.prototype.showElement          = function(el, i) { this._showElement(el); };
      chardin.prototype.finalSetup           = function() { this.finished = true; };
      chardin.prototype.destroy              = function() {};
      chardin.prototype.forceSetupCompletion = function() {};

      chardin.prototype.registerTimeout = function(callback, delay) {
        window.chardinTimeouts.push(_.delay(callback, delay));
      };

      chardin.prototype.removeTooltips = function(selector) {
        var selector = selector || '';
        this.$el.find('.chardin-helper-layer' + selector).remove();
        this.$el.find('.chardin-show-element' + selector).removeClass('chardin-show-element');
        this.$el.find('.chardin-relative-position' + selector).removeClass('chardin-relative-position');
      };

      chardin.prototype.restoreClick = function() {
        document.removeEventListener('click', this.clickInterceptorBound, true);
      };

      chardin.prototype.start = function() {
        var els, i, len, el;

        if (this._overlayVisible()) {
          return false;
        }

        this.refreshBound = this._refresh.bind(this);
        $(window).on('resize', this.refreshBound);

        this.preOverlaySetup();
        this._addOverlayLayer();
        this.postOverlaySetup();

        _(this.getElements()).each(this.showElement, this);

        this.clickBlacklist && this._disableClick();

        this._enableEsc();

        this.$el.trigger('chardin:start');

        this.finalSetup();
      };

      chardin.prototype.stop = function() {
        var that = this,
            $overlay = this.$el.find('.chardin-overlay');

        $(window).off('keyup', this.onEscBound);
        $(window).off('resize', this.refreshBound);

        this.restoreClick();
        this.destroy();
        this._clearTimeouts();

        this.removeTooltips();
        $overlay.css(this.transition('opacity 0.4s')).css('opacity', 0);
        $overlay.on(this.transitionEndEvent, function() {
          $overlay.remove();
        });
        return that.$el.trigger('chardin:stop');
      };

      chardin.prototype.toggle = function() {
        if (!this._overlayVisible()) {
          return this.start();
        } else {
          return this.stop();
        }
      };

      chardin.prototype.transition = function(value) {
        return {
          'transition': value,
          '-webkit-transition': value,
          '-moz-transition': value,
          '-ms-transition': value,
          '-o-transition': value
        };
      };

      chardin.prototype._addOverlayLayer = function() {
        var $overlay, position, that = this;

        if (this._overlayVisible()) {
          return false;
        }

        $overlay = $('<div>').addClass('chardin-overlay');

        if (this.$el.is('body')) {
          $overlay.css({
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            position: 'fixed'
          });
        } else {
          position = this._getOffset(this.$el);
          position && overlay.css(position);
        }
        $overlay.appendTo(this.$el).click(function() {
          that.finished && that.stop();
        });

        this.registerTimeout(function() {
          $overlay.css('opacity', 0.8);
        }, 10);
      };

      chardin.prototype._clearTimeouts = function() {
        while (window.chardinTimeouts.length) {
          var timeout = window.chardinTimeouts.pop();
          clearTimeout(timeout);
        }
      };

      chardin.prototype._clickInterceptor = function(event) {
        var $target = $(event.target);
        if ($target.is(this.clickBlacklist)) {
          event.stopPropagation();
          event.preventDefault();
        }
      };

      chardin.prototype._disableClick = function() {
        this.clickInterceptorBound = this._clickInterceptor.bind(this);
        document.addEventListener('click', this.clickInterceptorBound, true);
      }

      chardin.prototype._enableEsc = function() {
        this.onEscBound = this._onEsc.bind(this);
        $(window).on('keyup', this.onEscBound);
      };

      chardin.prototype._getOffset = function(el) {
        var $el = $(el);

        return _.extend({
          width: $el.outerWidth(),
          height: $el.outerHeight()
        }, $el.offset());
      };

      chardin.prototype._getPosition = function(el) {
        return $(el).data('position') || 'bottom';
      };

      chardin.prototype._onEsc = function(event) {
        if (event.keyCode === 27) {
          this._clearTimeouts();
          this.foreceSetupCompletion();
          this.stop();
        }
      };

      chardin.prototype._overlayVisible = function() {
        return !!this.$el.find('.chardin-overlay').length;
      };

      chardin.prototype._placeTooltip = function(el, tooltipLayer) {
        var $tooltipLayer   = $(tooltipLayer),
            tooltipLayerOffset  = this._getOffset(tooltipLayer),
            targetelOffset = this._getOffset(el);

        $tooltipLayer.css({
          top: null,
          right: null,
          bottom: null,
          left: null
        });

        switch (this._getPosition(el)) {
          case 'bottom':
            $tooltipLayer.css('left', (targetelOffset.width - tooltipLayerOffset.width) / 2);
            break;
          case 'right':
            $tooltipLayer.css('top', (targetelOffset.height - tooltipLayerOffset.height) / 2);
        }

        switch (this._getPosition(el)) {
          case 'left':
            return tooltipLayer.style.left = '-' + (tooltipLayerOffset.width - 34) + 'px';
          case 'right':
            return tooltipLayer.style.right = '-' + (tooltipLayerOffset.width - 34) + 'px';
          case 'bottom':
            return tooltipLayer.style.bottom = '-' + tooltipLayerOffset.height + 'px';
          case 'top':
            return tooltipLayer.style.top = '-' + tooltipLayerOffset.height + 'px';
        }

      };

      chardin.prototype._positionHelperLayer = function(el) {
        this.helperLayers[$(el).data('chardin-id')].css(this._getOffset(el));
      };

      chardin.prototype._refresh = function() {
        if (this._overlayVisible()) {
          _(this.getElements()).each(this._positionHelperLayer, this);
        }
      };

      chardin.prototype._showElement = function(el) {
        var currentElementPosition,
            $el = $(el),
            id  = _.uniqueId(),
            $helperLayer  = $('<div>').addClass('chardin-helper-layer'),
            $tooltipLayer = $('<div>').addClass('chardin-tooltip'),
            $tooltip      = $('<div>').addClass('chardin-tooltiptext').text($el.data('intro'));

        $el.data('chardin-id', id);

        if ($el.attr('id')) {
          $helperLayer.data('id', $el.attr('id'));
        }

        this.helperLayers[id] = $helperLayer;
        this._positionHelperLayer(el);

        $helperLayer.add($tooltipLayer).addClass('chardin-' + this._getPosition(el));

        $tooltipLayer.append($tooltip);
        $helperLayer.append($tooltipLayer);
        this.$el.append($helperLayer);

        this._placeTooltip(el, $tooltipLayer[0]);

        $el.addClass('chardin-show-element');

        currentElementPosition = $el.css('position');
        if (currentElementPosition !== 'absolute' && currentElementPosition !== 'relative') {
          $el.addClass('chardin-relative-position');
        }
      };

      return chardin;

    })();
    return $.fn.extend({
      chardin: function() {
        var $this, args, data, action, decoratorName;

        action = arguments[0];
        decoratorName = arguments[1];
        args = (3 <= arguments.length ? _.toArray(arguments).slice(2) : []);

        $this = $(this[0]);
        data = $this.data('chardin');
        
        if (decoratorName) {
          decorators[decoratorName](chardin);
        }

        if (!data) {
          $this.data('chardin', (data = new chardin(this, action)));
        }

        if (typeof action === 'string') {
          data[action].apply(data, args);
        }
        return data;
      }
    });
  })(window.jQuery, window);

}).call(this);
