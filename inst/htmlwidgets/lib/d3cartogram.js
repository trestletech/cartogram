function d3cartogram(standalone, languagesstats, shape, xmap, proj, languagesloc,
datasettransition, datasettransitioneasingfunction, mapzoomswitch, mapprojection, mapscale, maptranslatex, maptranslatey, colorbrewersetting, colorbreweruse, colordefault, scalingfields, body, div)
{


           var maptooltip = "imported"


           //+++ build html
           body = d3.select(body);
           div = d3.select(div);


           var fieldSelect = div.append("select").attr("id", "field").style("margin", "0 10px 0 0");
           var yearSelect = div.append("select").attr("id", "year").style("margin", "0 10px 0 0");;
           var showLang = div.append("checkbox").attr("id", "lgloc");
           var stat = div.append("span").attr("id", "status");
           var mapcontainer = div.append("div").attr("id", "map-container");
           var map = mapcontainer.append("svg").attr("id", "map");


          // +++ pre-built html
          // stat = d3.select("#status");
          // var fieldSelect = d3.select("#field")
          // var showLang = d3.select("#lgloc")
          // var yearSelect = d3.select("#year")
          // var map = d3.select("#map"),



           //languagesstats
           var scales = [], fieldsid = [], years = [], fields = [{name: "(no scale)", id: "none"}];
           var len = languagesstats.length;
           for (var key in languagesstats[0]) {
              if (languagesstats[0].hasOwnProperty(key)) {
                if (key == 'NAME'){}
                if (  Number((key.substr(key.length-4,4))) > 1   ){
                   var fid = key.substr(0,key.length - 4);
                   var fyear = Number(key.substr(key.length-4, 4));
                   var fname = key;//fid;
                   var fkey = fid + '%d';

                   if (!(years.indexOf(fyear) > -1)) {years.push(fyear);}
                   if (!(fieldsid.indexOf(fid) > -1)) {
                   fields.push({
                      key: fkey,
                       id: fid,
                     name: fid
                  });   }
                  fieldsid.push(fid);
                }
              }
            }
           console.log(fields);
           console.log(years);

           //+++ Dropdown
            var percent = (function() {
            var fmt = d3.format(".2f");
            return function(n) { return fmt(n) + "%"; };
          })(),
          scales = [
            {name: "(no scale)", id: "none"},
            // {name: "Census Population", id: "censuspop", key: "CENSUS%dPOP", years:
//[2010]},
            // {name: "Estimate Base", id: "censuspop", key: "ESTIMATESBASE%d", years:
//[2010]},
            {name: "Number of languages", id: "nrlangs", key: "NRLANGUAGES%d", unit: "languages"},
            {name: "Population", id: "population", key: "POPULATION%d", unit: ",000"},
            ];

          fieldsById = d3.nest()
            .key(function(d) { console.log(d); return d.id; })
            .rollup(function(d) {   return d[0]; })
            .map(fields),
          field = fields[0],
          year = years[0],
          colors = colorbrewersetting
            //.reverse()
            .map(function(rgb) { return d3.hsl(rgb); });




       fieldSelect.on("change", function(e) {
          field = fields[this.selectedIndex];
          location.hash = "#" + [encodeURIComponent(field.id)].join("/");
        });


      //   showLang.on("change",function(e){
      //      if(this.checked){
      //          d3.select("#languages").classed("nodisplay",false);
      //      }
      //      else{
      //          d3.select("#languages").classed("nodisplay",true);
      //     }
      // });

      fieldSelect.selectAll("option")
        .data(fields)
        .enter()
        .append("option")
          .attr("value", function(d) { return d.id; })
          .text(function(d) { return d.name; });


        yearSelect.on("change", function(e) {
          year = years[this.selectedIndex];
          location.hash = "#" + [field.id, year].join("/");
          //location.hash = "#" + field.id;
        });

      yearSelect.selectAll("option")
        .data(years)
        .enter()
        .append("option")
          .attr("value", function(y) { return y; })
          .text(function(y) { return y; })



         var zoom = d3.behavior.zoom()
            .translate([maptranslatex,maptranslatey])
            .scale(mapscale)
            //.scaleExtent([0.5, 10.0])
            .on("zoom", updateZoom),
          layer = map.append("g")
            .attr("id", "layer"),
          worldcountries = layer.append("g")
            .attr("id", "worldcountries")
            .selectAll("path");
          layer2 = map.append("g")
            .attr("id","layer2"),
          languages = layer.append("g")
            .attr("id","languages")
            .selectAll("circle");

    if (mapzoomswitch === true){
       map.call(zoom);
    }
    updateZoom();

      function updateZoom() {
        var scale = zoom.scale();
        layer.attr("transform",
          "translate(" + zoom.translate() + ") " +
          "scale(" + [scale, scale] + ")" );

       if (scalingfields === true){
          stat.text(["scale: ", zoom.scale(), " translate: ", zoom.translate()].join(" "));
          }
      }

      var
          topology,
          geometries,
          rawData,
          dataById = {},
          carto = d3.cartogram()
            .projection(proj)
            .properties(function(d) {
              return dataById[d.id];
            })
            .value(function(d) {
              return +d.properties[field];
            });

      window.onhashchange = function() {
        parseHash();
      };

     d3.json(shape, function(topo) {
        topology = topo;

        if (xmap == 'usa') {geometries = topology.objects.states.geometries;}
        else { geometries = topology.objects.world.geometries; }

          rawData = languagesstats;
          dataById = d3.nest()
            .key(function(d) { if (d.NAME == 'XA') {console.log(d.NAME); d.NAME = 'NA';} return d.NAME;})
            .rollup(function(d) {  return d[0]; })
            .map(languagesstats);

          languagedata = languagesloc;

          init();

           });


      function init() {

        var features = carto.features(topology, geometries),
            path = d3.geo.path()
              .projection(proj);


        worldcountries = worldcountries.data(features)
          .enter()
          .append("path")
            .attr("class", "state")
            .attr("id", function(d) {
                  if (d.id == -99){
                    return 'XA';}
                  if (!(d.properties)){
                    console.log('null');
                     return 'XA';}
                return d.properties.NAME; //properties.NAME;
                //return d.objects.worldcountries.geometries.id;
            })
            .attr("fill", "#fafafa")
            .attr("d", path)
            .attr("cursor","pointer");

        worldcountries.append("title");



      if (languagesloc){
        languages = languages.data(languagedata)
            .enter()
            .append("circle")
            .attr("class","lg")
            .attr("id",function(d){
                return d.NAME;
            })
            .attr("fill","steelblue")
            .attr("cx", function(d) {
                 if (!(d.LON)) {return 0;}
                return proj([d.LON, d.LAT])[0];
            })
            .attr("cy", function(d) {
                 if (!(d.LON)) {return 0;}
                return proj([d.LON, d.LAT])[1];
            })
            .attr("r", 0.5)
            .attr("pointer-events","none");
       }


        parseHash();
      }

      function reset() {
        stat.text("");
        body.classed("updating", false);
        //document.getElementById("lgloc").disabled = false;


        var features = carto.features(topology, geometries),
            path = d3.geo.path()
              .projection(proj);

        worldcountries.data(features)
          .transition()
            .duration(750)
            .ease("linear")
            .attr("fill", "#fafafa")
            .attr("d", path);

        worldcountries.select("title")
          .text(function(d) {
            if (isNaN(d.properties)){
                console.log('NA_reset'); return 'NA';
              }
              else {
                return d.properties.FULLNAME;
              }
          });
      }

      function update() {
        var start = Date.now();
        body.classed("updating", true);

        d3.select("#languages").classed("nodisplay",true);
        //document.getElementById("lgloc").checked = false;
        //document.getElementById("lgloc").disabled = true;

        var key = field.key.replace("%d", year),   //+++
            fmt = (typeof field.format === "function")
              ? field.format
              : d3.format(field.format || ","),
            value = function(d) {
               if (d.id == -99){
                  return 0;}
               if (!(d.properties)){
                  return 0;}
               return +d.properties[key];
            },
            values = worldcountries.data()
              .map(value)
              .filter(function(n) {
                return !isNaN(n);
              })
              .sort(d3.ascending),
            lo = values[0],
            hi = values[values.length - 1];



        var color = d3.scale.linear()
          .range(colors)
          .domain(lo < 0
            ? [lo, 0, hi]
            : [lo, d3.mean(values), hi]);

        // normalize the scale to positive numbers
        var scale = d3.scale.linear()
          .domain([lo, hi])
          .range([1, 1000]);

        // tell the cartogram to use the scaled values
        carto.value(function(d) {
           return scale(value(d));
        });

        // generate the new features, pre-projected
        var features = carto(topology, geometries).features;
        // update the data
        worldcountries.data(features)
          .select("title")
          .text(function(d) {
                if (!(d.properties)){  return '';}
                else {
                    if (maptooltip === "true"){
                        return d.properties.FULLNAME + '\n ' + [labelfieldname, fmt(value(d))].join(": ") + labelfieldunit;
                    } else {  return d.properties.tooltip  }

              //return [d.properties.FULLNAME, fmt(value(d))].join(": ") + field.unit;
                }
            });

        worldcountries.transition()
          .duration(datasettransition)
          .ease(datasettransitioneasingfunction)
          .attr("fill", function(d) {
            if (colorbreweruse === true){return color(value(d));}
            else if (d.properties){ return d.properties.COLOR; }
            else { return colordefault; }
          })
          .attr("d", carto.path);

        var delta = (Date.now() - start) / 1000;
        stat.text("");
        //stat.text(["calculated in", delta.toFixed(1), "seconds"].join(" "));
        body.classed("updating", false);
      }



      var deferredUpdate = (function() {
        var timeout;
        return function() {
          var args = arguments;
          clearTimeout(timeout);
          stat.text("updating...");
          return timeout = setTimeout(function() {
            update.apply(null, arguments);
          }, 10);
        };
      })();

      var hashish = d3.selectAll("a.hashish")
        .datum(function() {
          return this.href;
        });

      function parseHash() {
        var parsedHash = decodeURIComponent(location.hash);
        var parts = parsedHash.substr(1).split("/"),
            desiredFieldId = parts[0],
            desiredYear = +parts[1];

        field = fieldsById[desiredFieldId] || fields[0];
        year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];


        fieldSelect.property("selectedIndex", fields.indexOf(field));

        if (field.id === "none") {

          yearSelect.attr("disabled", "disabled");
          reset();

        } else {

          if (field.years) {
            if (field.years.indexOf(year) === -1) {
              year = field.years[0];
            }
            yearSelect.selectAll("option")
              .attr("disabled", function(y) {
                return (field.years.indexOf(y) === -1) ? "disabled" : null;
              });
          } else {
            yearSelect.selectAll("option")
              .attr("disabled", null);
          }

          yearSelect
            .property("selectedIndex", years.indexOf(year))
            .attr("disabled", null);

          deferredUpdate();
          location.hash = "#" + [field.id, year].join("/");
          //location.replace("#" + field.id);

          hashish.attr("href", function(href) {
            return href + location.hash;
          });
        }
      }



}



