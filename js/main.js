var CANVAS_WIDTH = 750;
var CANVAS_HEIGHT = 400;
var IMAGE_HEIGHT = 400;
var IMAGE_WIDTH = 750;

function JSP_image() {

  var zIndex;
  var FR;

  // Position and Dimension Relative to Canvas
  this.iPosX;
  this.iPosY;
  this.iWidth;
  this.iHeight;

  // Position and Dimension  Relative to the Image
  this.cPosX;
  this.cPosY;
  this.cWidth;
  this.cHeight;

  this.init = function ( _iPosX, _iPosY, _iWidth, _iHeight, _cPosX, _cPosY, _cWidth, _cHeight ) {
    this.iPosX = _iPosX;
    this.iPosY = _iPosY;
    this.iWidth = _iWidth;
    this.iHeight = _iHeight;

    this.cPosX = _cPosX;
    this.cPosY = _cPosY;
    this.cWidth = _cWidth;
    this.cHeight = _cHeight;

    console.log( _iPosX + " ," + _iPosY + " ," + _iWidth + " ," + _iHeight + " ," + _cPosX + " ," + _cPosY + " ," + _cWidth + " ," + _cHeight )
  };
};


function JSP_svg() {
  //for SVG

}

/**
 * Poperty the images , svgs and contents of the each layers
 */
function Layer() {
  var zIndex;
  var tempcanvas;
  var tempcontext;
  var jsp_images = [];
  var images = [];
  var svgs = [];
  var that = this;

  this.init = function ( _tempcanvas ) {
    tempcanvas = _tempcanvas;
    tempcontext = tempcanvas.getContext( '2d' );
  }

  this.print = function ( id ) {
    console.log( "hi this is layer" + id );

  };

  /**
   * Add Image
   */
  this.addImage = function () {
    var image = new Image();

    images.push( image );

  };

  /**
   * Draw everything the layer
   */
  this.redraw = function ( canvas ) {

    for ( var i = 0; i < images.length; i++ ) {
      that.draw( images[ i ], jsp_images[ i ] );
    }

  };

  this.draw = function ( img, jsp_image ) {
    tempcontext.drawImage( img, jsp_image.iPosX, jsp_image.iPosY, jsp_image.iWidth, jsp_image.iHeight, jsp_image.cPosX, jsp_image.cPosY, jsp_image.cWidth, jsp_image.cHeight ); // source rectangle );
  };

  /**
   * Read the file path from the input file and load the image in the canvas
   * @return {[type]} [description]
   */
  this.readImage = function () {
    console.log( "image rcv" );

    if ( this.files && this.files[ 0 ] ) {
      FR = new FileReader();

      FR.onload = function ( e ) {
        var img = new Image();
        var jsp_image = new JSP_image();

        img.onload = function () {

          var hRatio = tempcanvas.width / img.width;
          var vRatio = tempcanvas.height / img.height;
          var ratio = Math.min( hRatio, vRatio );
          console.log( "image written" );
          //Saving the Image Values
          jsp_image.init( 0, -20, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio );
          jsp_images.push( jsp_image );
          that.draw( img, jsp_image );
        };

        img.src = e.target.result;
        images.push( img );
      };
      FR.readAsDataURL( this.files[ 0 ] );
    }
  };

  /**
   * Remove Everythng on this Layer
   */
  this.delete = function () {
    console.log( tempcanvas );
    var img = tempcontext.createImageData( tempcanvas.width, tempcanvas.height );
    for ( var i = img.data.length; --i >= 0; )
      img.data[ i ] = 0;
    tempcontext.putImageData( img, 0, 0 );
    alert( "delete" );
  };

}

/**
 * [Drawing on the mouse move event ]
 * @return {[type]} [description]
 */
function drawDoddle() {
  this.color = '#FFF';
  this.width = 5;
  this.height = 5;
  var canvas;
  var context;
  var hold = 0; //Boolean Mouse HOld


  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var paint;

  /**
   * Constructor
   */
  this.init = function ( _canvas ) {
    canvas = _canvas;
    context = canvas.getContext( '2d' );

  };

  var addClick = function ( x, y, dragging ) {
    clickX.push( x );
    clickY.push( y );
    clickDrag.push( dragging );
  }

  var draw = function () {
    //  context.clearRect( 0, 0, context.canvas.width, context.canvas.height ); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for ( var i = 0; i < clickX.length; i++ ) {
      context.beginPath();
      if ( clickDrag[ i ] && i ) {
        context.moveTo( clickX[ i - 1 ], clickY[ i - 1 ] );
      } else {
        context.moveTo( clickX[ i ] - 1, clickY[ i ] );
      }
      context.lineTo( clickX[ i ], clickY[ i ] );
      context.closePath();
      context.stroke();
    }

  };

  /**


   * Init by the mousedown event
   */
  this.mouseDown = function ( evt ) {
    hold = 1;
    var mousePos = getMousePos( canvas, evt );
    addClick( mousePos.x, mousePos.y, false );
    draw()

  }

  this.mouseMove = function ( evt ) {
    if ( hold == 1 ) {
      // Mouse is being dragged
      var mousePos = getMousePos( canvas, evt );
      addClick( mousePos.x, mousePos.y, true );
      draw();
    }
  }

  /**
   * Init by the mouse up event or mouse leave
   */
  this.mouseUp = function ( evt ) {
    hold = 0;
  };
}

