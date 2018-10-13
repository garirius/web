ALEPH = "September 13, 2012";

coloringos = ["#2F2BAD", "#ad2bad", "#e42692", "#f71568"]
function total(){
  d2 = Date.now();
  d1 = new Date(ALEPH);
  d1 = d1.getTime();

  return d2-d1;
}

//Definim els projectes i la educació
function Segment (obj){
  this.name = obj.name;
  this.active = obj.active;
  this.start = new Date(obj.inicio);

  if(obj.active){
    this.end = new Date();
  } else {
    this.end = new Date(obj.fin);
  }
  this.color = obj.bgcolor;

  //Torna (en ms) el temps que ha durat un segment.
  this.getDuration = function(){
    var d1, d2;
    if(this.active){
      d2 = Date.now();
    } else {
      d2 = this.end.getTime();
    };
    d1 = this.start.getTime();

    return d2-d1;
  };

  //Calcula l'ample que hauria d'ocupar el div.
  this.calcWidth = function(){
    return 100*this.getDuration()/total();
  };

  this.calcOffset = function(){
    d1 = new Date(ALEPH);
    d1 = d1.getTime();

    d2 = this.start.getTime();

    return 100*(d2-d1)/total();
  };
}

/** SUBCLASSE PER A UNA ETAPA EDUCATIVA **/
function Etapa(obj){
  Segment.call(this,obj);
  this.where = obj.where;
  this.textcolors = obj.textcolors;

  //Crea el DIV que mostrarem en el timeline
  this.creaDiv = function(){
    var nu = $("<div class='edu'></div>");
    nu.css({
      "background-color": this.color,
      "width": this.calcWidth() + "%",
      "left": this.calcOffset() + "%"
    });

    //separem la primera paraula per a fer-la més gran;
    var palabras = this.name.split(" ");
    var prime = palabras[0];
    var resto = "";
    for (i=1; i<palabras.length; i++){
      resto = resto + palabras[i] + " "
    }
    resto = resto.slice(0,resto.length-1);
    nu.append("<span class='fa fa-book'style='color:"+this.textcolors.h1+"'></span>");
    nu.append("<h1 style='color:"+this.textcolors.h1+"'>"+prime+"</h1>");
    nu.append("<h2 style='color:"+this.textcolors.h2+"'>"+resto+"</h2>");
    nu.append("<h3 style='color:"+this.textcolors.h3+"'> <span class='fa fa-map-marker'></span>"+this.where+"</h3>");
    nu.children("span").hide();
    return nu;
  }
}
Etapa.prototype = Object.create(Segment.prototype);
Etapa.prototype.constructor = Etapa;

function Proyecto(obj){
  Segment.call(this,obj);
  this.fila = 0;
  this.replacementIcon = obj.icono;
  this.textcolor = "white";
  this.id = obj.id;

  this.creaDiv = function(filas){
    var nu = $("<div class='proj'></div>");

    var he = (65-5*(filas-1))/(filas);
    var bg = coloringos[this.fila];
    var tx = "white";
    nu.css({
      "background-color": bg,
      "width": this.calcWidth() + "%",
      "left": this.calcOffset() + "%",
      "height": he + "%",
      "top": 20 + this.fila*(he+5) + "%"
    });
    nu.append("<h1 style='color:"+tx+"'>"+this.name+"</h1>");
    nu.append("<h2 style='color:"+tx+"'><span class='fa fa-"+this.replacementIcon+" fa-3x'> </span></h2>");

    nu.mouseenter(function(){
      nu.css({
        "background-color": "white"
      });
      nu.children("h1, h2").css("color",bg);
    });
    nu.mouseleave(function(){
      nu.css({
        "background-color": bg
      });
      nu.children("h1, h2").css("color",tx);
    });

    var loadin = this.id;
    nu.click(function(){
      //Creem ara un div mazo gran
      var backdrop = $("<div class='backdrop'></div>");
      var cosika = $("<div id='medio'></div>")
      backdrop.append(cosika);

      //per algun motiu no puc gastar .load() però sí $.get()
      switch (loadin) {
        //com ja tinc el iframe fet, ho deixaré així per a tippetop
        case "tippetop":
          $.get( "proyectos/proyectos.html", function( data ) {
            var datos = $(data);
            datos = datos.filter("#"+loadin);
            cosika.append(datos);
          });
          break;
        default:
          cosika.append("<div><iframe frameborder='0' width='100%' height='100%'  src='proyectos/proyectos.html?where="+loadin+"'></iframe></div>");
      }
      backdrop.click(function(e){
        var target = $(e.target);
        var papis = target.parents();
        var hideme = true;
        for(i in papis){
          if(papis.eq(i).attr("id")=="inda"){
            hideme = false;
          }
        }
        if(hideme){
          $(this).hide(500,function(){
            $(this).remove();
          });
        }
      });
      $("BODY").append(backdrop);
      backdrop.show(500);
    });
    return nu;
  }

  this.overlapsAt = function(donde, fila){
    for(i in donde){
      var ele = donde[i];
      //si no està en la mateixa fila, no ens calfem el cap

      if(ele.fila == fila){
        if((this.start < ele.end && ele.start < this.end) || (this.end > ele.start && this.start < ele.end)){
          return true;
        }
      }
    }
    return false;
  }
}
Proyecto.prototype = Object.create(Segment.prototype);
Proyecto.prototype.constructor = Proyecto;

