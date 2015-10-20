
$(function() {
    fileElem.addEventListener("change", function(e) {
            handleFiles(this.files);
    }, false);
})

function handleFiles(files) {
    if (!files.length) {
        alert("No files selected!");
        return;
    }
    else {
        var list = document.createElement("ul");
        var imageType = /^image\//;
        var imageFile = files[0];
        console.log(imageFile);
        if (!imageType.test(imageFile.type)) {
            alert("This does'n look like an image");
            return;
        }
        else {
            var caps = ractive.get("capsData.0");
            caps.img = window.URL.createObjectURL(imageFile); // imageFile.name;
            // console.log(caps.img);
            ractive.set("imageLoaded", true)
        }

    }
}

function createCaps(capsData, img) {
    capsData.img = img;
    caps.push();

}

var capsDefault = {
      'seperate': false,
      'pos' : "bottom",
      'img' : "nurella.jpg",
      'textBackgroundColor': "green",
      'textColor': "black",
      'textSize': 40,
      'fontFamily': "TimesNewRoman",
      'text' : "N'aber?",
      'fabric.Image': null,
      'fabric.Text': null,
      'fabric.Textbox': null,
      'unlock':false,
      'opacity': 60
    }


var canvas;
var fontfamily = ['Courier', 'TimesNewRoman', 'Arial','Georgia', 'Blagovest', 'Monospace', 'Bookman', 'Helvetica', 'Arial Black', 'Impact', 'Fixed','Florence', 'Verdana'];


var CapsWidget = Ractive.extend({
  magic: true,
  // el: 'container',
  template: '#template',
  data: {
      i: 0,
      caps: null,
      fontfamily: fontfamily,
      // selected: null,
      canvas: null,
      atTop: false
  },
  oncomplete: function() {
      var canvas = new fabric.Canvas('c' + this.get("i"), {backgroundColor: "transparent"})
      this.set('canvas', canvas);
      init_gui(canvas, this.get("caps"));
      console.log(this.get("caps"));
     this.observe("caps.text", function(newValue, oldValue, keypath) {
          check_size = true;
          var canvas = this.get("canvas");
          // console.log(this.get("caps"));
          updateAll(canvas, this.get("caps"));
      }, {init: false});
      this.observe("caps.textBackgroundColor", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateText(canvas, this.get("caps"));
      }, {init: false});
      this.observe("caps.textColor caps.opacity", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateText(canvas, this.get("caps"));
      }, {init: false});
      this.observe("caps.fontFamily", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateAll(canvas, this.get("caps"));
      }, {init: false});
      this.observe("caps.textSize", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateAll (canvas, this.get("caps"));
      }, {init: false});
      this.observe("caps.seperate", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateAll(canvas, this.get("caps"));
      }, {init: false});
      this.observe("atTop", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          var caps = this.get("caps");
          caps.pos = newValue ? "top" : "bottom";
          updateAll(canvas, caps);
      }, {init: false});
      this.observe("caps.unlock", function(newValue, oldValue, keypath) {
          console.log("new", newValue);
          console.log("old", oldValue);
          console.log("keypath", keypath);
          updateAll(canvas, this.get("caps"));
      }, {init: false});


    var button = document.getElementById('btn-download');
    button.addEventListener('click', function (e) {
        var dataURL = canvas.toDataURL('image/png');
         button.href = dataURL;
});


  },

  oninit: function() {

  },
});

/*
ractive.observe("caps.*.top_checked", function(newValue, oldValue, keyPath, idx) {
    console.log("OBSERVER:", newValue,keyPath, idx);
    caps[idx].pos = newValue ? "top" : "bottom";
}) */

var ractive = new Ractive({
  el: 'container',
  template: "#main",
  data: {
    capsData: [capsDefault],
    imageLoaded: false
  },
  components: {
    caps: CapsWidget
  }
});

ractive.on("openFileWindow", function() {
    fileElem = document.getElementById("fileElem");
    if (fileElem) {
        fileElem.click();
    }
    return false;
    // e.preventDefault(); // prevent navigation to "#"
})
// initialize

// initial values
var caps_list = [

];
/*
var decorators = Ractive.decorators,
  combined = decorators.combine([
    {
      color: decorators.create(function(color){
        this.style.color = color
      })
    },
    {
      font: decorators.create(function(pt){
        //this.style.fontWeight = weight
        this.caps.textSize= pt + 'pt'
      })
    }
  ]),
  ractive = new Ractive({
    el: '#demo-combine',
    template: '#demo-template-combine',
    decorators: {
      styleMe: combined
    },
    data : {
      color: 'green',
      pt: 20
    }
  });*/
