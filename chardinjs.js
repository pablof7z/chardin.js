
(function () {
    var slice = [].slice;
    var overlay_layer;

    (function ($, window) {
        var chardinJs;
        chardinJs = (function () {
            function chardinJs(el) {
                this.data_attribute = 'data-intro';
                this.chardinCssClasses = ["chardinjs-helper-layer", "chardinjs-show-element", "chardinjs-relative-position"];
                this.$el = $(el);
                this.sequenced = this.$el.data('chardin-sequenced') ? true : false;
                this.sequencedItems = this._getSequencedElements();
                this.sequenceIdx = 0;
                this.active = false;
                this.timeOut = null;
                this.isAuto = this.$el.data('chardin-auto') ? true : false;
                this.delayTime = this.$el.data('chardin-delay') || 2000;

                $(window).resize((function (_this) {
                    return function () {
                        return _this.refresh();
                    };
                })(this));
            }

            chardinJs.prototype.start = function () {
                var el, i, len, ref;
                if (this._overlay_visible()) {
                    return false;
                }
                this._add_overlay_layer();

                if (!this.sequenced) {
                    ref = this.$el.find('*[' + this.data_attribute + ']:visible');
                    for (i = 0, len = ref.length; i < len; i++) {
                        el = ref[i];
                        this._show_element(el);
                    }
                } else {
                    this.sequenceIdx = 0;
                    this._show_sequenced_element();
                }
                this.active = true;
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

            chardinJs.prototype.stop = function () {
                var css, i, len, ref;
                this.active = false;

                this._remove_overlay_layer();
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
                this.sequenceIdx = 0;
                return this.$el.trigger('chardinJs:stop');
            };


            chardinJs.prototype._remove_classes = function (css) {
                return this.$el.find('.' + css).removeClass(css);
            };

            chardinJs.prototype.set_data_attribute = function (attribute) {
                return this.data_attribute = attribute;
            };

            chardinJs.prototype.set_data_helptext = function (entries) {
                return this.data_helptext = entries;
            };

            chardinJs.prototype._overlay_visible = function () {
                return this.$el.find('.chardinjs-overlay').length !== 0;
            };


            chardinJs.prototype._add_overlay_layer = function () {
                var styleText = "", _this = this;
                if (this._overlay_visible()) {
                    return false;
                }

                // create a div that holds 4 child sections - to mask off the rest of the page
                overlay_layer = document.createElement("div");
                overlay_layer.id = "chardin-mask";

                element_position = this._get_offset(this.$el.get()[0]);
                if (element_position) {
                    $('*').filter(function () {
                        return $(this).css('position') == 'fixed';
                    }).each(function () {
                        $(this)[0].className += " chardinjs-no-fixed";
                    });
                    overlay_layer.className = "chardinjs-overlay";
                    if (this.$el.prop('tagName').toUpperCase() === "BODY") {
                        styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
                    }
                    else {
                        styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;";
                    }
                    overlay_layer.setAttribute("style", styleText);
                }

                this.$el.get()[0].appendChild(overlay_layer);

                this.$el.find("#chardin-mask").fadeIn();

                overlay_layer.onclick = function (e) {
                    if (!_this.sequenced) {
                        return _this.stop();
                    } else {
                        return _this._handleMouseClick(e);
                    }
                };
            };

            chardinJs.prototype._remove_overlay_layer = function () {
                this.$el.find('.chardinjs-helper-layer').remove();
                this.$el.find('.chardinjs-show-element').removeClass('chardinjs-show-element');
                this.$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position');
                this.$el.find(".chardinjs-no-fixed").removeClass("chardinjs-no-fixed");

                this.$el.find("#chardin-mask").fadeOut(function () {
                    return $(this).remove();
                });
            }

            chardinJs.prototype._position_overlay_layer = function (element) {
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
            }



            chardinJs.prototype._get_position = function (element) {
                var positionString, _ref;
                var helpref = element.getAttribute(this.data_attribute);
                if (helpref[0] == '#' && this.data_helptext[helpref].position)
                    positionString = this.data_helptext[helpref].position;
                else
                    positionString = element.getAttribute('data-position');

                return positionString == null ? 'bottom' : (_ref = positionString.split(':')) != null ? _ref[0] : positionString;
            };

            chardinJs.prototype._get_position_offset = function (element) {
                var positionString, _ref;
                var helpref = element.getAttribute(this.data_attribute);
                if (helpref[0] == '#' && this.data_helptext[helpref].position)
                    positionString = this.data_helptext[helpref].position;
                else
                    positionString = element.getAttribute('data-position');

                return (positionString == null ? 1 : 1 + parseInt(((_ref = positionString.split(':')) != null ? (_ref[1] || '').split(',')[0] : void 0) || 0, 10) / 100);
            };

            chardinJs.prototype._get_position_distance = function (element) {
                var positionString, _ref;
                var helpref = element.getAttribute(this.data_attribute);
                if (helpref[0] == '#' && this.data_helptext[helpref].position)
                    positionString = this.data_helptext[helpref].position;
                else
                    positionString = element.getAttribute('data-position');

                return (positionString == null ? 100 : parseInt(((_ref = positionString.split(':')) != null ? (_ref[1] || '').split(',')[1] : void 0) || 100, 10));
            };


            chardinJs.prototype._get_css_attribute = function (element) {
                var css, cssClasses, i, len, value;
                value = element.getAttribute(this.data_attribute + "-css") || '';
                if (value && String(value).replace(/\s/g, "").length > 1) {
                    cssClasses = (value.split(" ")).filter(function (css) {
                        return css.length !== 0;
                    });
                    for (i = 0, len = cssClasses.length; i < len; i++) {
                        css = cssClasses[i];
                        this._add_css_attribute(css);
                    }
                }
                return value;
            };

            chardinJs.prototype._add_css_attribute = function (css) {
                if (!$.inArray(css, this.chardinCssClasses) > -1) {
                    return this.chardinCssClasses.push(css);
                }
            };

            chardinJs.prototype._getStyle = function (el, styleProp, special) {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(el, special).getPropertyValue(styleProp);
                } else {
                    return el.currentStyle[styleProp];
                }
            };



            chardinJs.prototype._place_tooltip = function (element, tooltip_layer) {
                var my_height, offset, distance, position, target_element_position, target_height, target_width, tooltipActualWidth, tooltipMaxWidth, tooltip_layer_position;
                tooltip_layer_position = this._get_offset(tooltip_layer);
                tooltip_layer.style.top = null;
                tooltip_layer.style.right = null;
                tooltip_layer.style.bottom = null;
                tooltip_layer.style.left = null;
                position = this._get_position(element);
                distance = this._get_position_distance(element);
                if (distance) {
                  tooltip_layer.className += ' chardinjs-distance-' + distance;
                  distance = (distance / 100) - 1;
                }
                switch (position) {
                    case "top":
                    case "bottom":
                        target_element_position = this._get_offset(element);
                        target_width = target_element_position.width;
                        my_width = parseFloat(this._getStyle(tooltip_layer, "width"));
                        tooltip_layer.style.left = "" + ((target_width / 2) * this._get_position_offset(element) - (tooltip_layer_position.width / 2)) + "px";
                        if (my_width) {
                            $(tooltip_layer).width(my_width);
                        }
                        return tooltip_layer.style[position] = "-" + (tooltip_layer_position.height + distance * 30) + "px";
                    case "left":
                    case "right":
                        tooltipMaxWidth = parseFloat(this._getStyle(tooltip_layer, "max-width"));
                        tooltip_layer.style[position] = "-" + tooltipMaxWidth + "px";
                        target_element_position = this._get_offset(element);
                        target_height = target_element_position.height;
                        my_height = parseFloat(this._getStyle(tooltip_layer, "height"));
                        if (my_height) {
                            $(tooltip_layer).height(my_height);
                        }
                        tooltip_layer.style.top = "" + ((target_height / 2) * this._get_position_offset(element) - (my_height / 2)) + "px";
                        tooltipActualWidth = parseFloat(this._getStyle(tooltip_layer, "width"));
                        offset = 185 - (tooltipMaxWidth - tooltipActualWidth) + distance * 30;
                        return tooltip_layer.style[position] = "-" + offset + "px";
                }
            };


            chardinJs.prototype._position_helper_layer = function (element) {
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


            chardinJs.prototype._remove_sequenced_element = function () {
                this.$el.find('.chardinjs-helper-layer').remove();
                this.$el.find('.chardinjs-show-element').removeClass('chardinjs-show-element');
                this.$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position');
                return;
            };


            chardinJs.prototype._show_element = function (element) {
                var helper_layer, tooltip_layer;
                helper_layer = document.createElement("div");
                tooltip_layer = document.createElement("div");

                var helpref = element.getAttribute(this.data_attribute);
                if (helpref[0] == '#') {
                    var helptext = this.data_helptext[helpref];
                    if (helptext)
                        tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + helptext.text + "</div>";
                    else
                        return false;
                }
                else
                    tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + helpref + "</div>";

                $(element).data('helper_layer', helper_layer).data('tooltip_layer', tooltip_layer);
                if (element.id) {
                    helper_layer.setAttribute("data-id", element.id);
                }

                helper_layer.className = "chardinjs-helper-layer chardinjs-" + (this._get_position(element));
                this._position_helper_layer(element);
                this.$el.get()[0].appendChild(helper_layer);
                tooltip_layer.className = "chardinjs-tooltip chardinjs-" + (this._get_position(element));

                helper_layer.appendChild(tooltip_layer);
                this._place_tooltip(element, tooltip_layer);

                var _this = this;
                helper_layer.onclick = function (e) {
                    if (!_this.sequenced) {
                        return _this.stop();
                    } else {
                        return _this._handleMouseClick(e);
                    }
                };

                // adjust dimmed overlay to wrap around this element
                this._position_overlay_layer(element);
                if (_this.sequenced) {
                    tooltip_layer.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                }

                return true;
            };

            chardinJs.prototype._show_sequenced_element = function (delayed) {
                var _this = this;
                if (this.sequenceIdx < 0) {
                    this.sequenceIdx = 0;
                }
                if (!this.sequencedItems[this.sequenceIdx]) {
                    return this.stop();
                }
                while (!this._show_element(this.sequencedItems[this.sequenceIdx])) {
                    this.sequenceIdx++;
                };

                if (this.sequenceIdx < this.sequencedItems.length - 1) {
                    if (this.isAuto) {
                        return this.timeOut = setTimeout((function () {
                            return _this.next(_this.isAuto);
                        }), this.delayTime);
                    }
                } else {
                    if (this.isAuto) {
                        return this.timeOut = setTimeout((function () {
                            return _this.stop();
                        }), this.delayTime);
                    }
                }
            };

            chardinJs.prototype.next = function (delayed) {
                var _this = this;
                delayed = delayed !== false ? true : false;
                this.sequenceIdx++;
                if (delayed) {
                    clearTimeout(this.timeOut);
                    return this.timeOut = setTimeout((function () {
                        _this._remove_sequenced_element();
                        _this._show_sequenced_element(true);
                        return _this.$el.trigger('chardinJs:next');
                    }), this.delayTime);
                } else {
                    this._remove_sequenced_element();
                    this._show_sequenced_element(false);
                    return this.$el.trigger('chardinJs:next');
                }
            };

            chardinJs.prototype.previous = function (delayed) {
                var _this = this;
                delayed = delayed !== false ? true : false;
                this.sequenceIdx--;
                if (delayed) {
                    clearTimeout(this.timeOut);
                    return this.timeOut = setTimeout((function () {
                        _this._remove_sequenced_element();
                        _this._show_sequenced_element(true);
                        return _this.$el.trigger('chardinJs:previous');
                    }), this.delayTime);
                } else {
                    this._remove_sequenced_element();
                    this._show_sequenced_element(false);
                    return this.$el.trigger('chardinJs:previous');
                }
            };

            chardinJs.prototype._handleMouseClick = function (event) {
                if (!this.active)
                    return;
                size = this._getMaxSize();
                event = event || window.event;
                if (event.shiftKey) {
                    return this.previous(false);
                }
                return this.next(false);
            };

            chardinJs.prototype._getMaxSize = function () {
                var body, height, html, width;
                body = document.body;
                html = document.documentElement;
                height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
                return {
                    'width': width,
                    'height': height
                };
            };

            chardinJs.prototype._getSequencedElements = function () {
                return this.$el.find('*[' + this.data_attribute + ']:visible').sort(function (a, b) {
                    var left, right;
                    left = $(a).data('sequence') || 100;
                    right = $(b).data('sequence') || 100;
                    return left - right;
                });
            };

            chardinJs.prototype._get_offset = function (element) {
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
            chardinJs: function () {
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
