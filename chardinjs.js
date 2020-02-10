
(function() {
  var slice = [].slice;

  (function($, window) {
    var chardinJs;
    chardinJs = (function() {
      function chardinJs(el) {
        this.data_attribute = 'data-intro';
        this.chardinCssClasses = ["chardinjs-helper-layer", "chardinjs-show-element", "chardinjs-relative-position"];
        this.$el = $(el);
        $(window).resize((function(_this) {
          return function() {
            return _this.refresh();
          };
        })(this));
      }

      chardinJs.prototype.start = function() {
        var el, i, len, ref;
        if (this._overlay_visible()) {
          return false;
        }
        this._add_overlay_layer();
        ref = this.$el.find('*[' + this.data_attribute + ']:visible');
        for (i = 0, len = ref.length; i < len; i++) {
          el = ref[i];
          this._show_element(el);
        }
        return this.$el.trigger('chardinJs:start');
      };

      chardinJs.prototype.toggle = function() {
        if (!this._overlay_visible()) {
          return this.start();
        } else {
          return this.stop();
        }
      };

      chardinJs.prototype.refresh = function() {
        var el, i, len, ref, results;
        if (this._overlay_visible()) {
          ref = this.$el.find('*[' + this.data_attribute + ']:visible');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            el = ref[i];
            results.push(this._position_helper_layer(el));
          }
          return results;
        } else {
          return this;
        }
      };

      chardinJs.prototype.stop = function() {
        var css, i, len, ref;
        this.$el.find(".chardinjs-overlay").fadeOut(function() {
          return $(this).remove();
        });
        this.$el.find('.chardinjs-helper-layer').remove();
        ref = this.chardinCssClasses;
        for (i = 0, len = ref.length; i < len; i++) {
          css = ref[i];
          this._remove_classes(css);
        }
        if (window.removeEventListener) {
          window.removeEventListener("keydown", this._onKeyDown, true);
        } else {
          if (document.detachEvent) {
            document.detachEvent("onkeydown", this._onKeyDown);
          }
        }
        return this.$el.trigger('chardinJs:stop');
      };

      chardinJs.prototype._remove_classes = function(css) {
        return this.$el.find('.' + css).removeClass(css);
      };

      chardinJs.prototype.set_data_attribute = function(attribute) {
        return this.data_attribute = attribute;
      };

      chardinJs.prototype.set_data_helptext = function (entries) {
        return this.data_helptext = entries;
      };
            
      chardinJs.prototype._overlay_visible = function() {
        return this.$el.find('.chardinjs-overlay').length !== 0;
      };

      chardinJs.prototype._add_overlay_layer = function() {
        var element_position, overlay_layer, styleText;
        if (this._overlay_visible()) {
          return false;
        }
        overlay_layer = document.createElement("div");
        styleText = "";
        overlay_layer.className = "chardinjs-overlay";
        if (this.$el.prop('tagName') === "BODY") {
          styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
          overlay_layer.setAttribute("style", styleText);
        } else {
          element_position = this._get_offset(this.$el.get()[0]);
          if (element_position) {
            styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;";
            overlay_layer.setAttribute("style", styleText);
          }
        }
        this.$el.get()[0].appendChild(overlay_layer);
        overlay_layer.onclick = (function(_this) {
          return function() {
            return _this.stop();
          };
        })(this);
        return setTimeout(function() {
          styleText += "opacity: .8;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';filter: alpha(opacity=80);";
          return overlay_layer.setAttribute("style", styleText);
        }, 10);
      };

      chardinJs.prototype._get_position = function(element) {
        return element.getAttribute('data-position') || 'bottom';
      };

      chardinJs.prototype._get_css_attribute = function(element) {
        var css, cssClasses, i, len, value;
        value = element.getAttribute(this.data_attribute + "-css") || '';
        if (value && String(value).replace(/\s/g, "").length > 1) {
          cssClasses = (value.split(" ")).filter(function(css) {
            return css.length !== 0;
          });
          for (i = 0, len = cssClasses.length; i < len; i++) {
            css = cssClasses[i];
            this._add_css_attribute(css);
          }
        }
        return value;
      };

      chardinJs.prototype._add_css_attribute = function(css) {
        if (!$.inArray(css, this.chardinCssClasses) > -1) {
          return this.chardinCssClasses.push(css);
        }
      };

      chardinJs.prototype._getStyle = function(el, styleProp, special) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, special).getPropertyValue(styleProp);
        } else {
          return el.currentStyle[styleProp];
        }
      };

      chardinJs.prototype._place_tooltip = function(element, tooltip_layer) {
        var my_height, offset, position, target_element_position, target_height, target_width, tooltipActualWidth, tooltipMaxWidth, tooltip_layer_position;
        tooltip_layer_position = this._get_offset(tooltip_layer);
        tooltip_layer.style.top = null;
        tooltip_layer.style.right = null;
        tooltip_layer.style.bottom = null;
        tooltip_layer.style.left = null;
        position = this._get_position(element);
        switch (position) {
          case "top":
          case "bottom":
            target_element_position = this._get_offset(element);
            target_width = target_element_position.width;
            tooltip_layer.style.left = ((target_width / 2) - (tooltip_layer_position.width / 2)) + "px";
            return tooltip_layer.style[position] = "-" + tooltip_layer_position.height + "px";
          case "left":
          case "right":
            tooltipMaxWidth = parseFloat(this._getStyle(tooltip_layer, "max-width"));
            tooltip_layer.style[position] = "-" + tooltipMaxWidth + "px";
            target_element_position = this._get_offset(element);
            target_height = target_element_position.height;
            my_height = parseFloat(this._getStyle(tooltip_layer, "height"));
            tooltip_layer.style.top = ((target_height / 2) - (my_height / 2)) + "px";
            tooltipActualWidth = parseFloat(this._getStyle(tooltip_layer, "width"));
            offset = 175 - (tooltipMaxWidth - tooltipActualWidth);
            return tooltip_layer.style[position] = "-" + offset + "px";
        }
      };

      chardinJs.prototype._position_helper_layer = function(element) {
        var element_position, helper_layer;
        helper_layer = $(element).data('helper_layer');
        element_position = this._get_offset(element);
        if ($(element).is(':visible') && helper_layer) {
          helper_layer.setAttribute("style", "display: block; width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px; left: " + element_position.left + "px;");
        }
        if ($(element).is(':visible') && !helper_layer) {
          this._show_element(element);
        }
        if (!$(element).is(':visible') && helper_layer) {
          return helper_layer.setAttribute("style", "display: none; width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px; left: " + element_position.left + "px;");
        }
      };

      chardinJs.prototype._show_element = function(element) {
        var current_element_position, helper_layer, tooltip_layer;
        helper_layer = document.createElement("div");
        tooltip_layer = document.createElement("div");

        var helpref = element.getAttribute(this.data_attribute);
        if (helpref[0] == '#') {
          var helptext = this.data_helptext[helpref].text;
          if (helptext != undefined)
             tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + helptext + "</div>";
          else
            return;
        }
        else
          tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + helpref + "</div>";

        $(element).data('helper_layer', helper_layer).data('tooltip_layer', tooltip_layer);
        if (element.id) {
          helper_layer.setAttribute("data-id", element.id);
        }

        var position = this._get_position(element);
        if (helpref[0] == '#' && this.data_helptext[helpref].position)
          position = this.data_helptext[helpref].position;

        helper_layer.className = "chardinjs-helper-layer chardinjs-" + position;
        this._position_helper_layer(element);
        this.$el.get()[0].appendChild(helper_layer);
        tooltip_layer.className = "chardinjs-tooltip chardinjs-" + position;

        helper_layer.appendChild(tooltip_layer);
        this._place_tooltip(element, tooltip_layer);
        element.className += " chardinjs-show-element " + this._get_css_attribute(element);
        current_element_position = "";
        if (element.currentStyle) {
            current_element_position = element.currentStyle["position"];
        } else {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                current_element_position = document.defaultView.getComputedStyle(element, null).getPropertyValue("position");
            }
        }
        current_element_position = current_element_position.toLowerCase();
        if (current_element_position !== "absolute" && current_element_position !== "relative") {
          return element.className += " chardinjs-relative-position";
        }
      };

      chardinJs.prototype._get_offset = function(element) {
        var _x, _y, element_position;
        element_position = {
          width: element.offsetWidth,
          height: element.offsetHeight
        };
        _x = 0;
        _y = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
          _x += element.offsetLeft;
          _y += element.offsetTop;
          element = element.offsetParent;
        }
        element_position.top = _y;
        element_position.left = _x;
        return element_position;
      };

      return chardinJs;

    })();
    return $.fn.extend({
      chardinJs: function() {
        var $this, args, data, option;
        option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        $this = $(this[0]);
        data = $this.data('chardinJs');
        if (!data) {
          $this.data('chardinJs', (data = new chardinJs(this, option)));
        }
        if (typeof option === 'string') {
          data[option].apply(data, args);
        } else if (typeof option === 'object') {
          if (typeof option['attribute'] === 'string') {
            data.set_data_attribute(option['attribute']);
          }
          if (typeof option['method'] === 'string') {
            data[option['method']].apply(data, args);
          }
          if (typeof option['url'] === 'string') {
            $.ajax({
              type: 'GET',
              url: option['url'],
              dataType: 'json',
              cache: false,
              success: function (response) {
                  data.set_data_helptext(response);
              }
            });
          }
        }
        return data;
      }
    });
  })(window.jQuery, window);

}).call(this);