/**
 * Getting the Position of the Mouse
 * @param  {[object]} canvas [ reference canvas]
 * @param  {[object]} evt    [event, context]
 * @return {[float]}        [x and y cordinates]
 */
function getMousePos( canvas, evt ) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


/**
 * Main Funcition IIFE
 */
function main() {


  var canvas = ei( 'viewport' );
  var context = canvas.getContext( '2d' );
  var tempcanvas = ei( 'tempcanvas' );
  var tempcontext = tempcanvas.getContext( '2d' );

  var activeLayerId = 0;
  var layers = [];

  var layersDiv = ec( 'layers-collection' );
  //Layer Selection Event Listernersi
  var layerBoxes = [];

  function addlayer() {
    var layer = new Layer();
    layer.init( canvas );
    layers.push( layer );

    var li = document.createElement( 'li' );
    li.className = ' collection-item ';
    li.setAttribute( 'name', 'layerdiv' );
    li.appendChild( document.createTextNode( 'layer' + layers.length ) );
    li.addEventListener( 'click', layerSelected );
    layerBoxes.push( li );
    layersDiv.appendChild( li );
    console.log( "layers added" );
  }

  function layerSelected( e ) {
    console.log( "Prev selected" + activeLayerId );
    en( "layerdiv" )[ activeLayerId ].className = 'collection-item';

    e.target.className = 'collection-item active';

    var y = -1;


    console.log( e.target.parentNode.childNodes );

    do {
      y++;
      var x = e.target.parentNode.childNodes[ y ];

    } while ( e.target !== x );

    activeLayerId = y - 1;
    console.log( "layer selected" + activeLayerId );
  }

  function deletelayer() {
    console.log( 'layer' + activeLayerId + "= delected" );
    layers[ activeLayerId ].delete();
    layers.splice( activeLayerId - 1, 1 );
    for ( var i in layers ) {
      console.log( layers[ i ] );
    }
    var del = en( "layerdiv" );
    del[ activeLayerId ].parentNode.removeChild( del[ activeLayerId ] );

    redraw();
  }

  function redraw() {
    console.log( 'redrawing' );
    for ( var x in layers ) {
      if ( x != activeLayerId ) {
        layers[ x ].redraw();
      }
    }
    activeLayerId = 0;
  }

  // Set the Dimension for canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  tempcanvas.width = CANVAS_WIDTH;
  tempcanvas.height = CANVAS_HEIGHT;


  var doodle = new drawDoddle();
  //Passing which canvas  the doodle needs to work
  doodle.init( tempcanvas );

  //  Event Listerners for the drawDoddle
  tempcanvas.addEventListener( 'mousedown', doodle.mouseDown );
  tempcanvas.addEventListener( 'mouseup', doodle.mouseUp );
  tempcanvas.addEventListener( 'mousemove', doodle.mouseMove );
  tempcanvas.addEventListener( 'mouseleave', doodle.mouseUp );

  ei( 'newlayer' ).addEventListener( 'click', addlayer );
  ei( 'deletelayer' ).addEventListener( 'click', deletelayer );
  //  ei( 'deletelayer' ).addEventListener( 'click', deletelayyer );

  addlayer();




  // Event Listerners
  ei( "fileUpload" ).addEventListener( "change", layers[ activeLayerId ].readImage, false );
}


// initialization on Load
;
( function init() {

  main();
} )();


/**
 * Get the Id element
 * @param  {[string}  [id for the element]
 * @return {[object]}    [element with the respective Id]
 */
function ei( id ) {
  return document.getElementById( id );
}

/**
 * Get the class element
 * @param  {[string]}  [class for the element]
 * @return {[object]}    [elementwith the respective class]
 */
function ec( cl ) {
  return document.getElementsByClassName( cl )[ 0 ];
}

function en( name ) {
  return document.getElementsByName( name );
}
