(function () {
  'use strict';

  function item(data) {
    var item = Lampa.Template.get(data.start == true ? 'mediazone_item-start' : 'mediazone_item', {
      name: data.title
    });
    var img = item.find('img')[0];
    if (data.svg != undefined) {
      item.find('img').hide();
      item.find('img').parent().append($(data.svg));
      item.find('img').parent().addClass('favdivstart');
    }
    img.onerror = function () {
      img.src = './img/img_broken.svg';
    };
    img.src = data.image;
    this.url = data.url;
    this.title = data.title;
    this.parser = data.parser;
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
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
    var start = params.start;
    this.create = function () {
      scroll.render().find('.scroll__body').addClass('mediazone-itemlist-center');
      content.find('.items-line__title').text(data.title);
      data.results.forEach(this.appendItem.bind(this));
      body.append(scroll.render());
    };
    this.appendItem = function (element) {
      element.start = start;
      var item$1 = new item(element);
      item$1.render().on('hover:focus', function () {
        last = item$1.render()[0];
        active = items.indexOf(item$1);
        scroll.update(items[active].render(), true);
      }).on('hover:enter', function () {
        Lampa.Activity.push({
          url: item$1.url,
          urlWithOutPage: item$1.url,
          title: item$1.title,
          parser: item$1.parser,
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

  function component$4() {
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
      title: 'Kinotik',
      component: 'kinotikcomponent',
      url: 'https://kinotik.bid/',
      image: 'https://kinotik.bid/style/web/logo.png'
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
      this.build();
      return this.render();
    };
    this.build = function () {
      scroll.minus();
      html.append(scroll.render());
      this.append({
        title: "Kino",
        results: sites
      });
      this.activity.loader(false);
      this.activity.toggle();
    };
    this.append = function (element) {
      element.start = true;
      var item = new create(element, {
        start: true
      });
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

  function init$1() {
    Lampa.Template.add('mediazone_item', "<div class=\"selector mediazone-item\">\n        <div class=\"mediazone-item__imgbox\">\n            <img class=\"mediazone-item__img\" />\n        </div>\n\n        <div class=\"mediazone-item__name\">{name}</div>\n    </div>");
    Lampa.Template.add('mediazone_item-start', "<div class=\"selector mediazone-item-start\">\n      <div class=\"mediazone-item__imgbox-start\">\n          <img class=\"mediazone-item__img-start\" />\n      </div>\n\n      <div class=\"mediazone-item__name-start\">{name}</div>\n    </div>");
    Lampa.Template.add('mediazone_style', "<style> \n        .mediazoneline.focus {\n          background-color: #fff;\n          color: #000;\n          border-radius: 0.33em;\n          padding: 0.3em 1em;\n        }\n        .mediazonelinecontainer{\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          width: 50em;\n        }\n        .mediazoneline{\n          padding-top: 0.3em;\n          font-size: 1.3em;\n        }\n        .mediazone-item-start {\n          width: 10em;\n          height: 10em;\n          margin-right: 1em;\n        }\n        .mediazone-item__imgbox-start{\n          background-color: #3E3E3E;\n          height: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: space-around;\n        }\n        .mediazone-item__name-start{\n          display: flex;\n          margin-top: 1em;\n          align-items: center;\n          justify-content: center;\n        }\n        .mediazone-item__img-start{\n          max-width: 93% !important;\n        }\n        .mediazone-item-start.focus {\n            border: solid 0.26em #fff;\n            content: \"\";\n            display: block;\n            left: -0.5em;\n            top:  -0.5em;\n            right:  -0.5em;\n            bottom:  -1.5em;\n            -webkit-border-radius: 0.8em;\n               -moz-border-radius: 0.8em;\n                    border-radius: 0.8em;\n          }\n        .mediazone-item {\n            width: 10em;\n            -webkit-flex-shrink: 0;\n                -ms-flex-negative: 0;\n                    flex-shrink: 0;\n          }\n          .mediazone-item__imgbox {\n            background-color: #3E3E3E;\n            padding-bottom: 150%;\n            position: relative;\n            -webkit-border-radius: 0.3em;\n               -moz-border-radius: 0.3em;\n                    border-radius: 0.3em;\n          }\n          .mediazone-item__img {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          }\n          .mediazone-item__name {\n            font-size: 1.1em;\n            margin-bottom: 0.8em;\n          }\n          .mediazone-item.focus .mediazone-item__imgbox:after {\n            border: solid 0.26em #fff;\n            content: \"\";\n            display: block;\n            position: absolute;\n            left: -0.5em;\n            top:  -0.5em;\n            right:  -0.5em;\n            bottom:  -1.5em;\n            -webkit-border-radius: 0.8em;\n               -moz-border-radius: 0.8em;\n                    border-radius: 0.8em;\n          }\n          .mediazone-item + .mediazone-item {\n            margin-left: 1em;\n          }      \n                    \n          .mediazone-itemlist-center{\n            display: flex;\n            flex-direction: row;\n          }\n\n          .pagebuttons{\n            display: flex;\n            padding: 2em 0em 2em 0em;\n            justify-content: space-evenly;\n            font-size: larger;\n          }\n\n          .pagebutton{\n            display: flex;\n            align-items: flex-end;\n            margin-left: 1em;\n          }\n\n          .pagebutton.focus {\n            background-color: #fff;\n            color: #000;\n            border-radius: 0.33em;\n            padding: 0.3em 1em;\n          }\n\n          .pagebutton.selected {\n            background-color: #fff;\n            color: #000;\n            border-radius: 0.33em;\n            padding: 0.3em 1em;\n          }\n          .favexist{\n            background-color: #fff;\n            color: #000;\n          }\n            \n          .favdiv{\n            height: 23px;\n            display: flex;\n            justify-content: flex-start;\n          }\n\n          .favdivstart{\n            padding-bottom: 15% !important;\n          }\n          \n        </style>");
  }
  var Templates = {
    init: init$1
  };

  function init() {
    Lampa.Params.select('proxy_mediazone_url', '', '');
    Lampa.Params.select('proxy_mediazone_key', '', '');
    Lampa.Params.select('favorites_mediazone_url', '', '');
    Lampa.Params.select('favorites_mediazone_key', '', '');
    Lampa.Template.add('settings_proxy', "<div>\n        <div class=\"settings-param selector\" data-type=\"input\" data-name=\"proxy_mediazone_url\" placeholder=\"Proxy\">\n            <div class=\"settings-param__name\">Proxy url</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n    \n        <div class=\"settings-param selector\" data-type=\"input\" data-name=\"proxy_mediazone_key\" placeholder=\"Key\">\n            <div class=\"settings-param__name\">Proxy key</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n\n        <div class=\"settings-param selector\" data-type=\"input\" data-name=\"favorites_mediazone_url\" placeholder=\"Proxy\">\n            <div class=\"settings-param__name\">Favorites server url</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n    \n        <div class=\"settings-param selector\" data-type=\"input\" data-name=\"favorites_mediazone_key\" placeholder=\"Key\">\n            <div class=\"settings-param__name\">Favorites server key</div>\n            <div class=\"settings-param__value\"></div>\n        </div>\n    </div>");
  }
  function addSettingsProxy() {
    if (Lampa.Settings.main && !Lampa.Settings.main().render().find('[data-component="proxy"]').length) {
      var field = $(Lampa.Lang.translate("<div class=\"settings-folder selector\" data-component=\"proxy\">\n            <div class=\"settings-folder__icon\">\n                <svg height=\"36\" viewBox=\"0 0 38 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"2\" y=\"8\" width=\"34\" height=\"21\" rx=\"3\" stroke=\"white\" stroke-width=\"3\"/>\n                    <line x1=\"13.0925\" y1=\"2.34874\" x2=\"16.3487\" y2=\"6.90754\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n                    <line x1=\"1.5\" y1=\"-1.5\" x2=\"9.31665\" y2=\"-1.5\" transform=\"matrix(-0.757816 0.652468 0.652468 0.757816 26.197 2)\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n                    <line x1=\"9.5\" y1=\"34.5\" x2=\"29.5\" y2=\"34.5\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n                </svg>\n            </div>\n            <div class=\"settings-folder__name\">Mediazone</div>\n        </div>"));
      Lampa.Settings.main().render().find('[data-component="more"]').after(field);
      Lampa.Settings.main().update();
    }
  }
  var Settings = {
    init: init,
    addSettingsProxy: addSettingsProxy
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
    var proxy = Lampa.Storage.get('proxy_mediazone_url') + '/getData/';
    //proxy = "http://localhost:4343/getData/";
    return proxy;
  });
  _defineProperty(tools, "getHeaders", function () {
    return {
      "x-api-key": Lampa.Storage.get('proxy_mediazone_key')
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
  _defineProperty(tools, "log", function (value) {
    var prefix = "Mediazone";
    console.log(prefix + ': ' + value);
  });

  function getServerUrl() {
    //return "http://localhost:4343/";
    return Lampa.Storage.get('favorites_mediazone_url');
  }
  function getHeaders() {
    return {
      "x-api-key": Lampa.Storage.get('favorites_mediazone_key')
    };
  }
  function setFavorites(data) {
    var defer = $.Deferred();
    var network = new Lampa.Reguest();
    var url = getServerUrl();
    if (url) {
      var account = JSON.parse(window.localStorage.getItem('account'));
      account.id;
      var obj = {
        parser: data.parser,
        accountid: account.id,
        url: data.url,
        title: data.title,
        image: data.image,
        component: data.component
      };
      network.clear();
      network["native"](getServerUrl() + "/setFavorites", function (data) {
        defer.resolve(data);
      }, function (a, c) {
        defer.reject(a);
        tools.log("Error setFavorites");
      }, JSON.stringify(obj, null, 2), {
        dataType: 'text',
        headers: getHeaders()
      });
    } else {
      defer.resolve(undefined);
    }
    return defer;
  }
  function getFavorites(parser) {
    var defer = $.Deferred();
    var network = new Lampa.Reguest();
    var account = JSON.parse(window.localStorage.getItem('account'));
    var url = getServerUrl();
    if (url) {
      network.clear();
      network["native"](url + "/getFavorites/", function (data) {
        if (data && data != '') {
          try {
            defer.resolve(JSON.parse(data));
          } catch (_unused) {
            tools.log("Error getFavorites (JSON.parse(data)):" + data);
          }
        } else {
          defer.resolve(undefined);
        }
      }, function (a, c) {
        tools.log("Error getFavorites");
      }, JSON.stringify({
        accountid: account.id,
        parser: parser
      }, null, 2), {
        dataType: 'text',
        headers: getHeaders()
      });
    } else {
      defer.resolve(undefined);
    }
    return defer;
  }
  function isInFavorites(parser, favurl) {
    var defer = $.Deferred();
    var network = new Lampa.Reguest();
    var url = getServerUrl();
    if (url) {
      var account = JSON.parse(window.localStorage.getItem('account'));
      network.clear();
      network["native"](getServerUrl() + "/isInFavorites/", function (data) {
        if (data && data != '') {
          try {
            defer.resolve(JSON.parse(data));
          } catch (_unused2) {
            defer.reject(data);
            tools.log("Error isInFavorites (JSON.parse(data)):" + data);
          }
        }
      }, function (a, c) {
        tools.log("Error isInFavorites");
      }, JSON.stringify({
        accountid: account.id,
        parser: parser,
        favurl: favurl
      }, null, 2), {
        dataType: 'text',
        headers: getHeaders()
      });
    } else {
      defer.resolve(undefined);
    }
    return defer;
  }
  function removeFavorites(parser, id) {
    var defer = $.Deferred();
    var network = new Lampa.Reguest();
    var url = getServerUrl();
    if (url) {
      var account = JSON.parse(window.localStorage.getItem('account'));
      network.clear();
      network["native"](getServerUrl() + "/removeFavorites/", function (data) {
        if (data && data != '') {
          try {
            defer.resolve(data);
          } catch (_unused3) {
            defer.reject(data);
            tools.log("Error removeFavorites (JSON.parse(data)):" + data);
          }
        }
      }, function (a, c) {
        tools.log("Error removeFavorites");
      }, JSON.stringify({
        accountid: account.id,
        parser: parser,
        id: id
      }, null, 2), {
        dataType: 'text',
        headers: getHeaders()
      });
    } else {
      defer.resolve(undefined);
    }
    return defer;
  }
  var favorites = {
    setFavorites: setFavorites,
    getFavorites: getFavorites,
    isInFavorites: isInFavorites,
    removeFavorites: removeFavorites
  };

  function component$3(data) {
    var videodata = data;
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
      favorites.getFavorites(videodata.parser).then(function (favs) {
        tools.log(favs);
        if (favs) {
          _this.extractDataKinopubvideos(favs);
        } else {
          var empty = new Lampa.Empty();
          html.append(empty.render());
          _this.start = empty.start;
          _this.activity.loader(false);
          _this.activity.toggle();
        }
      }).fail(function (error) {
        tools.log(error);
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      });
      return this.render();
    };
    this.extractDataKinopubvideos = function (favs) {
      scroll.minus();
      html.append(scroll.render());
      if (favs != undefined && Array.isArray(favs.favs) && favs.favs.length > 0) {
        favs.favs.forEach(function (element) {
          var card = Lampa.Template.get("card", {
            title: element.title,
            release_year: ""
          });
          var img = card.find(".card__img")[0];
          img.onload = function () {
            card.addClass("card--loaded");
          };
          img.onerror = function (e) {};
          img.src = element.image;
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
              title: element.title,
              image: element.image
            });
          });
          body.append(card);
        });
      } else {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        this.start = empty.start;
        this.activity.loader(false);
        this.activity.toggle();
      }
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
      scroll.destroy();
      html.remove();
      videodata = null;
    };
  }

  function component$2(data) {
    var videodata = data;
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var pagebuttons = $('<div class="pagebuttons"></div>');
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
      this.buildPager(str);
      this.activity.loader(false);
    };
    this.buildPager = function (str) {
      this.initTotalPages(str);
      var selectedPage = parseInt(videodata.page);
      var leftDot = false;
      var rigthDot = false;
      if (selectedPage > 1) {
        pagebuttons.append(this.createPageButton(selectedPage - 1, '<<'));
      }
      for (var i = 1; i <= videodata.totalPages; i++) {
        if (i > 1 && selectedPage - i > 4) {
          if (leftDot == false) {
            pagebuttons.append($('<div class="pagebutton">...</div>'));
            leftDot = true;
          }
        } else if (i != videodata.totalPages && i > 1 && i - selectedPage > 4) {
          if (rigthDot == false) {
            rigthDot = true;
            pagebuttons.append($('<div class="pagebutton">...</div>'));
          }
        } else {
          var button = this.createPageButton(i, i);
          if (i == selectedPage) {
            button.addClass("selected");
          }
          pagebuttons.append(button);
        }
      }
      if (selectedPage < videodata.totalPages) {
        pagebuttons.append(this.createPageButton(selectedPage + 1, '>>'));
      }
      scroll.append(pagebuttons);
    };
    this.initTotalPages = function (str) {
      if (videodata.totalPages == undefined) {
        var containerArrayt = tools.matchAll(str, 'class="b-navigation"(.*?)class="b-navigation__next');
        if (Array.isArray(containerArrayt)) {
          containerArrayt.forEach(function (element) {
            var test = element[1];
            var alle = tools.matchAll(test, '<a href=.*?>(.*?)</a>');
            if (Array.isArray(alle) && alle.length > 0) {
              var _test = alle[alle.length - 1];
              if (_test && Array.isArray(_test) && _test.length > 1) {
                videodata.totalPages = parseInt(_test[1]);
                return;
              }
            }
          });
        }
      }
      videodata.totalPages = videodata.totalPages == undefined ? 1 : videodata.totalPages;
    };
    this.createPageButton = function (page, buttontext) {
      var _this2 = this;
      var button = $('<div class="pagebutton selector">' + buttontext + '</div>');
      button.on("hover:focus", function () {
        scroll.update(button, !0);
      });
      button.on('hover:enter', function () {
        return _this2.goPage(page);
      });
      return button;
    };
    this.goPage = function (page) {
      var url = page > 1 ? videodata.urlWithOutPage + '/page/' + page + '/' : videodata.urlWithOutPage;
      Lampa.Activity.push({
        url: url,
        title: videodata.title,
        component: videodata.component,
        urlWithOutPage: videodata.urlWithOutPage,
        page: page,
        totalPages: videodata.totalPages
      });
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
    this.getTranslatorsData = function (additionalData) {
      var data = {
        items: []
      };
      this.translators.forEach(function (element) {
        data.items.push({
          title: element.name,
          translation_id: element.id,
          data_season_id: additionalData.data_season_id,
          episode_title: additionalData.title,
          data_episode_id: additionalData.data_episode_id,
          data_id: element.data_id == undefined ? additionalData.data_id : element.data_id
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
            data_season_id: element.data_season_id,
            data_id: element.data_id
          });
        }
      });
      return data;
    };
    this.getSerienDataForSeson = function (sesondata) {
      var data = {
        items: []
      };
      this.videos.forEach(function (element) {
        if (sesondata.data_season_id == element.data_season_id) {
          data.items.push({
            title: element.title,
            data_episode_id: element.data_episode_id,
            data_season_id: sesondata.data_season_id,
            data_id: element.data_id
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
    this.lastSelectedEpisode = "1";
    this.lastSelectedListItem;
    this.selectedItemsHistorie = [];
    this.favobj = {
      exist: false,
      id: undefined
    };
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
      card.find(".full-start-new__reactions").hide();

      // Description
      var description = str.match('<div class="b-post__description_text">(.*?)</div>');
      card.find(".full-start-new__details").text(description[1]);
      card.find(".button--play").addClass('hide');
      card.find(".button--reaction").addClass('hide');

      // Favoriten
      var favbutton = card.find(".button--book");
      favbutton.on('hover:enter', function () {
        videodata.parser = 'kinopub';
        if (_this2.favobj.favexist == true) {
          favorites.removeFavorites('kinopub', _this2.favobj.id).then(function (data) {
            if (data == 'Success') {
              favbutton.removeClass('favexist');
              _this2.favobj.favexist = false;
            }
          });
        } else {
          favorites.setFavorites(videodata).then(function (data) {
            var json = JSON.parse(data);
            if (json.success == true) {
              favbutton.addClass('favexist');
              _this2.favobj.favexist = true;
              _this2.favobj.id = json.fav.id;
            }
          });
        }
      });
      favorites.isInFavorites('kinopub', videodata.url).then(function (data) {
        tools.log(data);
        if (data) {
          _this2.favobj = data;
          if (_this2.favobj.favexist == true) {
            favbutton.addClass('favexist');
          }
        }
      });

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
        data = this.kinopubvideoobject.getTranslatorsData({});
        this.mode = 'translator';
        if (Array.isArray(data.items) && data.items.length == 1) {
          this.getStreamUrlsAndRefreshListview(data.items[0]);
        } else {
          this.listview.createListview(data);
        }
      } else {
        this.listview.createListview(data);
      }
      this.listview.onEnter = function (item) {
        _this2.selectedItemsHistorie.push(item);
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
          if (_this2.mode == 'seson') {
            _this2.mode = 'serien';
            var dataS = _this2.kinopubvideoobject.getSerienDataForSeson(item);
            _this2.listview.createListview(dataS);
          } else if (_this2.mode == 'serien') {
            _this2.mode = 'translator';
            var _data = _this2.kinopubvideoobject.getTranslatorsData(item);
            if (Array.isArray(_data.items) && _data.items.length == 1) {
              _this2.listview.onEnter(_data.items[0]);
            } else {
              _this2.listview.createListview(_data);
            }
          } else if (_this2.mode == 'translator') {
            _this2.getStreamUrlsAndRefreshListview(item);
          }
        }
      };
      this.listview.onFocus = function (line) {
        scroll.update(line, !0);
      };
      scroll.append(this.listview.render());
      this.activity.loader(false);
    };
    this.handleHaswert = function (data) {
      this.activity.loader(false);
      var url;
      var temp = data.match('"url":"(.*?)",');
      if (Array.isArray(temp) && temp.length > 1) {
        url = temp[1];
        var dataS = this.getVideoDataLinksFromHash(url, videodata.title);
        this.listview.createListview(dataS);
      } else {
        this.listview.clear();
        var empty = new Lampa.Empty();
        html.append(empty.render());
        this.start = empty.start;
      }
    };
    this.getStreamUrlsAndRefreshListview = function (item) {
      var _this3 = this;
      this.mode = 'streams';
      var url = "https://kinopub.me/ajax/get_cdn_series/?t=" + Date.now();
      var post_data = {
        "id": item.data_id,
        "translator_id": item.translation_id,
        "season": item.data_season_id,
        "episode": item.data_episode_id,
        "action": this.kinopubvideoobject.isFilmMode() ? 'get_movie' : 'get_stream'
      };
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + url, function (data) {
        _this3.handleHaswert(data);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this3.start = empty.start;
        _this3.activity.loader(false);
        _this3.activity.toggle();
      }, post_data, {
        dataType: 'text',
        headers: tools.getHeaders()
      });
    };
    this.getVideoDataLinksFromHash = function (hash, title) {
      var _this4 = this;
      var hashWert = hash.substring(2, hash.length);
      this.toReplace.forEach(function (element) {
        hashWert = hashWert.replace(_this4.fileseparator + b1(element), "");
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
              name: 'Translator',
              data_id: ar[0].replace('(', '')
            });
          }
        }
      });
      containerArray = tools.matchAll(str, 'initCDNMoviesEvents(.*?), false');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          var ar = elementContainer[1].split(',');
          if (ar.length > 1) {
            translators.push({
              id: ar[1],
              name: 'Translator',
              data_id: ar[0].replace('(', '')
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
              containerArray = tools.matchAll(elementContainer[0], 'data-id="(.*?)".*?data-translator_id="(.*?)".*?>(.*?)</li>');
              containerArray.forEach(function (elementContainer) {
                if (elementContainer.length > 2) {
                  translators.push({
                    data_id: elementContainer[1],
                    id: elementContainer[2],
                    name: elementContainer[3]
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
      var _this5 = this;
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
          if (_this5.mode == 'serien') {
            var _data2 = _this5.kinopubvideoobject.getSesonsData();
            _this5.selectedItemsHistorie.pop();
            if (_data2.items.length > 1) {
              _this5.mode = 'seson';
              _this5.listview.createListview(_data2);
            } else {
              Lampa.Activity.backward();
            }
          } else if (_this5.mode == 'translator') {
            if (_this5.kinopubvideoobject.isFilmMode()) {
              Lampa.Activity.backward();
            } else {
              var _data3 = _this5.kinopubvideoobject.getSerienDataForSeson(_this5.selectedItemsHistorie.pop());
              _this5.mode = 'serien';
              _this5.listview.createListview(_data3);
            }
          } else if (_this5.mode == 'streams') {
            if (_this5.kinopubvideoobject.isFilmMode()) {
              Lampa.Activity.backward();
              return;
            }
            var _data4 = _this5.kinopubvideoobject.getTranslatorsData(_this5.selectedItemsHistorie.pop());
            if (Array.isArray(_data4.items) && _data4.items.length == 1) {
              var _data5 = _this5.kinopubvideoobject.getSerienDataForSeson(_this5.selectedItemsHistorie.pop());
              _this5.mode = 'serien';
              _this5.listview.createListview(_data5);
            } else {
              _this5.mode = 'translator';
              _this5.listview.createListview(_data4);
            }
          } else {
            Lampa.Activity.backward();
          }
        }
      });
      Lampa.Controller.toggle('content');
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

  function initComponents$1() {
    Lampa.Component.add('kinopubcomponent', componentkinopub);
    Lampa.Component.add('kinopubvideos', component$2);
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
      data.push({
        kategorie: 'Favorite',
        items: [{
          title: '',
          image: '',
          svg: '<div><svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6162 7.10981L15.8464 7.55198L16.3381 7.63428L22.2841 8.62965C22.8678 8.72736 23.0999 9.44167 22.6851 9.86381L18.4598 14.1641L18.1104 14.5196L18.184 15.0127L19.0748 20.9752C19.1622 21.5606 18.5546 22.002 18.025 21.738L12.6295 19.0483L12.1833 18.8259L11.7372 19.0483L6.34171 21.738C5.81206 22.002 5.20443 21.5606 5.29187 20.9752L6.18264 15.0127L6.25629 14.5196L5.9069 14.1641L1.68155 9.86381C1.26677 9.44167 1.49886 8.72736 2.08255 8.62965L8.02855 7.63428L8.52022 7.55198L8.75043 7.10981L11.5345 1.76241C11.8078 1.23748 12.5589 1.23748 12.8322 1.76241L15.6162 7.10981Z" stroke="currentColor" stroke-width="2.2"></path></svg></div>',
          url: '',
          parser: 'kinopub',
          component: 'mediazonefavorite'
        }]
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
    initComponents: initComponents$1
  };

  function component$1(data) {
    var videodata = data;
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var pagebuttons = $('<div class="pagebuttons"></div>');
    var last = null;
    this.create = function (data) {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + videodata.url, function (data) {
        _this.extractDataKinotikvideos(data);
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
    this.extractDataKinotikvideos = function (str) {
      scroll.minus();
      html.append(scroll.render());
      var data = [];
      var videostr = str;
      var index = str.indexOf('<div class="p_t">');
      if (index > -1) {
        videostr = videostr.substring(index);
        index = videostr.indexOf('</div>');
        if (index > -1) {
          videostr = videostr.substring(index);
        }
      }
      var containerArray = tools.matchAll(videostr, '<a href="(.*?)".*?<img.*?src="(.*?)">.*?p_title_film.*?">(.*?)</span>');
      containerArray.forEach(function (elementContainer) {
        data.push({
          titel: elementContainer[3],
          url: elementContainer[1],
          img: elementContainer[2]
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
            component: 'kinotikvideodetail',
            title: element.titel,
            image: element.img
          });
        });
        body.append(card);
      });
      scroll.append(body);
      this.buildPager(str);
      this.activity.loader(false);
    };
    this.buildPager = function (str) {
      this.initTotalPages(str);
      var selectedPage = parseInt(videodata.page);
      var leftDot = false;
      var rigthDot = false;
      if (selectedPage > 1) {
        pagebuttons.append(this.createPageButton(selectedPage - 1, '<<'));
      }
      for (var i = 1; i <= videodata.totalPages; i++) {
        if (i > 1 && selectedPage - i > 4) {
          if (leftDot == false) {
            pagebuttons.append($('<div class="pagebutton">...</div>'));
            leftDot = true;
          }
        } else if (i != videodata.totalPages && i > 1 && i - selectedPage > 4) {
          if (rigthDot == false) {
            rigthDot = true;
            pagebuttons.append($('<div class="pagebutton">...</div>'));
          }
        } else {
          var button = this.createPageButton(i, i);
          if (i == selectedPage) {
            button.addClass("selected");
          }
          pagebuttons.append(button);
        }
      }
      if (selectedPage < videodata.totalPages) {
        pagebuttons.append(this.createPageButton(selectedPage + 1, '>>'));
      }
      scroll.append(pagebuttons);
    };
    this.initTotalPages = function (str) {
      if (videodata.totalPages == undefined) {
        var containerArrayt = tools.matchAll(str, 'pages-numbers(.*?)</div>');
        if (Array.isArray(containerArrayt)) {
          containerArrayt.forEach(function (element) {
            var test = element[1];
            var alle = tools.matchAll(test, '<a href=.*?>(.*?)</a>');
            if (Array.isArray(alle) && alle.length > 0) {
              var _test = alle[alle.length - 1];
              if (_test && Array.isArray(_test) && _test.length > 1) {
                videodata.totalPages = parseInt(_test[1]);
                return;
              }
            }
          });
        }
      }
      videodata.totalPages = videodata.totalPages == undefined ? 1 : videodata.totalPages;
    };
    this.createPageButton = function (page, buttontext) {
      var _this2 = this;
      var button = $('<div class="pagebutton selector">' + buttontext + '</div>');
      button.on("hover:focus", function () {
        scroll.update(button, !0);
      });
      button.on('hover:enter', function () {
        return _this2.goPage(page);
      });
      return button;
    };
    this.goPage = function (page) {
      var url = page > 1 ? videodata.urlWithOutPage + '?p=' + page + '/' : videodata.urlWithOutPage;
      Lampa.Activity.push({
        url: url,
        title: videodata.title,
        component: videodata.component,
        urlWithOutPage: videodata.urlWithOutPage,
        page: page,
        totalPages: videodata.totalPages
      });
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

  function component(data) {
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
    this.mode = 'player';
    this.players;
    //this.kinopubvideoobject = new kinopubvideoobject();
    this.listview = new listview();
    this.lastSelectedSeson = "1";
    this.lastSelectedEpisode = "1";
    this.lastSelectedListItem;
    this.selectedItemsHistorie = [];
    this.favobj = {
      exist: false,
      id: undefined
    };
    this.prepareUrl = function (url) {
      //https://vip7.kinotik11.xyz/kino/pleer_serial.php?url&title=Игра в кальмара&year=2021&kp=1301710&kod=266637&pleer=1&del_off&nazad=http://kinotik.bid//kino_vip/serial.php
      var splited = url.split('&');
      var newUrl = '';
      splited.forEach(function (element) {
        if (element.indexOf('title') < 0) {
          newUrl = newUrl + element + '&';
        }
      });
      return newUrl;
    };
    this.create = function () {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + this.prepareUrl(videodata.url), function (data) {
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
      card.find(".full-start-new__reactions").hide();

      // Description
      var description = str.match('<p itemprop="articleBody">(.*?)</p>');
      card.find(".full-start-new__details").text(description[1]);
      card.find(".button--play").addClass('hide');
      card.find(".button--reaction").addClass('hide');

      // Favoriten
      var favbutton = card.find(".button--book");
      favbutton.on('hover:enter', function () {
        videodata.parser = 'kinotik';
        if (_this2.favobj.favexist == true) {
          favorites.removeFavorites('kinotik', _this2.favobj.id).then(function (data) {
            if (data == 'Success') {
              favbutton.removeClass('favexist');
              _this2.favobj.favexist = false;
            }
          });
        } else {
          favorites.setFavorites(videodata).then(function (data) {
            var json = JSON.parse(data);
            if (json.success == true) {
              favbutton.addClass('favexist');
              _this2.favobj.favexist = true;
              _this2.favobj.id = json.fav.id;
            }
          });
        }
      });
      favorites.isInFavorites('kinotik', videodata.url).then(function (data) {
        tools.log(data);
        if (data) {
          _this2.favobj = data;
          if (_this2.favobj.favexist == true) {
            favbutton.addClass('favexist');
          }
        }
      });

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
      this.getPlayers(str).then(function (players) {
        _this2.players = players;
        _this2.listview.createListview(_this2.players);
        _this2.listview.onEnter = function (item) {
          _this2.selectedItemsHistorie.push(item);
          if (item.streamUrl != undefined && item.streamUrl != '') {
            item.streamUrl = 'https://mediaaly.pro/tvseries/9f0209f2b0bceaeb70a815fc0b08d0c4a4bca54b/1d22572953fa6a00f953660cf7bfab23:2025010720/hls.m3u8';
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
            if (_this2.mode == 'player') {
              _this2.mode = 'serien';
              _this2.activity.loader(true);
              _this2.getVideoUrls(item.url).then(function (urls) {
                if (urls) {
                  _this2.listview.createListview(urls);
                } else {
                  _this2.listview.clear();
                  var empty = new Lampa.Empty();
                  html.append(empty.render());
                  _this2.start = empty.start;
                  _this2.activity.toggle();
                }
                _this2.activity.loader(false);
              }).fail(function (error) {
                _this2.activity.loader(false);
              });
            }
          }
        };
        _this2.listview.onFocus = function (line) {
          scroll.update(line, !0);
        };
        scroll.append(_this2.listview.render());
        _this2.activity.loader(false);
      }).fail(function () {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this2.start = empty.start;
        _this2.activity.loader(false);
        _this2.activity.toggle();
      });
    };
    this.getVideoUrls = function (url) {
      var defer = $.Deferred();
      network.clear();
      network["native"](tools.getProxy() + this.prepareUrl(url), function (data) {
        if (url.indexOf('api.emb') >= 0) {
          var index = data.indexOf('makePlayer({');
          if (index >= 0) {
            data = data.substring(index);
            index = data.indexOf('playlist');
            data = data.substring(index + 9, data.indexOf('qualityByWidth') - 10);
            index = data.indexOf('seasons:');
            if (index >= 0) {
              data = data.substring(index + 8);
            }
          }
          var result = {
            items: []
          };
          var jsonData = JSON.parse(data);
          if (jsonData && Array.isArray(jsonData)) {
            jsonData.forEach(function (element) {
              if (element.episodes && Array.isArray(element.episodes)) {
                element.episodes.forEach(function (item) {
                  result.items.push({
                    title: item.title,
                    streamUrl: item.hls
                  });
                });
              }
            });
          }
          defer.resolve(result.items.length == 0 ? undefined : result);
        } else {
          defer.resolve(undefined);
        }
      }, function (a, c) {
        defer.reject(a);
        tools.log("Error getPlayers");
      }, false, {
        dataType: 'text',
        headers: tools.getHeaders()
      });
      return defer;
    };
    this.getPlayers = function (str) {
      var defer = $.Deferred();
      var playerUrl = str.match('id="player".*?src="(.*?)"');
      if (playerUrl && Array.isArray(playerUrl) && playerUrl.length > 1) {
        network.clear();
        network["native"](tools.getProxy() + this.prepareUrl(playerUrl[1]), function (data) {
          var players = tools.matchAll(data, '<iframe class="iframe-movie2.*?src="(.*?)"');
          var items = [];
          var index = 1;
          players.forEach(function (element) {
            var url = element[1].indexOf('http') < 0 ? 'https://vip.kinobadi.mom/' + element[1] : element[1];
            items.push({
              player: index,
              title: 'Player ' + index + ' (' + url.substring(0, 40) + ')',
              url: url
            });
            index++;
          });
          defer.resolve({
            items: items
          });
        }, function (a, c) {
          defer.reject(a);
          tools.log("Error getPlayers");
        }, false, {
          dataType: 'text',
          headers: tools.getHeaders()
        });
      }
      return defer;
    };
    this.start = function () {
      var _this3 = this;
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
          if (_this3.mode == 'serien') {
            _this3.listview.createListview(_this3.players);
            _this3.mode = 'player';
          } else {
            Lampa.Activity.backward();
          }
        }
      });
      Lampa.Controller.toggle('content');
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
    Lampa.Component.add('kinotikcomponent', componentkinotik);
    Lampa.Component.add('kinotikvideos', component$1);
    Lampa.Component.add('kinotikvideodetail', component);
  }
  function componentkinotik() {
    var network = new Lampa.Reguest();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var URL = "https://kinotik.bid/";
    var items = [];
    var html = $('<div></div>');
    var active = 0;
    this.create = function () {
      var _this = this;
      this.activity.loader(true);
      network.clear();
      network["native"](tools.getProxy() + URL, function (str) {
        _this.buildKinotikStartSeite(str);
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
    this.buildKinotikStartSeite = function (str) {
      var _this2 = this;
      str = str.replace(/\n/g, '');
      var data = [];
      data.push({
        kategorie: 'Favorite',
        items: [{
          title: '',
          image: '',
          svg: '<div><svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6162 7.10981L15.8464 7.55198L16.3381 7.63428L22.2841 8.62965C22.8678 8.72736 23.0999 9.44167 22.6851 9.86381L18.4598 14.1641L18.1104 14.5196L18.184 15.0127L19.0748 20.9752C19.1622 21.5606 18.5546 22.002 18.025 21.738L12.6295 19.0483L12.1833 18.8259L11.7372 19.0483L6.34171 21.738C5.81206 22.002 5.20443 21.5606 5.29187 20.9752L6.18264 15.0127L6.25629 14.5196L5.9069 14.1641L1.68155 9.86381C1.26677 9.44167 1.49886 8.72736 2.08255 8.62965L8.02855 7.63428L8.52022 7.55198L8.75043 7.10981L11.5345 1.76241C11.8078 1.23748 12.5589 1.23748 12.8322 1.76241L15.6162 7.10981Z" stroke="currentColor" stroke-width="2.2"></path></svg></div>',
          url: '',
          parser: 'kinotik',
          component: 'mediazonefavorite'
        }]
      });
      var items = [];
      var containerArray = tools.matchAll(str, '<li><a href="(.*?)">(.*?)</a></li>');
      containerArray.forEach(function (item) {
        items.push({
          title: item[2],
          image: '',
          url: URL + item[1],
          parser: 'kinotik',
          component: 'kinotikvideos'
        });
        return;
      });
      data.push({
        kategorie: '',
        items: items
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
  var kinotik = {
    componentkinotik: componentkinotik,
    initComponents: initComponents
  };

  function startPlugin() {
    window.view_plugin_ready = true;
    Lampa.Component.add('startcomponent', component$4);
    Lampa.Component.add('mediazonefavorite', component$3);
    kinopub.initComponents();
    kinotik.initComponents();
    Templates.init();
    Settings.init();
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
    if (window.appready) {
      addStartButton();
      Settings.addSettingsProxy();
    } else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
          addStartButton();
          Settings.addSettingsProxy();
        }
      });
    }
  }
  if (!window.view_plugin_ready) startPlugin();

})();