#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
cartogram <- function(map = NULL, tooltip = NULL,
                      circledata = NULL, scaledata = NULL,
                      datasettransition = NULL, datasettransitioneasingfunction = NULL, zoom = NULL,
                      mapprojection = NULL, colorbrewersetting = NULL, colordefault = NULL,
                      mapscale = NULL, maptranslatex  = NULL,  maptranslatey  = NULL, mapcenter  = NULL,
                      scalinginfo = NULL, message = NULL,
                      width = NULL, height = NULL) {

  # forward options using x
  x = list(
    message = message,
    scaledata = scaledata,
    circledata  = circledata,
    datasettransitioneasingfunction = datasettransitioneasingfunction,
    datasettransition = datasettransition,
    colorbrewersetting = colorbrewersetting,
    colordefault = colordefault,
    zoom = zoom,
    mapprojection = mapprojection,
    mapscale = mapscale,
    maptranslatex = maptranslatex,
    maptranslatey = maptranslatey,
    mapcenter = mapcenter,
    scalinginfo = scalinginfo,
    tooltip = tooltip,
    map = map
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'cartogram',
    x,
    width = width,
    height = height,
    package = 'cartogram'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
cartogramOutput <- function(outputId, width = '100%', height = '200px'){
  shinyWidgetOutput(outputId, 'cartogram', width, height, package = 'cartogram')
}

#' Widget render function for use in Shiny
#'
#' @export
renderCartogram <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, cartogramOutput, env, quoted = TRUE)
}
