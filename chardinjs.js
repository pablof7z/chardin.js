(function () {
    var __slice = [].slice;

    (function ($, window) {
        var chardinJs;

        chardinJs = (function () {
            function chardinJs(el) {
                var _this = this;

                this.$el = $(el);
                $(window).resize(function () {
                    return _this.refresh();
                });
            }

            chardinJs.prototype.start = function () {
                var el, _i, _len, _ref;

                if (this._overlay_visible()) {
                    return false;
                }
                this._add_overlay_layer();
                _ref = this.$el.find('*[data-intro]:visible');
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    el = _ref[_i];
                    this._show_element(el);
                }
                return this.$el.trigger('chardinJs:start');
            };

            chardinJs.prototype.toggle = function () {
                if (!this._overlay_visible()) {
                    return this.start();
                } else {
                    return this.stop();
                }
            };

            chardinJs.prototype.refresh = function () {
                var el, _i, _len, _ref, _results;

                if (this._overlay_visible()) {
                    _ref = this.$el.find('*[data-intro]:visible');
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        el = _ref[_i];
                        _results.push(this._position_helper_layer(el));
                    }
                    return _results;
                } else {
                    return this;
                }
            };

            chardinJs.prototype.stop = function () {
                this.$el.find(".chardinjs-overlay").fadeOut(function () {
                    return $(this).remove();
                });
                this.$el.find('.chardinjs-helper-layer').remove();
                this.$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position');
                if (window.removeEventListener) {
                    window.removeEventListener("keydown", this._onKeyDown, true);
                } else {
                    if (document.detachEvent) {
                        document.detachEvent("onkeydown", this._onKeyDown);
                    }
                }
                return this.$el.trigger('chardinJs:stop');
            };

            chardinJs.prototype._overlay_visible = function () {
                return this.$el.find('.chardinjs-overlay').length !== 0;
            };

            chardinJs.prototype._add_overlay_layer = function () {
                var element_position, overlay_layer, styleText, close_button,
                  _this = this;

                if (this._overlay_visible()) {
                    return false;
                }
                overlay_layer = document.createElement("div");
				close_button = document.createElement("div");
				close_button.className="chardinjs-close chardinjs-close-up";
				close_button.onmousedown = function (evt) {
					$(close_button).switchClass("chardinjs-close-up", "chardinjs-close-down");
				}
				close_button.onmouseup = function (evt) {
					$(close_button).switchClass("chardinjs-close-down", "chardinjs-close-up");
					_this.stop();
					jqSimpleConnect.removeAll();
				}
				overlay_layer.appendChild(close_button);
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
                overlay_layer.onclick = function () {
                    return _this.stop();
                };
                return setTimeout(function () {
                    styleText += "opacity: .65;opacity: .65;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=65)';filter: alpha(opacity=65);";
                    return overlay_layer.setAttribute("style", styleText);
                }, 10);
            };

            chardinJs.prototype._get_position = function (element) {
                return element.getAttribute('data-position') || 'bottom';
            };
			
			chardinJs.prototype._get_text_position = function (element) {
                return element.getAttribute('data-text-position') || 'center';
            };
			
			chardinJs.prototype._get_text_margin = function (element) {
                var margin = element.getAttribute('data-tooltiptext-margin');
				return (margin != null && !isNaN(margin))? parseInt(margin, 10) : 0 ;
            };
			
			chardinJs.prototype._get_text_top = function (element) {
                var top = element.getAttribute('data-tooltiptext-top');
				return (top != null && !isNaN(top))? parseInt(top, 10) : 0 ;
            };
			
			chardinJs.prototype._need_frame = function (element) {
                return  element.getAttribute('data-frame') ? true : false;
            };
			
			chardinJs.prototype._get_tooltip_line_size = function (element) {
                return  element.getAttribute('data-tooltip-line') || 'short';
            };
			
            chardinJs.prototype._place_tooltip = function (element) {
                var  tooltip_layer, tooltip_layer_position, tooltip_side;

                tooltip_layer = $(element).data('tooltip_layer');
				tooltip_side = this._get_position(element);
                tooltip_layer_position = this._calc_element_position(this._get_offset(element), tooltip_layer, tooltip_side);
				
				switch (tooltip_side) {
					case "top":
					case "bottom": {
						switch (this._get_text_position(element)) {
							case "left": {
								tooltip_layer.style.left = "0px";
								break;
							}
							case "right": {
								tooltip_layer.className = "-" + tooltip_layer_position.width + "px";
								break;
							}
						}
					}
				}
				
                switch (tooltip_side) {
                    case "left":
                        return tooltip_layer.style.left = "-" + tooltip_layer_position.width + "px";
                    case "right":
                        return tooltip_layer.style.right = "-" + tooltip_layer_position.width + "px";
                    case "bottom":
                        return tooltip_layer.style.bottom = "-" + tooltip_layer_position.height + "px";
                    case "top":
                        return tooltip_layer.style.top = "-" + tooltip_layer_position.height + "px";
                }
            };
			
			chardinJs.prototype._calc_element_position = function (target_element_position, element, side) {
				var target_height, target_width, element_position;

                element_position = this._get_offset(element);
                element.style.top = null;
                element.style.right = null;
                element.style.bottom = null;
                element.style.left = null;
                switch (side) {
                    case "top":
                    case "bottom":
                        target_width = target_element_position.width;
                        element.style.left = "" + ((target_width / 2) - (element_position.width / 2)) + "px";
                        break;
                    case "left":
                    case "right":
                        target_height = target_element_position.height;
                        element.style.top = "" + ((target_height / 2) - (element_position.height / 2)) + "px";
                }
				return element_position;
			}
			
            chardinJs.prototype._place_element = function (target_element_position, element, side) {
                this._calc_element_position(target_element_position, element, side);
                switch (side) {
                    case "left":
                        return element.style.left = "-15px";
                    case "right":
                        return element.style.right = "-15px";
                    case "bottom":
                        return element.style.bottom = "-15px";
                    case "top":
                        return element.style.top = "-15px";
                }
            };

            chardinJs.prototype._position_helper_layer = function (element) {
                var element_position, helper_layer;

                helper_layer = $(element).data('helper_layer');
                element_position = this._get_offset(element);
                return helper_layer.setAttribute("style", "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + (element_position.top - 3) + "px; left: " + (element_position.left - 3) + "px;");
            };
			
			chardinJs.prototype._create_dragdrop_cross = function () {
				var box = document.createElement("div");
				box.className = "chardinjs-box";
				box.innerHTML = '<div class="chardinjs-vertical">   </div>' +
					'<div class="chardinjs-horizontal">   </div>' +
					'<div class="chardinjs-arrow chardinjs-up" style="top: -4px; left: 6px">   </div>' +
					'<div class="chardinjs-arrow chardinjs-down" style="top: 15px; left: 6px">   </div>' +
					'<div class="chardinjs-arrow chardinjs-left" style="top: 6px; left: -4px">   </div>' +
					'<div class="chardinjs-arrow chardinjs-right" style="top: 6px; left: 15px">   </div>';
				return box;	
			}
			
            chardinJs.prototype._show_element = function (element) {
                var current_element_position, element_position, helper_layer, tooltip_layer;

                element_position = this._get_offset(element);

                helper_layer = document.createElement("div");
                tooltip_layer = document.createElement("div");
				if (element.getAttribute('data-comment-id')) {
					tooltip_layer.id = element.getAttribute('data-comment-id');
				}
				tooltip_layer.className = "chardinjs-tooltip chardinjs-" + (this._get_position(element));
				if (this._get_tooltip_line_size(element) == 'long') {
					tooltip_layer.className += " long";
				}	
				switch (this._get_text_position(element)) {
					case "left": {
						tooltip_layer.className += " tooltip-left";
						break;
					}
					case "right": {
						tooltip_layer.className += " tooltip-right";
						break;
					}
				}	
				if (this._need_frame(element)) {
					tooltip_layer.className += " chardinjs-frame-" + (this._get_position(element));
				} 
                tooltip_layer.innerHTML = '<div class="chardinjs-tooltiptext"><span style="position:relative; margin-left:'+this._get_text_margin(element)+'px; top:'+this._get_text_top(element)+'px;">' + (element.getAttribute('data-intro')) + "</span></div>";
                $(element).data('helper_layer', helper_layer).data('tooltip_layer', tooltip_layer);
                if (element.id) {
                    helper_layer.setAttribute("data-id", element.id);
                }
                helper_layer.className = "chardinjs-helper-layer chardinjs-" + (this._get_position(element));
				if (this._need_frame(element)) {
					helper_layer.className += " chardinjs-helper-layer-border";
				}
                this._position_helper_layer(element);
                this.$el.get()[0].appendChild(helper_layer);
                helper_layer.appendChild(tooltip_layer);			
                this._place_tooltip(element);
				if (!this._need_frame(element)) {
					var point = document.createElement("div");
					if (element.getAttribute('data-point-id')) {
						point.id = element.getAttribute('data-point-id');
					}
					point.className = "chardinjs-circle";
					point.setAttribute("data-position", this._get_position(element));
					helper_layer.appendChild(point);
					this._place_element(element_position, point, this._get_position(element));
				}
				if (element.getAttribute('data-dragdrop-cross')) {
					tooltip_layer.appendChild(this._create_dragdrop_cross());
				}	
				
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

            chardinJs.prototype._get_offset = function (element) {
                var element_position, _x, _y;

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
            chardinJs: function () {
                var $this, args, data, option;

                option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                $this = $(this[0]);
                data = $this.data('chardinJs');
                if (!data) {
                    $this.data('chardinJs', (data = new chardinJs(this, option)));
                }
                if (typeof option === 'string') {
                    data[option].apply(data, args);
                }
                return data;
            }
        });
    })(window.jQuery, window);

}).call(this);