/*
$(function() {

  function text_size_slider_moved() {

   var new_size = $(this).slider("value");
   caps = caps_list[0]
   caps["textSize"] =  new_size;
   // check_size = true;
   updateText(caps);
   updateImg(caps);
   text_size_slider_changed()
  }

  function text_size_slider_changed() {
    var elem = $("#textSize")
    var new_size = elem.slider("value");
    var div = elem.children("div span");
    div.text(new_size);
  }

  $("#textSize").slider( {
     min: 10,
     max: 50,
     value: 30,
     slide: text_size_slider_moved,
     change: text_size_slider_changed
  });


//var caps = caps_list[0]

$("#backgroundOpacity").slider( {
     min: 0,
     max: 1,
     value:0.5,
     step:0.01,
     slide: function(e,ui){
        caps["fabric.TextBox"].set({opacity: ui.value})
    // caps["fabric.Text"].set({opacity: ui.value})
        // console.log(caps["fabric.Text"].getOpacity());
        canvas.renderAll()
     // $("#c").css("opacity", ui.value);
    }
  });

})*/
function init_gui(canvas, caps) {
  // $("#seperate").prop("checked", caps.seperate);
  // $("#top").prop("checked", caps.pos == "top");
  // $("#metin").val(caps.text);
  fabric.Image.fromURL(caps.img, function(img) {
     imgObj = img;
     caps['fabric.Image'] = imgObj;
     caps['fabric.Text'] =  new fabric.Text("", {
       originX: "center",
       left: imgObj.getWidth()/2
     });

     // caps['fabric.Text']._capsmatic_renderBox = false;
     caps["fabric.Image"].selectable=false;
     caps["fabric.Text"].selectable=false;
     caps['fabric.TextBox'] =  new fabric.Rect({
       left: 0,
       stroke: "black"
    });
    canvas.add(imgObj)
    canvas.add(caps['fabric.TextBox'])
    canvas.add(caps['fabric.Text'])
    //updateAll(caps);
    updateAll(canvas, caps);
  });
}

function updateImg(canvas, caps) {
  caps["fabric.Image"].set({"top": (caps.seperate && caps.pos == "top" ? caps["fabric.Text"].getHeight() : 0) })
  caps["fabric.TextBox"].setWidth(caps["fabric.Image"].getWidth()-1)
  w = caps["fabric.Image"].getWidth()
  h = caps["fabric.Image"].getHeight() + (caps.seperate ? caps["fabric.Text"].getHeight() : 0);
  canvas.setDimensions({width: w, height: h})
  canvas.renderAll()
}

var check_size = false;

function updateAll(canvas, caps) {
  updateImg(canvas, caps);
  updateText(canvas, caps);
}

function updateText(canvas, caps) {
  caps["fabric.Image"].set({"top": (caps.seperate && caps.pos == "top" ? caps["fabric.Text"].getHeight() : 0) });
  caps["fabric.Text"].set({"unlock": (caps.unlock ? caps["fabric.Text"].selectable=true && canvas.remove(caps['fabric.TextBox']) : 0) });
  caps["fabric.Text"].set({
     text: caps["text"],
     top: caps.pos == "top" ? 0 : caps["fabric.Image"].getHeight(),
     originY: caps.pos == "bottom" && !caps.seperate ? "bottom" : "top",
     textBackgroundColor: caps["textBackgroundColor"],
     fill: caps["textColor"],
     fontSize: caps["textSize"],
     // opacity: caps["opacity"] / 100,
     fontFamily: caps["fontFamily"]
  })

   if (check_size) {
     adjust_text_size(caps);
     check_size = false;
   }

  caps["fabric.TextBox"].set({
     top: caps.pos == "top" ? 0 : caps["fabric.Image"].getHeight(),
     originY: caps.pos == "bottom" && !caps.seperate ? "bottom" : "top",
     fill: caps["textBackgroundColor"],
     height: caps["fabric.Text"].getHeight() + 1,
     opacity: caps["opacity"] / 100
   })
   canvas.renderAll()
}

function adjust_text_size(caps) {
   var text = caps["fabric.Text"];
   var max_width = caps["fabric.Image"].getWidth();
   var currentSize = text.get("fontSize");
   while (max_width < text.getWidth() && currentSize > 10) {
     currentSize -= 2
     text.set("fontSize", currentSize)
   }
   caps["textSize"] = currentSize
   ractive.set("capsData.0.textSize", currentSize);
}
