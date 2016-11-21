var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 500;
var IMAGE_HEIGHT = 400;
var IMAGE_WIDTH = 750;


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
      //alert( "Mouse Down" );
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


/**
 * Main Funcition IIFE
 */
function main() {


  var canvas = ei( 'mycanvas' )
  var context = canvas.getContext( '2d' );

  // Set the Dimension for canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;


  var doodle = new drawDoddle();

  //Passing which canvas  the doodle needs to work
  doodle.init( canvas );

  //  Event Listerners for the drawDoddle
  canvas.addEventListener( 'mousedown', doodle.mouseDown );
  canvas.addEventListener( 'mouseup', doodle.mouseUp );
  canvas.addEventListener( 'mousemove', doodle.mouseMove );
  canvas.addEventListener( 'mouseleave', doodle.mouseUp );




  /**
   * Read the file path from the input file and load the image in the canvas
   * @return {[type]} [description]
   */
  function readImage() {
    if ( this.files && this.files[ 0 ] ) {
      var FR = new FileReader();
      FR.onload = function ( e ) {
        var img = new Image();
        img.onload = function () {

          var hRatio = canvas.width / img.width;
          var vRatio = canvas.height / img.height;
          var ratio = Math.min( hRatio, vRatio );
          context.drawImage( img, 0, -20, img.width, img.height, // source rectangle
            0, 0, img.width * ratio, img.height * ratio );
        };
        img.src = e.target.result;
      };
      FR.readAsDataURL( this.files[ 0 ] );
    }
  }

  // Event Listerners
  ei( "fileUpload" ).addEventListener( "change", readImage, false );
}


;
( function init() {

  main();
} )();
