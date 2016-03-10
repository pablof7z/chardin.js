$ ->
  $('body').chardinJs()

  $('a[data-toggle="chardinjs"]').on 'click', (e) ->
    e.preventDefault()
    if $('.jumbotron img').is(':visible')
      ($('body').data('chardinJs')).toggle()
    else
      $('.jumbotron img').animate height: 250, 600, ->
        ($('body').data('chardinJs')).toggle()

  $('body').on 'chardinJs:stop', ->
    $('a.btn.primary').off('click').text('See more on Github')
      .attr('href', 'https://github.com/heelhook/chardin.js')
    $('a#opentour').css display: 'block'