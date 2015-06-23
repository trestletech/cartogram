HTMLWidgets.widget({

  name: 'cartogram',

  type: 'output',


  initialize: function(el, width, height) {

  return {

    };
  },

  resize: function(el, width, height, instance) {


  },

  renderValue: function(el, x, instance) {

   var standalone = false;

    //+++ default options
        var datasettransition = 750, datasettransitioneasingfunction = "linear",
        mapzoomswitch = true,
        mapprojection = d3.geo.mercator(), mapscale = 1, maptranslatex = 0, maptranslatey = 100,
        mapcenter = [100, 100], mapcentery = 0,
        colorbrewersetting = colorbrewer.YlOrRd[3], colorbreweruse = false, colordefault = '#ffffff',
        scalingfields = false; maptooltip = "imported";

        var languagesstats, languagesloc;

        var labelfieldname = 'Ex', labelfieldunit = '';


  if (standalone === false){

    //+++    data transformation from R
    languagesstats = HTMLWidgets.dataframeToD3(x.scaledata);
    if (x.circledata){ languagesloc = HTMLWidgets.dataframeToD3(x.circledata);}

    //+++    options from R
    if (x.datasettransition){ datasettransition = x.datasettransition;}
    if (x.datasettransitioneasingfunction){ datasettransitioneasingfunction = x.datasettransitioneasingfunction;}
    if (x.zoom){ mapzoomswitch = true;}
    if (x.mapprojection){ mapprojection = eval(x.mapprojection);}
    if (x.mapscale){ mapscale = x.mapscale;}
    if (x.maptranslatex){ maptranslatex = x.maptranslatex;}
    if (x.maptranslatey){ maptranslatey = x.maptranslatey;}
    if (x.mapcenter){ mapcenter = eval(x.mapcenter);}
    if (x.colorbrewersetting){ colorbrewersetting = eval(x.colorbrewersetting); colorbreweruse = true;}
    if (x.colordefault){ colordefault = x.colordefault;}
    if (x.tooltip){ maptooltip = x.tooltip;}
    if (x.scalinginfo){ scalingfields = true;}

    //+++

    var body, div;
    if (!(document.getElementById('cartogram'))){
      var elcartogram = d3.select(el).append("div").attr("id", "cartogram");
      body = "#el", div = "#cartogram";
    } else {
      body = "#body", div = "#cartogram";
    }


    //+++  set shape file and geometries collection
    var proj = mapprojection;

    var xmap = x.map;
    var shape = HTMLWidgets.getAttachmentUrl('shapeswf', 'world');  //default
    if   (x.map == 'world'){shape = HTMLWidgets.getAttachmentUrl('shapeswf', 'world');}
    else if  (x.map == 'usa') {
          shape = HTMLWidgets.getAttachmentUrl('shapesusa', 'states');
          proj = d3.geo.albersUsa();
        }
    else if  (x.map == 'usa_segmentized') {
          shape = HTMLWidgets.getAttachmentUrl('shapesusaseg', 'states');
          proj = d3.geo.albersUsa();
        }
    else if (x.map =='uk'){
          shape = HTMLWidgets.getAttachmentUrl('shapesuk', 'ENG');
        }
    else if (x.map =='france'){
          shape = HTMLWidgets.getAttachmentUrl('shapesfr', 'world');
        }
    else if (x.map =='custom'){
          shape = HTMLWidgets.getAttachmentUrl('shapescustom', 'world');
        }

   //+++ topofile data
   // var topojsonfile = x.topojsonfile;

  }



d3cartogram(standalone, languagesstats, shape, xmap, proj, languagesloc,
datasettransition, datasettransitioneasingfunction, mapzoomswitch, mapprojection, mapscale, maptranslatex, maptranslatey, colorbrewersetting, colorbreweruse, colordefault, scalingfields, body, div);




  },
});

