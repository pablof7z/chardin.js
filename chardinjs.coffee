do ($ = window.jQuery, window) ->
  # Define the plugin class
  class chardinJs
    constructor: (el) ->
      @$el = $(el)
      $(window).resize => @.refresh()

    start: ->
      return false if @._overlay_visible()
      @._add_overlay_layer()
      @._show_element(el) for el in @$el.find('*[data-intro]')

      @$el.trigger 'chardinJs:start'

    toggle: () ->
      if not @._overlay_visible()
        @.start()
      else
        @.stop()

    refresh: ()->
      if @._overlay_visible()
        @._position_helper_layer(el) for el in @$el.find('*[data-intro]')
      else
        return this

    stop: () ->
      @$el.find(".chardinjs-overlay").fadeOut -> $(this).remove()

      @$el.find('.chardinjs-helper-layer').remove()

      @$el.find('.chardinjs-show-element').removeClass('chardinjs-show-element')
      @$el.find('.chardinjs-relative-position').removeClass('chardinjs-relative-position')

      if window.removeEventListener
        window.removeEventListener "keydown", @_onKeyDown, true
      #IE
      else document.detachEvent "onkeydown", @_onKeyDown  if document.detachEvent

      @$el.trigger 'chardinJs:stop'

    _overlay_visible: ->
      @$el.find('.chardinjs-overlay').length != 0

    _add_overlay_layer: () ->
      return false if @._overlay_visible()
      overlay_layer = document.createElement("div")
      styleText = ""

      overlay_layer.className = "chardinjs-overlay"

      #check if the target element is body, we should calculate the size of overlay layer in a better way
      if @$el.prop('tagName') is "BODY"
        styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;"
        overlay_layer.setAttribute "style", styleText
      else
        element_position = @._get_offset(@$el.get()[0])
        if element_position
          styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;"
          overlay_layer.setAttribute "style", styleText
      @$el.get()[0].appendChild overlay_layer

      overlay_layer.onclick = => @.stop()

      setTimeout ->
        styleText += "opacity: .8;opacity: .8;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';filter: alpha(opacity=80);"
        overlay_layer.setAttribute "style", styleText
      , 10

    _get_position: (element) -> element.getAttribute('data-position') or 'bottom'

    _place_tooltip: (element) ->
      tooltip_layer = $(element).data('tooltip_layer')
      tooltip_layer_position = @._get_offset(tooltip_layer)

      #reset the old style
      tooltip_layer.style.top = null
      tooltip_layer.style.right = null
      tooltip_layer.style.bottom = null
      tooltip_layer.style.left = null

      switch @._get_position(element)
        when "top", "bottom"
          target_element_position  = @._get_offset(element)
          target_width             = target_element_position.width
          my_width                 = $(tooltip_layer).width()
          tooltip_layer.style.left = "#{(target_width/2)-(tooltip_layer_position.width/2)}px"
        when "left", "right"
          target_element_position = @._get_offset(element)
          target_height           = target_element_position.height
          my_height               = $(tooltip_layer).height()
          tooltip_layer.style.top = "#{(target_height/2)-(tooltip_layer_position.height/2)}px"

      switch @._get_position(element)
        when "left" then tooltip_layer.style.left = "-" + (tooltip_layer_position.width - 34) + "px"
        when "right" then tooltip_layer.style.right = "-" + (tooltip_layer_position.width - 34) + "px"
        when "bottom" then tooltip_layer.style.bottom = "-" + (tooltip_layer_position.height) + "px"
        when "top" then tooltip_layer.style.top = "-" + (tooltip_layer_position.height) + "px"

    _position_helper_layer: (element) ->
      helper_layer = $(element).data('helper_layer')
      element_position = @._get_offset(element)
      helper_layer.setAttribute "style", "width: #{element_position.width}px; height:#{element_position.height}px; top:#{element_position.top}px; left: #{element_position.left}px;"

    _show_element: (element) ->
      element_position = @._get_offset(element)
      helper_layer     = document.createElement("div")
      tooltip_layer    = document.createElement("div")

      $(element)
        .data('helper_layer', helper_layer)
        .data('tooltip_layer',tooltip_layer)

      helper_layer.setAttribute "data-id", element.id if element.id
      helper_layer.className = "chardinjs-helper-layer chardinjs-#{@._get_position(element)}"

      @._position_helper_layer element
      @$el.get()[0].appendChild helper_layer
      tooltip_layer.className = "chardinjs-tooltip chardinjs-#{@._get_position(element)}"
      tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>#{element.getAttribute('data-intro')}</div>"
      helper_layer.appendChild tooltip_layer

      @._place_tooltip element

      element.className += " chardinjs-show-element"

      current_element_position = ""
      if element.currentStyle #IE
        current_element_position = element.currentStyle["position"]
      #Firefox
      else current_element_position = document.defaultView.getComputedStyle(element, null).getPropertyValue("position")  if document.defaultView and document.defaultView.getComputedStyle

      current_element_position = current_element_position.toLowerCase()

      element.className += " chardinjs-relative-position"  if current_element_position isnt "absolute" and current_element_position isnt "relative"

    _get_offset: (element) ->
      element_position =
        width: element.offsetWidth
        height: element.offsetHeight

      _x = 0
      _y = 0
      while element and not isNaN(element.offsetLeft) and not isNaN(element.offsetTop)
        _x += element.offsetLeft
        _y += element.offsetTop
        element = element.offsetParent

      element_position.top = _y
      element_position.left = _x
      element_position

  $.fn.extend chardinJs: (option, args...) ->
    $this = $(this[0])
    data = $this.data('chardinJs')
    if !data
      $this.data 'chardinJs', (data = new chardinJs(this, option))
    if typeof option == 'string'
      data[option].apply(data, args)
    data
