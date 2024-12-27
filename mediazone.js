(function () {
  'use strict';

  function item(data) {
    var item = Lampa.Template.get('mediazone_item', {
      name: data.title
    });
    var img = item.find('img')[0];
    img.onerror = function () {
      img.src = './img/img_broken.svg';
    };
    img.src = data.image;
    this.url = data.url;
    this.title = data.title;
    this.component = data.component;
    this.render = function () {
      return item;
    };
    this.toggle = function () {};
    this.destroy = function () {
      img.onerror = function () {};
      img.onload = function () {};
      img.src = '';
      item.remove();
    };
  }

  function create(data) {
    var content = Lampa.Template.get('items_line', {
      title: data.title
    });
    var body = content.find('.items-line__body');
    var scroll = new Lampa.Scroll({
      horizontal: true,
      vertical: true,
      step: 300
    });
    var items = [];
    var active = 0;
    var last;
    this.create = function () {
      scroll.render().find('.scroll__body').addClass('mediazone-itemlist-center');
      content.find('.items-line__title').text(data.title);
      data.results.forEach(this.appendItem.bind(this));
      body.append(scroll.render());
    };
    this.appendItem = function (element) {
      var item$1 = new item(element);
      item$1.render().on('hover:focus', function () {
        last = item$1.render()[0];
        active = items.indexOf(item$1);
        scroll.update(items[active].render(), true);
      }).on('hover:enter', function () {
        Lampa.Activity.push({
          url: item$1.url,
          title: item$1.title,
          component: item$1.component,
          page: 1
        });
      });
      scroll.append(item$1.render());
      items.push(item$1);
    };
    this.toggle = function () {
      var _this = this;
      Lampa.Controller.add('mediazone_line', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        right: function right() {
          Navigator.move('right');
          Lampa.Controller.enable('mediazone_line');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else if (_this.onLeft) _this.onLeft();else Lampa.Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Lampa.Controller.toggle('mediazone_line');
    };
    this.render = function () {
      return content;
    };
    this.destroy = function () {
      Lampa.Arrays.destroy(items);
      scroll.destroy();
      content.remove();
      items = null;
    };
  }

  function component$1() {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var active = 0;
    var sites = [];
    sites.push({
      title: 'Kinopub',
      component: 'kinopubcomponent',
      url: 'https://kinopub.me/',
      image: 'https://pbs.twimg.com/profile_images/1091807448355229697/Sgdo_u2j_400x400.jpg'
    });
    sites.push({
      title: 'Filmix',
      component: 'kinopubcomponent',
      url: 'https://filmix.fm/',
      image: 'https://filmix.ac/templates/Filmix/media/img/filmix.png'
    });
    sites.push({
      title: 'Kinokong',
      component: 'kinopubcomponent',
      url: 'https://kinokong.pro/',
      image: 'https://kinokong.pro/templates/smartphone/kk.png'
    });
    this.create = function () {
      this.activity.loader(true);
      Lampa.Platform.is('webos') || Lampa.Platform.is('tizen') || Lampa.Storage.field('proxy_other') === false ? '' : '';
      this.build();

      /*network.native(prox + 'http://localhost:3000/plugins/stations.json', this.build.bind(this),()=>{
          let empty = new Lampa.Empty()
            html.append(empty.render())
            this.start = empty.start
            this.activity.loader(false)
            this.activity.toggle()
      })*/

      return this.render();
    };
    this.build = function () {
      scroll.minus();
      html.append(scroll.render());
      this.append({
        title: "Kino",
        results: sites
      });

      /*data.result.genre.forEach(element => {
          let results = data.result.stations.filter(station=>{
              return station.genre.filter(genre=>genre.id == element.id).length
          })
            this.append({
              title: element.name,
              results: results
          })
      })*/

      this.activity.loader(false);
      this.activity.toggle();
    };
    this.append = function (element) {
      var item = new create(element);
      item.create();
      item.onDown = this.down.bind(this);
      item.onUp = this.up.bind(this);
      item.onBack = this.back.bind(this);
      scroll.append(item.render());
      items.push(item);
    };
    this.back = function () {
      Lampa.Activity.backward();
    };
    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };
    this.up = function () {
      active--;
      if (active < 0) {
        active = 0;
        Lampa.Controller.toggle('head');
      } else {
        items[active].toggle();
      }
      scroll.update(items[active].render());
    };
    this.background = function () {
      Lampa.Background.immediately('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAZCAYAAABD2GxlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHASURBVHgBlZaLrsMgDENXxAf3/9XHFdXNZLm2YZHQymPk4CS0277v9+ffrut62nEcn/M8nzb69cxj6le1+75f/RqrZ9fatm3F9wwMR7yhawilNke4Gis/7j9srQbdaVFBnkcQ1WrfgmIIBcTrvgqqsKiTzvpOQbUnAykVW4VVqZXyyDllYFSKx9QaVrO7nGJIB63g+FAq/xhcHWBYdwCsmAtvFZUKE0MlVZWCT4idOlyhTp3K35R/6Nzlq0uBnsKWlEzgSh1VGJxv6rmpXMO7EK+XWUPnDFRWqitQFeY2UyZVryuWlI8ulLgGf19FooAUwC9gCWLcwzWPb7Wa60qdlZxjx6ooUuUqVQsK+y1VoAJyBeJAVsLJeYmg/RIXdG2kPhwYPBUQQyYF0XC8lwP3MTCrYAXB88556peCbUUZV7WccwkUQfCZC4PXdA5hKhSVhythZqjZM0J39w5m8BRadKAcrsIpNZsLIYdOqcZ9hExhZ1MH+QL+ciFzXzmYhZr/M6yUUwp2dp5U4naZDwAF5JRSefdScJZ3SkU0nl8xpaAy+7ml1EqvMXSs1HRrZ9bc3eZUSXmGa/mdyjbmqyX7A9RaYQa9IRJ0AAAAAElFTkSuQmCC');
    };
    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.background();
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        },
        back: this.back
      });
      Lampa.Controller.toggle('content');
    };
    this.pause = function () {};
    this.stop = function () {};
    this.render = function () {
      return html;
    };
    this.destroy = function () {
      network.clear();
      Lampa.Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      items = null;
      network = null;
    };
  }

  function init() {
    Lampa.Template.add('mediazone_item', "<div class=\"selector mediazone-item\">\n        <div class=\"mediazone-item__imgbox\">\n            <img class=\"mediazone-item__img\" />\n        </div>\n\n        <div class=\"mediazone-item__name\">{name}</div>\n    </div>");
    Lampa.Template.add('mediazone_style', "<style>\n        .mediazoneline.focus {\n          background-color: #fff;\n          color: #000;\n          border-radius: 0.33em;\n          padding: 0.3em 1em;\n        }\n        .mediazonelinecontainer{\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          width: 50em;\n        }\n        .mediazoneline{\n          padding-top: 0.3em;\n          font-size: 1.3em;\n        }\n        .mediazone-item {\n            width: 10em;\n            -webkit-flex-shrink: 0;\n                -ms-flex-negative: 0;\n                    flex-shrink: 0;\n          }\n          .mediazone-item__imgbox {\n            background-color: #3E3E3E;\n            padding-bottom: 150%;\n            position: relative;\n            -webkit-border-radius: 0.3em;\n               -moz-border-radius: 0.3em;\n                    border-radius: 0.3em;\n          }\n          .mediazone-item__img {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          }\n          .mediazone-item__name {\n            font-size: 1.1em;\n            margin-bottom: 0.8em;\n          }\n          .mediazone-item.focus .mediazone-item__imgbox:after {\n            border: solid 0.26em #fff;\n            content: \"\";\n            display: block;\n            position: absolute;\n            left: -0.5em;\n            top:  -0.5em;\n            right:  -0.5em;\n            bottom:  -1.5em;\n            -webkit-border-radius: 0.8em;\n               -moz-border-radius: 0.8em;\n                    border-radius: 0.8em;\n          }\n          .mediazone-item + .mediazone-item {\n            margin-left: 1em;\n          }      \n                    \n          .mediazone-itemlist-center{\n            display: flex;\n            flex-direction: row;\n          }\n          \n        </style>");
  }
  var Templates = {
    init: init
  };

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }

  var tools = /*#__PURE__*/_createClass(function tools() {
    _classCallCheck(this, tools);
  });
  _defineProperty(tools, "getProxy", function () {
    var proxy = Lampa.Platform.is('webos') || Lampa.Platform.is('tizen') || Lampa.Storage.field('proxy_other') === false ? '' : '';
    //proxy = "https://corsproxy.io/?key=aabd9b6f&url="
    //proxy = "http://134.3.232.121:4000/fetch/";
    proxy = "http://localhost:4000/fetch/";
    //proxy = "https://localhost:4430/fetch/";
    //proxy = "https://134.3.232.121:4430/fetch/"; 
    return proxy;
  });
  _defineProperty(tools, "getHeaders", function () {
    return {
      "x-api-key": "testKey"
    };
  });
  _defineProperty(tools, "matchAll", function (str, re) {
    re = new RegExp(re, 'g');
    var match;
    var matches = [];
    while (match = re.exec(str)) matches.push(match);
    return matches;
  });
  _defineProperty(tools, "getRandomIntInclusive", function (min, max) {
    var minCeiled = Math.ceil(min);
    var maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  });

  function component(data) {
    var videodata = data;
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var last = null;
    this.create = function (data) {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + videodata.url, function (data) {
        _this.extractDataKinopubvideos(data);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text',
        headers: tools.getHeaders()
      });
      return this.render();
    };
    this.extractDataKinopubvideos = function (str) {
      scroll.minus();
      html.append(scroll.render());
      var data = [];
      var containerArray = tools.matchAll(str, '<div class="b-content__inline_item.*?<img src="(.*?)".*?<div class="b-content__inline_item-link.*?href="(.*?)">(.*?)</a>');
      containerArray.forEach(function (elementContainer) {
        data.push({
          titel: elementContainer[3],
          url: elementContainer[2],
          img: elementContainer[1]
        });
      });
      data.forEach(function (element) {
        var card = Lampa.Template.get("card", {
          title: element.titel,
          release_year: ""
        });
        var img = card.find(".card__img")[0];
        img.onload = function () {
          card.addClass("card--loaded");
        };
        img.onerror = function (e) {};
        img.src = element.img;
        card.on("hover:focus", function () {
          last = card[0], scroll.update(card, !0);
        });
        card.on("hover:hover", function () {
          last = card[0];
        });
        card.on('hover:enter', function () {
          Lampa.Activity.push({
            url: element.url,
            component: 'kinopubvideodetail',
            title: element.titel,
            image: element.img
          });
        });
        body.append(card);
      });
      scroll.append(body);
      this.activity.loader(false);
    };
    this.background = function () {
      Lampa.Background.immediately('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAZCAYAAABD2GxlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHASURBVHgBlZaLrsMgDENXxAf3/9XHFdXNZLm2YZHQymPk4CS0277v9+ffrut62nEcn/M8nzb69cxj6le1+75f/RqrZ9fatm3F9wwMR7yhawilNke4Gis/7j9srQbdaVFBnkcQ1WrfgmIIBcTrvgqqsKiTzvpOQbUnAykVW4VVqZXyyDllYFSKx9QaVrO7nGJIB63g+FAq/xhcHWBYdwCsmAtvFZUKE0MlVZWCT4idOlyhTp3K35R/6Nzlq0uBnsKWlEzgSh1VGJxv6rmpXMO7EK+XWUPnDFRWqitQFeY2UyZVryuWlI8ulLgGf19FooAUwC9gCWLcwzWPb7Wa60qdlZxjx6ooUuUqVQsK+y1VoAJyBeJAVsLJeYmg/RIXdG2kPhwYPBUQQyYF0XC8lwP3MTCrYAXB88556peCbUUZV7WccwkUQfCZC4PXdA5hKhSVhythZqjZM0J39w5m8BRadKAcrsIpNZsLIYdOqcZ9hExhZ1MH+QL+ciFzXzmYhZr/M6yUUwp2dp5U4naZDwAF5JRSefdScJZ3SkU0nl8xpaAy+7ml1EqvMXSs1HRrZ9bc3eZUSXmGa/mdyjbmqyX7A9RaYQa9IRJ0AAAAAElFTkSuQmCC');
    };
    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;
      Lampa.Controller.add("content", {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render()), Lampa.Controller.collectionFocus(last || !1, scroll.render());
        },
        left: function left() {
          Navigator.canmove("left") ? Navigator.move("left") : Lampa.Controller.toggle("menu");
        },
        right: function right() {
          Navigator.canmove("right") ? Navigator.move("right") : Lampa.Controller.toggle("content");
        },
        up: function up() {
          Navigator.canmove("up") ? Navigator.move("up") : Lampa.Controller.toggle("head");
        },
        down: function down() {
          Navigator.canmove("down") ? Navigator.move("down") : Lampa.Controller.toggle("content");
        },
        back: function back() {
          Lampa.Activity.backward();
        }
      });
      Lampa.Controller.toggle('content');
    };
    this.pause = function () {};
    this.stop = function () {};
    this.render = function () {
      return html;
    };
    this.destroy = function () {
      network.clear();

      //Lampa.Arrays.destroy(items)

      scroll.destroy();
      html.remove();
      network = null;
      videodata = null;
    };
  }

  function listview() {
    this.onEnter = function () {};
    this.onFocus = function () {};
    this.items = [];
    this.container = $('<div class="mediazonelinecontainer"></div>');
    this.createListview = function (data) {
      var _this = this;
      this.clear();
      data.items.forEach(function (item) {
        var line = $('<div class="mediazoneline selector">' + item.title + '</div>');
        _this.items.push(line);
        line.on('hover:enter', function () {
          _this.onEnter(item);
        });
        line.on("hover:focus", function () {
          _this.onFocus(line);
        });
        _this.container.append(line);
      });
    };
    this.clear = function () {
      this.items.forEach(function (element) {
        element.remove();
      });
      this.items = [];
    };
    this.destroy = function () {
      img.onerror = function () {};
      img.onload = function () {};
      this.clear();
    };
    this.render = function () {
      return this.container;
    };
  }

  function kinopubvideoobject() {
    this.videos = [];
    this.translators = [];
    this.getSesons = function () {
      var sesons = [];
      this.videos.forEach(function (element) {
        if (sesons.indexOf(element.data_season_id) < 0) {
          sesons.push(element.data_season_id);
        }
      });
      return sesons;
    };
    this.getTranslatorsData = function () {
      var data = {
        items: []
      };
      this.translators.forEach(function (element) {
        data.items.push({
          title: element.name,
          id: element.id
        });
      });
      return data;
    };
    this.sesonsCount = function () {
      return this.getSesons().length;
    };
    this.getSesonsData = function () {
      var data = {
        items: []
      };
      var sesons = [];
      this.videos.forEach(function (element) {
        if (sesons.indexOf(element.data_season_id) < 0) {
          sesons.push(element.data_season_id);
          data.items.push({
            title: 'Сезон ' + element.data_season_id,
            id: element.data_season_id
          });
        }
      });
      return data;
    };
    this.getSerienDataForSeson = function (sesonid) {
      var data = {
        items: []
      };
      this.videos.forEach(function (element) {
        if (sesonid == element.data_season_id) {
          data.items.push({
            title: element.title,
            id: element.data_episode_id
          });
        }
      });
      return data;
    };
    this.isFilmMode = function () {
      var result = false;
      this.videos.forEach(function (element) {
        if (element.streams != undefined && element.streams != "") {
          result = true;
        }
      });
      return result;
    };
  }

  function componentkinopubvideodetail(data) {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var active = 0;
    var videodata = data;
    this.toReplace = ['$$!!@$$@^!@#$$@', '@@@@@!##!^^^', '####^!!##!@@', '^^^!@##!!##', '$$#!!@#!@##'];
    this.fileseparator = '\\/\\/_\\/\\/';
    this.mode = 'seson';
    this.kinopubvideoobject = new kinopubvideoobject();
    this.listview = new listview();
    this.lastSelectedSeson = "1";
    this.create = function () {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + videodata.url, function (data) {
        _this.buildKinopubvideodetails(data);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text',
        headers: tools.getHeaders()
      });
      return this.render();
    };
    this.buildKinopubvideodetails = function (str) {
      var _this2 = this;
      str = str.replace(/\n/g, '');
      scroll.minus();
      html.append(scroll.render());
      var card = Lampa.Template.get("full_start_new");

      // Poster
      var img = card.find(".full--poster")[0];
      img.onerror = function (e) {};
      img.src = videodata.image;
      card.find(".full-start-new__poster").addClass('loaded');

      // Title
      card.find(".full-start-new__title").text(videodata.title);

      // Tagline
      card.find(".full-start-new__tagline").hide();

      // Description
      var description = str.match('<div class="b-post__description_text">(.*?)</div>');
      card.find(".full-start-new__details").text(description[1]);
      card.find(".button--play").addClass('hide');
      card.find(".button--reaction").addClass('hide');
      //card.find(".button--book").addClass('hide');

      // Rating
      card.find('.rate--tmdb').hide();
      var ratingImbd = str.match('<span class="b-post__info_rates imdb">.*?class="bold">(.*?)</span>');
      if (ratingImbd && ratingImbd.length > 1) {
        var ratingElement = card.find(".rate--imdb");
        if (ratingElement.children().length > 0) {
          ratingElement.children()[0].text(ratingImbd[1]);
          ratingElement.removeClass('hide');
        }
      }
      var ratingKP = str.match('<span class="b-post__info_rates kp">.*?class="bold">(.*?)</span>');
      if (ratingKP && ratingKP.length > 1) {
        var _ratingElement = card.find(".rate--kp");
        if (_ratingElement.children().length > 0) {
          _ratingElement.children()[0].text(ratingKP[1]);
          _ratingElement.removeClass('hide');
        }
      }
      scroll.append(card);
      this.kinopubvideoobject.videos = this.getVideos(str);
      this.kinopubvideoobject.translators = this.getTranslators(str);
      var data = this.kinopubvideoobject.getSesonsData();
      if (this.kinopubvideoobject.isFilmMode()) {
        this.kinopubvideoobject.videos.forEach(function (element) {
          data = _this2.getVideoDataLinksFromHash(element.streams, videodata.title);
        });
      }
      this.listview.createListview(data);
      this.listview.onEnter = function (item) {
        if (item.streamUrl != undefined && item.streamUrl != '') {
          var video = {
            title: item.title,
            url: item.streamUrl
          };
          //video['iptv'] = true;
          var playlist = [];
          playlist.push({
            title: item.title,
            url: item.streamUrl
          });
          video['playlist'] = playlist;
          Lampa.Player.play(video);
        } else {
          if (this.mode == 'seson') {
            this.mode = 'serien';
            var dataS = this.kinopubvideoobject.getSerienDataForSeson(item.id);
            this.listview.createListview(dataS);
            this.lastSelectedSeson = item.id;
          } else if (this.mode == 'serien') {
            this.mode = 'translator';
            var _dataS = this.kinopubvideoobject.getTranslatorsData();
            this.listview.createListview(_dataS);
          }
        }
      };
      this.listview.onFocus = function (line) {
        scroll.update(line, !0);
      };
      scroll.append(this.listview.render());
      this.activity.loader(false);
    };
    this.getVideoDataLinksFromHash = function (hash, title) {
      var _this3 = this;
      var hashWert = hash.substring(2, hash.length);
      this.toReplace.forEach(function (element) {
        hashWert = hashWert.replace(_this3.fileseparator + b1(element), "");
      });
      var linksString;
      try {
        linksString = b2(hashWert);
      } catch (e) {
        linksString = "";
      }
      var data = {
        items: []
      };
      linksString.split(',').forEach(function (element) {
        var quality = getQuality(element);
        var forReplace = '[' + quality + ']';
        var elementOhneQuality = element.replace(forReplace, '');
        elementOhneQuality.split(' or ').forEach(function (item) {
          var urlformat = item.indexOf('.m3u8') > 0 ? "m3u8" : "mp4";
          data.items.push({
            title: title + ' (' + quality + ', ' + urlformat + ')',
            streamUrl: item.replaceAll(' ', '')
          });
        });
      });
      return data;
    };
    function getQuality(inputStr) {
      var start = inputStr.indexOf('[');
      var end = inputStr.indexOf(']');
      return inputStr.substring(start + 1, end);
    }
    function b1(str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode("0x" + p1);
      }));
    }
    function b2(str) {
      return decodeURIComponent(atob(str).split("").map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    }
    this.getVideos = function (str) {
      var videos = [];
      var hasVideos = false;
      var containerArray = tools.matchAll(str, 'ul id="simple-episodes(.*?)</ul>');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          var _containerArray = tools.matchAll(elementContainer[0], '<li class.*?data-id="(.*?)".*?data-season_id="(.*?)".*?data-episode_id="(.*?)">(.*?)</li>');
          _containerArray.forEach(function (elementContainer) {
            if (elementContainer.length > 4) {
              videos.push({
                data_id: elementContainer[1],
                data_season_id: elementContainer[2],
                data_episode_id: elementContainer[3],
                title: elementContainer[4]
              });
            }
          });
          hasVideos = true;
        }
        return;
      });
      if (!hasVideos) {
        var _containerArray2 = tools.matchAll(str, '"streams".*?"(.*?)",');
        _containerArray2.forEach(function (elementContainer) {
          if (elementContainer.length > 0) {
            videos.push({
              streams: elementContainer[1],
              data_id: '0'
            });
          }
        });
      }
      return videos;
    };
    this.getTranslators = function (str) {
      var translators = [];
      var containerArray = tools.matchAll(str, 'initCDNSeriesEvents(.*?), false');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          var ar = elementContainer[1].split(',');
          if (ar.length > 1) {
            translators.push({
              id: ar[1],
              name: 'Translator'
            });
          }
        }
      });
      containerArray = tools.matchAll(str, '<div class="b-translators__block(.*?)b-post__wait_status');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          containerArray = tools.matchAll(elementContainer[0], '<ul id="translators-list" class="b-translators__list">(.*?)</ul>');
          containerArray.forEach(function (elementContainer) {
            if (elementContainer[1]) {
              containerArray = tools.matchAll(elementContainer[0], 'data-translator_id="(.*?)".*?>(.*?)</li>');
              containerArray.forEach(function (elementContainer) {
                if (elementContainer.length > 2) {
                  translators.push({
                    id: elementContainer[1],
                    name: elementContainer[2]
                  });
                }
              });
              return;
            }
          });
          return;
        }
      });
      return translators;
    };
    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;
      Lampa.Controller.add("content", {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render()), Lampa.Controller.collectionFocus(!1, scroll.render());
        },
        left: function left() {
          Navigator.canmove("left") ? Navigator.move("left") : Lampa.Controller.toggle("menu");
        },
        right: function right() {
          Navigator.canmove("right") ? Navigator.move("right") : Lampa.Controller.toggle("content");
        },
        up: function up() {
          Navigator.canmove("up") ? Navigator.move("up") : Lampa.Controller.toggle("head");
        },
        down: function down() {
          Navigator.canmove("down") ? Navigator.move("down") : Lampa.Controller.toggle("content");
        },
        back: function back() {
          if (this.mode == 'serien') {
            var dataS = this.kinopubvideoobject.getSesonsData();
            if (dataS.items.length > 1) {
              this.mode = 'seson';
              this.listview.createListview(dataS);
            } else {
              Lampa.Activity.backward();
            }
          } else if (this.mode == 'translator') {
            var _dataS2 = this.kinopubvideoobject.getSerienDataForSeson(this.lastSelectedSeson);
            if (_dataS2.items.length > 1) {
              this.mode = 'serien';
              this.listview.createListview(_dataS2);
            } else {
              Lampa.Activity.backward();
            }
          } else {
            Lampa.Activity.backward();
          }
        }
      });
      Lampa.Controller.toggle('content');
    };
    /*this.extractData = function (str) {
      let extract = {};
      extract.voice = [];
      extract.season = [];
      extract.episode = [];
      str = str.replace(/\n/g, '');
      let containerArray = matchAll(str, '<li class="b-topnav__item(.*?)</div>.*?</li>');
      containerArray.forEach(function (element) {
        let ebenetop = matchAll(element[0], '<a class="b-topnav__item.*? href="(.*?)">(.*?)<');
        ebenetop.forEach(function (item) {
          console.log(item);
        });
      });
      let voices = str.match('<select name="translator"[^>]+>(.*?)</select>');
      let sesons = str.match('<select name="season"[^>]+>(.*?)</select>');
      let episod = str.match('<select name="episode"[^>]+>(.*?)</select>');
      if (sesons) {
        let select = $('<select>' + sesons[1] + '</select>');
        $('option', select).each(function () {
          extract.season.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }
      if (voices) {
        let _select = $('<select>' + voices[1] + '</select>');
        $('option', _select).each(function () {
          let token = $(this).attr('data-token');
          if (token) {
            extract.voice.push({
              token: token,
              name: $(this).text(),
              id: $(this).val()
            });
          }
        });
      }
      if (episod) {
        let _select2 = $('<select>' + episod[1] + '</select>');
        $('option', _select2).each(function () {
          extract.episode.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }
    };*/
    this.back = function () {
      Lampa.Activity.backward();
    };
    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };
    this.up = function () {
      active--;
      if (active < 0) {
        active = 0;
        Lampa.Controller.toggle('head');
      } else {
        items[active].toggle();
      }
      scroll.update(items[active].render());
    };
    this.background = function () {
      Lampa.Background.immediately('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAZCAYAAABD2GxlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHASURBVHgBlZaLrsMgDENXxAf3/9XHFdXNZLm2YZHQymPk4CS0277v9+ffrut62nEcn/M8nzb69cxj6le1+75f/RqrZ9fatm3F9wwMR7yhawilNke4Gis/7j9srQbdaVFBnkcQ1WrfgmIIBcTrvgqqsKiTzvpOQbUnAykVW4VVqZXyyDllYFSKx9QaVrO7nGJIB63g+FAq/xhcHWBYdwCsmAtvFZUKE0MlVZWCT4idOlyhTp3K35R/6Nzlq0uBnsKWlEzgSh1VGJxv6rmpXMO7EK+XWUPnDFRWqitQFeY2UyZVryuWlI8ulLgGf19FooAUwC9gCWLcwzWPb7Wa60qdlZxjx6ooUuUqVQsK+y1VoAJyBeJAVsLJeYmg/RIXdG2kPhwYPBUQQyYF0XC8lwP3MTCrYAXB88556peCbUUZV7WccwkUQfCZC4PXdA5hKhSVhythZqjZM0J39w5m8BRadKAcrsIpNZsLIYdOqcZ9hExhZ1MH+QL+ciFzXzmYhZr/M6yUUwp2dp5U4naZDwAF5JRSefdScJZ3SkU0nl8xpaAy+7ml1EqvMXSs1HRrZ9bc3eZUSXmGa/mdyjbmqyX7A9RaYQa9IRJ0AAAAAElFTkSuQmCC');
    };
    this.pause = function () {};
    this.stop = function () {};
    this.render = function () {
      return html;
    };
    this.destroy = function () {
      network.clear();
      Lampa.Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      items = null;
      network = null;
    };
  }

  function initComponents() {
    Lampa.Component.add('kinopubcomponent', componentkinopub);
    Lampa.Component.add('kinopubvideos', component);
    Lampa.Component.add('kinopubvideodetail', componentkinopubvideodetail);
  }
  function componentkinopub() {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var URL = "https://kinopub.me/";
    var items = [];
    var html = $('<div></div>');
    var active = 0;
    this.create = function () {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + URL, function (str) {
        _this.buildKinopubStartSeite(str);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text',
        headers: tools.getHeaders()
      });
      return this.render();
    };
    this.buildKinopubStartSeite = function (str) {
      var _this2 = this;
      str = str.replace(/\n/g, '');
      var data = [];

      // Zufällige Bilder anzeigen
      var images = [];
      var containerArrayImages = tools.matchAll(str, '<img src="(.*?)"');
      containerArrayImages.forEach(function (element) {
        if (element[1].indexOf('templates') < 0) {
          images.push(element[1]);
        }
      });
      var containerArray = tools.matchAll(str, '<li class="b-topnav__item(.*?)</div>.*?</li>');
      containerArray.forEach(function (elementContainer) {
        var itemData = [];
        var ebenetop = tools.matchAll(elementContainer[0], '<a class="b-topnav__item.*? href="(.*?)">(.*?)<');
        var kategorie = "####";
        ebenetop.forEach(function (item) {
          kategorie = item[2];
          itemData.push({
            title: item[2],
            image: images[tools.getRandomIntInclusive(0, images.length)],
            url: URL + item[1],
            component: 'kinopubvideos'
          });
        });
        var subebeneright = tools.matchAll(elementContainer[0], '<a title="(.*?)" href="(.*?)">');
        subebeneright.forEach(function (item) {
          itemData.push({
            title: item[1],
            image: images[tools.getRandomIntInclusive(0, images.length)],
            url: URL + item[2].replace('rel="nofollow', '').replace(' ', ''),
            component: 'kinopubvideos'
          });
        });
        var subebeneleft = tools.matchAll(elementContainer[0], 'a href="(.*?)">(.*?)<');
        subebeneleft.forEach(function (item) {
          itemData.push({
            title: item[2],
            image: images[tools.getRandomIntInclusive(0, images.length)],
            url: URL + item[1].replace('rel="nofollow', '').replace(' ', ''),
            component: 'kinopubvideos'
          });
        });
        data.push({
          kategorie: kategorie,
          items: itemData
        });
      });
      scroll.minus();
      html.append(scroll.render());
      data.forEach(function (element) {
        _this2.append({
          title: element.kategorie,
          results: element.items
        });
      });
      this.activity.loader(false);
      this.activity.toggle();
    };
    this.append = function (element) {
      var item = new create(element);
      item.create();
      item.onDown = this.down.bind(this);
      item.onUp = this.up.bind(this);
      item.onBack = this.back.bind(this);
      scroll.append(item.render());
      items.push(item);
    };
    this.back = function () {
      Lampa.Activity.backward();
    };
    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };
    this.up = function () {
      active--;
      if (active < 0) {
        active = 0;
        Lampa.Controller.toggle('head');
      } else {
        items[active].toggle();
      }
      scroll.update(items[active].render());
    };
    this.background = function () {
      Lampa.Background.immediately('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAZCAYAAABD2GxlAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHASURBVHgBlZaLrsMgDENXxAf3/9XHFdXNZLm2YZHQymPk4CS0277v9+ffrut62nEcn/M8nzb69cxj6le1+75f/RqrZ9fatm3F9wwMR7yhawilNke4Gis/7j9srQbdaVFBnkcQ1WrfgmIIBcTrvgqqsKiTzvpOQbUnAykVW4VVqZXyyDllYFSKx9QaVrO7nGJIB63g+FAq/xhcHWBYdwCsmAtvFZUKE0MlVZWCT4idOlyhTp3K35R/6Nzlq0uBnsKWlEzgSh1VGJxv6rmpXMO7EK+XWUPnDFRWqitQFeY2UyZVryuWlI8ulLgGf19FooAUwC9gCWLcwzWPb7Wa60qdlZxjx6ooUuUqVQsK+y1VoAJyBeJAVsLJeYmg/RIXdG2kPhwYPBUQQyYF0XC8lwP3MTCrYAXB88556peCbUUZV7WccwkUQfCZC4PXdA5hKhSVhythZqjZM0J39w5m8BRadKAcrsIpNZsLIYdOqcZ9hExhZ1MH+QL+ciFzXzmYhZr/M6yUUwp2dp5U4naZDwAF5JRSefdScJZ3SkU0nl8xpaAy+7ml1EqvMXSs1HRrZ9bc3eZUSXmGa/mdyjbmqyX7A9RaYQa9IRJ0AAAAAElFTkSuQmCC');
    };
    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;
      this.background();
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        },
        back: this.back
      });
      Lampa.Controller.toggle('content');
    };
    this.pause = function () {};
    this.stop = function () {};
    this.render = function () {
      return html;
    };
    this.destroy = function () {
      network.clear();
      Lampa.Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      items = null;
      network = null;
    };
  }
  var kinopub = {
    componentkinopub: componentkinopub,
    initComponents: initComponents
  };

  function startPlugin() {
    window.view_plugin_ready = true;
    Lampa.Component.add('startcomponent', component$1);
    kinopub.initComponents();
    Templates.init();
    function addStartButton() {
      var button = $("<li class=\"menu__item selector\">\n            <div class=\"menu__ico\">\n                <svg height=\"44\" viewBox=\"0 0 44 44\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect width=\"21\" height=\"21\" rx=\"2\" fill=\"white\"></rect>\n                    <mask id=\"path-2-inside-1_154:24\" fill=\"white\">\n                    <rect x=\"2\" y=\"27\" width=\"17\" height=\"17\" rx=\"2\"></rect>\n                    </mask>\n                    <rect x=\"2\" y=\"27\" width=\"17\" height=\"17\" rx=\"2\" stroke=\"white\" stroke-width=\"6\" mask=\"url(#path-2-inside-1_154:24)\"></rect>\n                    <rect x=\"27\" y=\"2\" width=\"17\" height=\"17\" rx=\"2\" fill=\"white\"></rect>\n                    <rect x=\"27\" y=\"34\" width=\"17\" height=\"3\" fill=\"white\"></rect>\n                    <rect x=\"34\" y=\"44\" width=\"17\" height=\"3\" transform=\"rotate(-90 34 44)\" fill=\"white\"></rect>\n                </svg>\n            </div>\n            <div class=\"menu__text\">Mediazone</div>\n        </li>");
      button.on('hover:enter', function () {
        Lampa.Activity.push({
          url: '',
          title: 'Mediazone',
          component: 'startcomponent',
          page: 1
        });
      });
      $('.menu .menu__list').eq(0).append(button);
      $('body').append(Lampa.Template.get('mediazone_style', {}, true));
    }
    if (window.appready) addStartButton();else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') addStartButton();
      });
    }
  }
  if (!window.view_plugin_ready) startPlugin();

})();