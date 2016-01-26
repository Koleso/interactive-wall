'use strict';

/*
*
* Project:    Interactive wall
* Author:     David Kolinek - www.davidkolinek.cz
* E-mail:     david.kolinek@gmail.com
*
* open /Applications/Google\ Chrome\ Canary.app --args --allow-file-access-from-files/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --args --allow-file-access-from-files
* 
*/

var promise = new RSVP.Promise(function (resolve, reject) {
  resolve(value);
  reject(error);
});

var app = {
  // Cons
  w: null,
  itemW: null,
  initialCount: null,

  // Data
  bulk: null,
  rendered: [],
  lastRowFirst: false,

  init: function init() {
    this.w = window.innerWidth;
    this.itemW = 350;
    this.initialCount = parseInt(this.w / this.itemW);

    app.loadBulk("bulk.json", function () {
      app.loadWall();
    });
  },

  loadBulk: function loadBulk(data, callback) {
    $.getJSON(data, function (json) {
      app.bulk = $.map(json.statuses, function (value, index) {
        return [value];
      });
      callback();
    });
  },

  loadWall: function loadWall() {
    // Initial load
    for (var i = 0; i < this.initialCount * 2; i++) {
      app.loadPost(app.getPost(), true, i);
    }

    // Fake loading
    setTimeout(function () {
      document.getElementById('d-loading').classList.add('d-fade');

      var elementsTop = document.querySelectorAll("#d-row--top li");
      var elementsBottom = document.querySelectorAll("#d-row--bottom li");

      Array.prototype.forEach.call(elementsTop, function (el, i) {
        setTimeout(function () {
          el.classList.add('d-show');
          console.log(el);
        }, i * 50);
      });

      setTimeout(function () {
        Array.prototype.forEach.call(elementsBottom, function (el, i) {
          setTimeout(function () {
            el.classList.add('d-show');
            console.log(el);
          }, i * 50);
        });
      }, 50);
    }, 2000);

    // Load new posts
    setTimeout(function () {
      //app.loadNextItem();
    }, 2000);
  },

  loadNextItem: function loadNextItem() {
    // Random generator for displaying new posts
    setTimeout(function () {
      app.loadPost(app.getPost(), false); // Load only 1 item
      if (app.getBulkLength() > 0) {
        app.loadNextItem();
      }
    }, Math.floor(Math.random() * 4 + 2) * 1000);
  },

  loadPost: function loadPost(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var images = [item.user.profile_image_url];
    if (item.image_url) {
      images.push(item.image_url);
    }

    app.preloadImages(images, function () {
      app.renderPost(item, initial);
    });
  },

  renderPost: function renderPost(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var $newPost = $(app.getPostTemplate(item, initial));
    if (app.lastRowFirst) {
      $("#d-row--bottom").prepend($newPost);
    } else {
      $("#d-row--top").prepend($newPost);
    }
    app.lastRowFirst = !app.lastRowFirst;

    if (!initial) {
      setTimeout(function () {
        $newPost.addClass("d-show");
      }, 16);

      if (app.rendered.unshift($newPost) > this.initialCount * 2 + 4) {
        var $last = app.rendered.pop();
        $last.remove();
      };
    }

    return $newPost;
  },

  getPostTemplate: function getPostTemplate(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (item.network === "instagram") {
      return app.getInstagram(item, initial);
    } else if (item.network === "twitter") {
      return app.getTweet(item, initial);
    }
  },

  getTweet: function getTweet(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var anim = 'anim-flip-left';
    if (initial) anim = 'anim-flip';

    return '<li>' + '<div class="d-card d-card--twitter ' + anim + '">' + '<p class="d-card-title">Twitter</p>' + '<p class="d-card-message">' + item.text.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='d-hash'>$2</span>") + '</p>' + '<div class="d-card-user">' + '<img src="' + item.user.profile_image_url + '" alt="' + item.user.screen_name + '" class="d-card-userPhoto">' + '<p class="d-card-userName">@' + item.user.screen_name + '</p>' + '<p class="d-card-likeCount">' + item.favorite_count + '</p>' + '</div>' + '</div>' + '</li>';
  },

  getInstagram: function getInstagram(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var anim = 'anim-flip-left';
    if (initial) anim = 'anim-flip';

    return '<li>' + '<div class="d-card d-card--instagram ' + anim + '">' + '<img src="' + item.image_url + '" alt="" class="d-card-photo">' + '<div class="d-card-user">' + '<img src="' + item.user.profile_image_url + '" alt="' + item.user.screen_name + '" class="d-card-userPhoto">' + '<p class="d-card-userName">@' + item.user.screen_name + '</p>' + '<p class="d-card-likeCount">' + item.favorite_count + '</p>' + '</div>' + '</div>' + '</li>';
  },

  getPost: function getPost() {
    return app.bulk.shift();
  },

  getBulkLength: function getBulkLength() {
    return app.bulk.length;
  },

  preloadImages: function preloadImages(images, callback) {
    var count = images.length;
    if (count === 0) {
      callback();
    }

    var loaded = 0;
    for (var i = 0; i < count; i++) {
      var img = new Image();
      img.src = images[i];
      img.onload = function () {
        loaded++;
        if (loaded === count) {
          callback();
        }
      };
    }
  }
};

app.init();
//# sourceMappingURL=global.babel.js.map
