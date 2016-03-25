do ($ = window.jQuery, window) ->
  # Define the plugin class
  class chardinJs
    constructor: (el, args...) ->
      @$el = $(el)
      $(window).resize => @.refresh()

    start: (args...) ->
      return false if @._overlay_visible()
      @$el.data("chardinjs-brightness", args[0])

      @._add_overlay_layer()
      @._show_element(el) for el in @$el.find('*[data-intro]:visible')

      @$el.trigger 'chardinJs:start'

    toggle: ->
      if not @._overlay_visible()
        @.start.apply @, arguments
      else
        @.stop @, arguments

    refresh: ()->
      if @._overlay_visible()
        @._position_helper_layer(el) for el in @$el.find('*[data-intro]:visible')
      else
        return this

    stop: () ->
      @$el.find(".chardinjs-overlay").fadeOut -> $(this).remove()

      @$el.find('.chardinjs-helper-layer').remove()

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
      overlay_layer.innerHTML = '<svg style="width:100%;height:100%;">
        <defs>
          <mask id="chardinjs-mask" x="0" y="0" width="'+overlay_layer.offsetWidth+'" height="'+overlay_layer.offsetHeight+'" >
            <rect x="0" y="0" width="'+overlay_layer.offsetWidth+'" height="'+overlay_layer.offsetHeight+'" fill="white"/>
          </mask>
        </defs>
        <rect x="0" y="0" width="'+overlay_layer.offsetWidth+'" height="'+overlay_layer.offsetHeight+'" style="stroke: none; fill: black; mask: url(#chardinjs-mask)"/>
      </svg>'

      overlay_layer.onclick = => @.stop()

      getOpacityStyle = =>
        value = @$el.data("chardinjs-brightness") ? 0.8
        "opacity:#{value};background:none;"

      setTimeout ->
        styleText += getOpacityStyle()
        overlay_layer.setAttribute "style", styleText
      , 10

    _get_position: (element) -> element.getAttribute('data-position') or 'bottom'


    _getStyle : (el, styleProp, special) ->
        if (window.getComputedStyle)
          window.getComputedStyle(el, special).getPropertyValue(styleProp)
        else
          el.currentStyle[styleProp]

    _place_tooltip: (element, tooltip_layer) ->
      tooltip_layer_position = @._get_offset(tooltip_layer)

      #reset the old style
      tooltip_layer.style.top = null
      tooltip_layer.style.right = null
      tooltip_layer.style.bottom = null
      tooltip_layer.style.left = null

      position = this._get_position(element);
      switch position
        when "top", "bottom"
          target_element_position  = @._get_offset(element)
          target_width             = target_element_position.width
          my_width                 = $(tooltip_layer).width()
          tooltip_layer.style.left = "#{(target_width/2)-(tooltip_layer_position.width/2)}px"
          tooltip_layer.style[position] = "-" + (tooltip_layer_position.height) + "px"
        when "left", "right"
          tooltipMaxWidth = parseFloat(this._getStyle(tooltip_layer, "max-width"));
          tooltip_layer.style[position] = "-" + tooltipMaxWidth + "px" # The computed size is wrong before this.
          target_element_position = @._get_offset(element)
          target_height           = target_element_position.height
          my_height               = parseFloat(@._getStyle(tooltip_layer, "height"))

          tooltip_layer.style.top = "#{(target_height/2)-(my_height/2)}px"
          tooltipActualWidth = parseFloat(this._getStyle(tooltip_layer, "width"))
          offset = 175 - (tooltipMaxWidth - tooltipActualWidth)
          tooltip_layer.style[position] = "-" + offset + "px"

    _position_helper_layer: (element) ->
      helper_layer = $(element).data('helper_layer')
      element_position = @._get_offset(element)
      x = element_position.left
      y = element_position.top
      width = element_position.width
      height = element_position.height

      document.getElementById("chardinjs-mask").innerHTML += "<rect x=\"#{x}\" y=\"#{y}\" width=\"#{width}\" height=\"#{height}\" fill=\"black\"></rect>"
      helper_layer.setAttribute "style", "width: #{element_position.width}px; height:#{element_position.height}px; top:#{element_position.top}px; left: #{element_position.left}px;"

    _show_element: (element) ->
      helper_layer     = document.createElement("div")
      tooltip_layer    = document.createElement("div")
      tooltip_link     = document.createElement("a")

      $(element)
        .data('helper_layer', helper_layer)
        .data('tooltip_layer',tooltip_layer)
        .data('tooltip_link',tooltip_link)

      documentationText = element.getAttribute('data-documentation-text')
      documentationLink = element.getAttribute('data-documentation-link')
      isTargetBlank = !element.getAttribute('data-open-documentation-active-window')

      tooltip_link.innerHTML = documentationText ? "more..."
      tooltip_link.setAttribute "href", documentationLink ? "#"
      tooltip_link.setAttribute "target", "_blank" if documentationLink && isTargetBlank

      helper_layer.setAttribute "data-id", element.id if element.id
      helper_layer.className = "chardinjs-helper-layer chardinjs-#{@._get_position(element)}"

      @._position_helper_layer element
      @$el.get()[0].appendChild helper_layer
      tooltip_layer.className = "chardinjs-tooltip chardinjs-#{@._get_position(element)}"

      introHTML = element.getAttribute('data-intro')
      introHTML += " " + tooltip_link.outerHTML if documentationLink || documentationText
      tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>#{introHTML}</div>"
      helper_layer.appendChild tooltip_layer


      @._place_tooltip element, tooltip_layer

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
