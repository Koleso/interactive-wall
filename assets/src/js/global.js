/*
*
*  Project:    Interactive wall
*  Author:     David Kolinek - www.davidkolinek.cz
*  E-mail:     david.kolinek@gmail.com
*
*  @param {Object} window, document, undefined
*
*/

(function(window, document, undefined) {
  
  // Defaults
  // =====================================
 
  var dk = window.dk = {
      utils : {},
      cache : {}
  };


  // Methods
  // =====================================

  dk.utils.init = function() {
    dk.cache.window                = $(window);
    dk.cache.document              = $(document);
    dk.cache.html                  = $('html');
    dk.cache.body                  = $('body');
  };

  // SCROLL DOWN PULSE
  dk.utils.firstLoad = function(){

    $('.row-top .card').each(function (index){
      var card = this;

      setTimeout(function (el) {
        $(card).parent('li').addClass('show-card');
      }, index*200);
    });

    setTimeout(function () {
      $('.row-bottom .card').each(function (index){
        var card = this;

        setTimeout(function (el) {
          $(card).parent('li').addClass('show-card');
        }, index*200);
      });
    }, 100);

  };


  dk.utils.domLoad = function() {

    dk.utils.firstLoad();

  };


  // Initialize Events
  // =====================================

  dk.utils.init();

  jQuery(function($) {
    dk.utils.domLoad();
  });


})(window, document);

// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
(function($,sr) {

  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }
      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  jQuery.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');