function Puntual (obj){
  this.name = obj.name;
  this.when = obj.when;
  this.color = "#F7DB15";
  this.size = "30px";

  this.getPos = function(){
    d1 = new Date(ALEPH);
    d1 = d1.getTime();

    d2 = new Date(this.when);
    d2 = d2.getTime();

    return 100*(d2-d1)/total();
  };

  this.creaDiv = function(){
    var nu = document.createElement("DIV");
    nu.appendChild(document.createTextNode(""));

    //ESTIL PER A LA PART DE PROJECTES
    nu.style.backgroundColor = this.color;
    nu.style.width = this.size;
    nu.style.height = this.size;
    nu.style.display = "block";
    nu.style.position = "absolute";
    nu.style.zIndex = "3";

    var x = Math.floor(30*Math.random()+50)
    nu.style.top = x+"%";
    nu.style.left = this.getPos() + "%";
  }
}
Puntual.prototype.constructor = Puntual;

//Comencem a construir la pàgina. Partim pel div que ho engloba tot.
var h = $(window).innerHeight()-$("#navul").height();
$("#cont").attr({
  "width": "100vw"
});
var papa = $(".restus");

$.getJSON("proyectos/educacion.json", function(data){
  for(i in data){
    var ele = new Etapa(data[i]);
    papa.append(ele.creaDiv());
  }

  //Anem a pels anys.
  var year0 = 2013;
  var year1 = new Date();
  year1 = year1.getFullYear();

  for(i=year0; i<=year1; i++){
    var rule = $("<div class='ano'></div>");
    var label = $("<div class='label'><p>"+i+"</p></div>");
    var alles = $("<div class='annus'></div>");
    alles.append(rule);
    alles.append(label);

    //calculem la distància des de l'1 de gener de XXXX a ALEPH
    var beg = new Puntual({"name": i,
      "when": "January 1, "+ i});

    var col = 1 - 0.5*(i-year0)/(0.0+year1-year0);
    col = "rgba(0,0,0," + col + ")";

    rule.css("background-color",col);
    label.children("p").css("color",col);
    alles.css("left",beg.getPos()+"%");
    papa.append(alles);
    label.css("left",-label.children("p").width()/2+10+"px");
  }

  //Anem ara a pels projectes en plan BIEN
  $.getJSON("proyectos/proyectos.json", function(data){
    var projectibus = [];
    for(i in data){
      var ele = new Proyecto(data[i]);
      projectibus.push(ele);
    }

    //el primer és esbrinar el nº de files que necessitarem
    var filas = 1;
    for(i in projectibus){
      var ele = projectibus[i];
      //recorrem les files fins trobar una on no hi haja overlap
      var j=0;
      if(i!=0){
        var placed = projectibus.slice(0,i+1); //projectes que ja hem col·locat
        var sitios = [];
        for(j=0; j<filas; j++){
          if(!ele.overlapsAt(placed,j)){
            sitios.push(j);
          }
        }
        sitios.push(filas);

        ele.fila = Math.min.apply(null, sitios);
        if(ele.fila==filas){
          filas = filas + 1;
        }
      }
    }
    //i ara, anem col.locant-ho tot
    for(i in projectibus){
      var nu = projectibus[i].creaDiv(filas);
      papa.append(nu);
    }

    responsiveTimeline();
  });

  $.getJSON("proyectos/bolos.json", function(data){
    for(i in data){
      var ele = new Puntual(data[i]);
      papa.append(ele.creaDiv());
    }
  });
});

function responsiveTimeline(){
  //mirem primer el tema etapes educatives
  var etapas = $(".edu");

  for (i=0; i<etapas.length; i++){
    var ele = etapas.eq(i);
    var w0 = ele.get(0).offsetWidth;
    var w1 = ele.children("h1").get(0).scrollWidth;
    //si la mida de la primera paraula és més gran que el div, mostrem només la primera paraula
    if (w1 > w0){
      ele.children("span").show();
      ele.children("h1, h2, h3").hide();
    } else {
      ele.children("span").hide();
      ele.children("h1, h2, h3").show();
    }
  }

  //passem a mirar els PROJECTES;
  var projos = $(".proj");
  for (i=0; i<projos.length; i++){
    var ele = projos.eq(i);
    var w0 = ele.get(0).offsetWidth;
    var w1 = ele.children("h1").get(0).scrollWidth;
    //si la mida de la primera paraula és més gran que el div, mostrem només la primera paraula
    if (w1 > w0){
      ele.children("h2").show();
      ele.children("h1").hide();
    } else {
      ele.children("h2").hide();
      ele.children("h1").show();
    }
  }
}
