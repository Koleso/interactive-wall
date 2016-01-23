/*
*
* Project:    Interactive wall
* Author:     David Kolinek - www.davidkolinek.cz
* E-mail:     david.kolinek@gmail.com
*
* open /Applications/Google\ Chrome\ Canary.app --args --allow-file-access-from-files/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --args --allow-file-access-from-files
* 
*/

var app = {
  bulk: null,
  rendered: [],
  w: null,
  itemW: null,
  initialCount: null,
  lastRowFirst: false,

  init: function () {
    this.w = window.innerWidth;
    this.itemW = 350;
    this.initialCount = parseInt(this.w / this.itemW);
    app.loadBulk();
  },

  loadWall: function () {
    setTimeout(function() {
      $("#d-row--top .d-card").each(function(index) {
        var card = this;

        setTimeout(function () {
          $(card).parent('li').addClass("d-show");
        },  index*200);
      });
    }, 0);

    setTimeout(function() {
      $("#d-row--bottom .d-card").each(function(index) {
        var card = this;
        
        setTimeout(function () {
          $(card).parent('li').addClass("d-show");
        },  index*200);
      });
    }, 50);

    setTimeout(function() {
      app.loadNextItem();
    }, 1000);

  },

  loadNextItem: function () {
    // Random generator for displaying new posts
    setTimeout(function() {
      app.loadPosts(false);
      if(app.getBulkLength() > 0) {
        app.loadNextItem();
      }
    }, Math.floor(Math.random()*4+2)*1000);
  },

  loadBulk: function () {
    $.getJSON("bulk.json", function(json) {
      app.bulk = app.convertBulk(json);
      app.loadPosts(true);
    });
  },

  getBulkLength: function () {
    return app.bulk.length;
  },

  convertBulk: function (json) {
    return $.map(json.statuses, function(value, index) {
      return [value];
    });
  },

  loadPosts: function (initial = false) {
    if(initial) {
      // Initial state, fill whole wall
      for (var i = 0; i < this.initialCount; i++) {
        app.renderPost(initial);
        app.renderPost(initial);
      };
      app.loadWall();

    } else {
      // Load one new post
      app.renderPost(initial);
    }
  },

  getTweet: function (item, initial = false) {
    var anim = 'anim-flip-left';
    if(initial) anim = 'anim-flip';

    return '<li>' +
          '<div class="d-card d-card--twitter '+anim+'">' +
            '<p class="d-card-title">Twitter</p>' +
            '<p class="d-card-message">'+item.text.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='d-hash'>$2</span>")+'</p>' +
            '<div class="d-card-user">' +
              '<img src="'+item.user.profile_image_url+'" alt="'+item.user.screen_name+'" class="d-card-userPhoto">' +
              '<p class="d-card-userName">@'+item.user.screen_name+'</p>' +
              '<p class="d-card-likeCount">'+item.favorite_count+'</p>' +
            '</div>' +
          '</div>' +
        '</li>';
  },

  getInstagram: function (item, initial = false) {
    var anim = 'anim-flip-left';
    if(initial) anim = 'anim-flip';

    return '<li>' +
          '<div class="d-card d-card--instagram '+anim+'">' +
            '<img src="'+item.image_url+'" alt="" class="d-card-photo">' +
            '<div class="d-card-user">' +
              '<img src="'+item.user.profile_image_url+'" alt="'+item.user.screen_name+'" class="d-card-userPhoto">' +
              '<p class="d-card-userName">@'+item.user.screen_name+'</p>' +
              '<p class="d-card-likeCount">'+item.favorite_count+'</p>' +
            '</div>' +
          '</div>' +
        '</li>';
  },


  getPostTemplate: function (item, initial = false) {
    if(item.network === "instagram") {
      // app.preloadImages([item.user.profile_image_url, item.image_url], function () {
      //   return app.getInstagram(item, initial);
      // });
      return app.getInstagram(item, initial);
    } else if(item.network === "twitter") {
      // app.preloadImages([item.user.profile_image_url], function () {
      //   return app.getTweet(item, initial);
      // });
      return app.getTweet(item, initial);
    }
  },

  renderPost: function (initial = false) {
    var $newPost = $(app.getPostTemplate(app.getPost(), initial));
    if(app.lastRowFirst) {
      $("#d-row--bottom").prepend($newPost);
    } else {
      $("#d-row--top").prepend($newPost);
    }
    app.lastRowFirst = !app.lastRowFirst;

    if(!initial) {
      setTimeout(function () {
        $newPost.addClass("d-show");
      }, 16);
    }

    if(app.rendered.unshift($newPost) > this.initialCount*2+4) {
      var $last = app.rendered.pop();
      $last.remove();
    };

    return $newPost;
  },

  getPost: function () {
    return app.bulk.shift();
  },

  preloadImages: function (images, callback) {
    var count = images.length;
    if(count === 0) {
        callback();
    }

    var loaded = 0;
    for (var i = 0; i < count; i++) {
      var img = new Image(); 
      img.src = images[i];
      img.onload = function () {
        loaded++;
        if(loaded === count) {
          callback();
        }
      }
    }
  }
};

app.init();