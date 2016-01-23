"use strict";

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

  init: function init() {
    this.w = window.innerWidth;
    this.itemW = 350;
    this.initialCount = parseInt(this.w / this.itemW);
    app.loadBulk();
  },

  loadWall: function loadWall() {
    setTimeout(function () {
      $("#d-row--top .d-card").each(function (index) {
        var card = this;

        setTimeout(function () {
          $(card).parent('li').addClass("d-show");
        }, index * 200);
      });
    }, 0);

    setTimeout(function () {
      $("#d-row--bottom .d-card").each(function (index) {
        var card = this;

        setTimeout(function () {
          $(card).parent('li').addClass("d-show");
        }, index * 200);
      });
    }, 50);

    setTimeout(function () {
      app.loadNextItem();
    }, 1000);
  },

  loadNextItem: function loadNextItem() {
    // Random generator for displaying new posts
    setTimeout(function () {
      app.loadPosts(false);
      if (app.getBulkLength() > 0) {
        app.loadNextItem();
      }
    }, Math.floor(Math.random() * 4 + 2) * 1000);
  },

  loadBulk: function loadBulk() {
    $.getJSON("bulk.json", function (json) {
      app.bulk = app.convertBulk(json);
      app.loadPosts(true);
    });
  },

  getBulkLength: function getBulkLength() {
    return app.bulk.length;
  },

  convertBulk: function convertBulk(json) {
    return $.map(json.statuses, function (value, index) {
      return [value];
    });
  },

  loadPosts: function loadPosts() {
    var initial = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    if (initial) {
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

    return '<li>' + '<div class="d-card d-card--instagram ' + anim + '">' + '<img src="' + item.image_url + '" alt="" class="d-card-userPhoto">' + '<div class="d-card-user">' + '<img src="' + item.user.profile_image_url + '" alt="' + item.user.screen_name + '" class="d-card-userPhoto">' + '<p class="d-card-userName">@' + item.user.screen_name + '</p>' + '<p class="d-card-likeCount">' + item.favorite_count + '</p>' + '</div>' + '</div>' + '</li>';
  },

  getPostTemplate: function getPostTemplate(item) {
    var initial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (item.network === "instagram") {
      return app.getInstagram(item, initial);
    } else if (item.network === "twitter") {
      return app.getTweet(item, initial);
    }
  },

  renderPost: function renderPost() {
    var initial = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var $newPost = $(app.getPostTemplate(app.getPost(), initial));
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
    }

    if (app.rendered.unshift($newPost) > this.initialCount * 2 + 4) {
      console.log(app.rendered.length);
      var $last = app.rendered.pop();
      $last.remove();
    };

    return $newPost;
  },

  getPost: function getPost() {
    return app.bulk.shift();
  }
};

app.init();
//# sourceMappingURL=global.babel.js.map
