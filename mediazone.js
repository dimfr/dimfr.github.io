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
    Lampa.Template.add('mediazone_style', "<style>\n        .mediazoneline.focus {\n          background-color: #fff;\n          color: #000;\n          border-radius: 0.33em;\n          padding: 0.3em 1em;\n        }\n        .mediazonelinecontainer{\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          width: 50em;\n        }\n        .mediazoneline{\n          padding-top: 0.3em;\n          font-size: 1.3em;\n        }\n        .mediazone-item {\n            width: 15em;\n            -webkit-flex-shrink: 0;\n                -ms-flex-negative: 0;\n                    flex-shrink: 0;\n          }\n          .mediazone-item__imgbox {\n            background-color: #3E3E3E;\n            padding-bottom: 83%;\n            position: relative;\n            -webkit-border-radius: 0.3em;\n               -moz-border-radius: 0.3em;\n                    border-radius: 0.3em;\n          }\n          .mediazone-item__img {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n          }\n          .mediazone-item__name {\n            font-size: 1.1em;\n            margin-bottom: 0.8em;\n          }\n          .mediazone-item.focus .mediazone-item__imgbox:after {\n            border: solid 0.26em #fff;\n            content: \"\";\n            display: block;\n            position: absolute;\n            left: -0.5em;\n            top:  -0.5em;\n            right:  -0.5em;\n            bottom:  -1.5em;\n            -webkit-border-radius: 0.8em;\n               -moz-border-radius: 0.8em;\n                    border-radius: 0.8em;\n          }\n          .mediazone-item + .mediazone-item {\n            margin-left: 1em;\n          }      \n                    \n          .mediazone-itemlist-center{\n            display: flex;\n            flex-direction: row;\n          }\n          \n        </style>");
  }
  var Templates = {
    init: init
  };

  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c),
        u = i.value;
    } catch (n) {
      return void e(n);
    }
    i.done ? t(u) : Promise.resolve(u).then(r, o);
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this,
        e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(void 0);
      });
    };
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (t, e, r) {
        t[e] = r.value;
      },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      define({}, "");
    } catch (t) {
      define = function (t, e, r) {
        return t[e] = r;
      };
    }
    function wrap(t, e, r, n) {
      var i = e && e.prototype instanceof Generator ? e : Generator,
        a = Object.create(i.prototype),
        c = new Context(n || []);
      return o(a, "_invoke", {
        value: makeInvokeMethod(t, r, c)
      }), a;
    }
    function tryCatch(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart",
      l = "suspendedYield",
      f = "executing",
      s = "completed",
      y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
      ["next", "throw", "return"].forEach(function (e) {
        define(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function AsyncIterator(t, e) {
      function invoke(r, o, i, a) {
        var c = tryCatch(t[r], t, o);
        if ("throw" !== c.type) {
          var u = c.arg,
            h = u.value;
          return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
            invoke("next", t, i, a);
          }, function (t) {
            invoke("throw", t, i, a);
          }) : e.resolve(h).then(function (t) {
            u.value = t, i(u);
          }, function (t) {
            return invoke("throw", t, i, a);
          });
        }
        a(c.arg);
      }
      var r;
      o(this, "_invoke", {
        value: function (t, n) {
          function callInvokeWithMethodAndArg() {
            return new e(function (e, r) {
              invoke(t, n, e, r);
            });
          }
          return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === f) throw Error("Generator is already running");
        if (o === s) {
          if ("throw" === i) throw a;
          return {
            value: t,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var c = n.delegate;
          if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
            if (o === h) throw o = s, n.arg;
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = f;
          var p = tryCatch(e, r, n);
          if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y) continue;
            return {
              value: p.arg,
              done: n.done
            };
          }
          "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
        }
      };
    }
    function maybeInvokeDelegate(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = tryCatch(o, e.iterator, r.arg);
      if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
      if (e || "" === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function next() {
              for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
              return next.value = t, next.done = !0, next;
            };
          return i.next = i;
        }
      }
      throw new TypeError(typeof e + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function (t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function (t) {
      return {
        __await: t
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
        return t.done ? t.value : a.next();
      });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
      return this;
    }), define(g, "toString", function () {
      return "[object Generator]";
    }), e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return r.reverse(), function next() {
        for (; r.length;) {
          var t = r.pop();
          if (t in e) return next.value = t, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function (e) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      },
      stop: function () {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function (t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function (t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
      },
      finish: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw Error("illegal catch attempt");
      },
      delegateYield: function (e, r, n) {
        return this.delegate = {
          iterator: values(e),
          resultName: r,
          nextLoc: n
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }

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
      var prox = Lampa.Platform.is('webos') || Lampa.Platform.is('tizen') || Lampa.Storage.field('proxy_other') === false ? '' : '';
      prox = "https://corsproxy.io/?key=aabd9b6f&url=";
      network.clear();
      var header = [];
      header.push({
        "Access-Control-Allow-Origin": "*"
      });
      header.push({
        "Access-Control-Allow-Credentials": "true"
      });
      header.push({
        "Access-Control-Max-Age": "1800"
      });
      header.push({
        "Access-Control-Allow-Headers": "content-type"
      });
      network["native"](prox + videodata.url, function (data) {
        _this.extractDataKinopubvideos(data);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text',
        header: header
      });
      return this.render();
    };
    this.extractDataKinopubvideos = function (str) {
      scroll.minus();
      html.append(scroll.render());
      var data = [];
      var containerArray = str.matchAll('<div class="b-content__inline_item.*?<img src="(.*?)".*?<div class="b-content__inline_item-link.*?href="(.*?)">(.*?)</a>');
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
      var prox = Lampa.Platform.is('webos') || Lampa.Platform.is('tizen') || Lampa.Storage.field('proxy_other') === false ? '' : '';
      prox = "https://corsproxy.io/?key=aabd9b6f&url=";
      prox = "https://proxy.corsfix.com/?";
      network.clear();
      network["native"](prox + videodata.url, function (data) {
        _this.buildKinopubvideodetails(data);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text'
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
      /*if(data.items.length < 1){
          this.mode = 'serien';
          data = this.kinopubvideoobject.getSerienDataForSeson('1');
      }  */
      if (this.kinopubvideoobject.isFilmMode()) {
        this.kinopubvideoobject.videos.forEach(function (element) {
          data = _this2.getVideoDataLinksFromHash(element.streams);
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
          if (_this2.mode == 'seson') {
            _this2.mode = 'serien';
            var dataS = _this2.kinopubvideoobject.getSerienDataForSeson(item.id);
            _this2.listview.createListview(dataS);
            _this2.lastSelectedSeson = item.id;
          } else if (_this2.mode == 'serien') {
            _this2.mode = 'translator';
            var _dataS = _this2.kinopubvideoobject.getTranslatorsData();
            _this2.listview.createListview(_dataS);
          }
        }
      };
      this.listview.onFocus = function (line) {
        scroll.update(line, !0);
      };
      scroll.append(this.listview.render());
      this.activity.loader(false);
    };
    this.getVideoDataLinksFromHash = function (hash) {
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
            title: ' (' + quality + ', ' + urlformat + ')',
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
      var containerArray = str.matchAll('ul id="simple-episodes(.*?)</ul>');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          var _containerArray = elementContainer[1].matchAll('<li class.*?data-id="(.*?)".*?data-season_id="(.*?)".*?data-episode_id="(.*?)">(.*?)</li>');
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
        var _containerArray2 = str.matchAll('"streams".*?"(.*?)",');
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
      var containerArray = str.matchAll('initCDNSeriesEvents(.*?), false');
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
      containerArray = str.matchAll('<div class="b-translators__block(.*?)b-post__wait_status');
      containerArray.forEach(function (elementContainer) {
        if (elementContainer[1]) {
          containerArray = elementContainer[1].matchAll('<ul id="translators-list" class="b-translators__list">(.*?)</ul>');
          containerArray.forEach(function (elementContainer) {
            if (elementContainer[1]) {
              //containerArray = elementContainer[1].matchAll('data-translator_id="(.*?)">(.*?)</li>');
              containerArray = elementContainer[1].matchAll('data-translator_id="(.*?)".*?>(.*?)</li>');
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
      var _this4 = this;
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
          if (_this4.mode == 'serien') {
            var dataS = _this4.kinopubvideoobject.getSesonsData();
            if (dataS.items.length > 1) {
              _this4.mode = 'seson';
              _this4.listview.createListview(dataS);
            } else {
              Lampa.Activity.backward();
            }
          } else if (_this4.mode == 'translator') {
            var _dataS2 = _this4.kinopubvideoobject.getSerienDataForSeson(_this4.lastSelectedSeson);
            if (_dataS2.items.length > 1) {
              _this4.mode = 'serien';
              _this4.listview.createListview(_dataS2);
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
    this.extractData = function (str) {
      var extract = {};
      extract.voice = [];
      extract.season = [];
      extract.episode = [];
      str = str.replace(/\n/g, '');
      var containerArray = str.matchAll('<li class="b-topnav__item(.*?)</div>.*?</li>');
      containerArray.forEach(function (element) {
        var ebenetop = element[0].matchAll('<a class="b-topnav__item.*? href="(.*?)">(.*?)<');
        ebenetop.forEach(function (item) {
          console.log(item);
        });
      });
      var voices = str.match('<select name="translator"[^>]+>(.*?)</select>');
      var sesons = str.match('<select name="season"[^>]+>(.*?)</select>');
      var episod = str.match('<select name="episode"[^>]+>(.*?)</select>');
      if (sesons) {
        var select = $('<select>' + sesons[1] + '</select>');
        $('option', select).each(function () {
          extract.season.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }
      if (voices) {
        var _select = $('<select>' + voices[1] + '</select>');
        $('option', _select).each(function () {
          var token = $(this).attr('data-token');
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
        var _select2 = $('<select>' + episod[1] + '</select>');
        $('option', _select2).each(function () {
          extract.episode.push({
            id: $(this).attr('value'),
            name: $(this).text()
          });
        });
      }
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

    /* this.start = function(){
         if(Lampa.Activity.active().activity !== this.activity) return
           this.background()
           Lampa.Controller.add('content',{
             toggle: ()=>{
                 if(items.length){
                     items[active].toggle()
                 }
             },
             back: this.back
         })
           Lampa.Controller.toggle('content')
     }*/

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

  //import puppeteer from 'puppeteer';
  //import require from 'require'

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
    var LogoUrl = "https://kinopub.me/templates/hdrezka/images/hdrezka-logo.png";
    var items = [];
    var html = $('<div></div>');
    var active = 0;

    //lampa.mx/msx/start.json
    this.test = function () {
      puppeteer.launch().then(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(browser) {
          var page, response;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return browser.newPage();
              case 2:
                page = _context.sent;
                _context.next = 5;
                return page["goto"](URL);
              case 5:
                response = _context.sent;
                _context.t0 = console;
                _context.next = 9;
                return response.text();
              case 9:
                _context.t1 = _context.sent;
                _context.t0.log.call(_context.t0, _context.t1);
                _context.next = 13;
                return browser.close();
              case 13:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    };
    this.create = function () {
      var _this = this;
      this.activity.loader(true);
      var prox = Lampa.Platform.is('webos') || Lampa.Platform.is('tizen') || Lampa.Storage.field('proxy_other') === false ? '' : '';
      prox = "https://proxy.corsfix.com/?";
      //prox = "https://194.44.36.114:6868/?"
      prox = "https://corsproxy.io/?key=aabd9b6f&url=";
      //prox = "https://cors-proxy.htmldriven.com/?url=";
      //prox = "https://api.allorigins.win/get?url=";
      network.clear();
      console.log("URL:", prox + URL);
      jQuery.ajax({
        url: prox + URL,
        type: 'GET',
        timeout: 20000,
        beforeSend: function beforeSend(test) {
          console.log("test:", test);
        },
        success: function success(result) {
          console.log("MediazoneS:", result.length);
          console.log("MediazoneS:", result);
        },
        error: function error(_error) {
          console.log("MediazoneE:", _error);
        }
      });

      /*      headers.push({"Access-Control-Allow-Origin": "http://localhost:3000"});
            headers.push({"Access-Control-Allow-Credentials": "true"});
            headers.push({"Access-Control-Max-Age": "1800"});
            headers.push({"Access-Control-Allow-Headers": "*"});
              
      */

      // with headers override
      /*fetch("https://proxy.corsfix.com/?<TARGET_URL>", {
          headers: {
            "x-corsfix-headers": JSON.stringify({
              "Origin": "https://www.google.com",
              "Referer": "https://www.google.com",
            }),
          },
        });*/

      /*let headers2 = {
        "x-rapidapi-key": "17402d2eecmsh4cf9cb8f577e2cdp13c27cjsn428288aec50d",
        "x-rapidapi-host": "cors-proxy1.p.rapidapi.com"
      };
              prox = "https://cors-proxy1.p.rapidapi.com/?";
              const settings = {
                async: true,
                crossDomain: true,
                url: 'https://cors-proxy1.p.rapidapi.com/',
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '17402d2eecmsh4cf9cb8f577e2cdp13c27cjsn428288aec50d',
                    'x-rapidapi-host': 'cors-proxy1.p.rapidapi.com'
                }
            };
            
        $.ajax(settings).done(function (response) {
                console.log(response);
            });
      
              const data = JSON.stringify({
                url: URL,
                method: 'GET',
                params: {},
                data: {},
                json_data: {},
                headers: {},
                cookies: {}
            });
            
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                    //this.buildKinopubStartSeite(this.responseText)
                }
            });
            
            xhr.open('POST', 'https://cors-proxy1.p.rapidapi.com/v1');
            xhr.setRequestHeader('x-rapidapi-key', '17402d2eecmsh4cf9cb8f577e2cdp13c27cjsn428288aec50d');
            xhr.setRequestHeader('x-rapidapi-host', 'cors-proxy1.p.rapidapi.com');
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.send(data);*/

      //prox = "https://api.codetabs.com/v1/proxy?quest=";

      /*console.log("Hostname:", window.location.hostname);
      console.log("Host:", window.location.host);
      console.log("Protocol:", window.location.protocol);
      console.log("Port:", window.location.port);
      console.log("Pathname:", window.location.pathname);
      console.log("Origin:", window.location.origin);*/

      network["native"](prox + URL, function (str) {
        _this.buildKinopubStartSeite(str);
      }, function (a, c) {
        var empty = new Lampa.Empty();
        html.append(empty.render());
        _this.start = empty.start;
        _this.activity.loader(false);
        _this.activity.toggle();
      }, false, {
        dataType: 'text'
        // headers: headers2,
        //withCredentials: true
      });
      this.activity.loader(false);
      return this.render();
    };
    this.buildKinopubStartSeite = function (str) {
      var _this2 = this;
      str = str.replace(/\n/g, '');
      console.log("Str:", str);
      var data = [];
      var containerArray = "test"; //str.matchAll('<li class="b-topnav__item(.*?)</div>.*?</li>')
      containerArray.forEach(function (elementContainer) {
        var itemData = [];
        var ebenetop = elementContainer[1].matchAll('<a class="b-topnav__item.*? href="(.*?)">(.*?)<');
        var kategorie = "####";
        ebenetop.forEach(function (item) {
          kategorie = item[2];
          itemData.push({
            title: item[2],
            image: LogoUrl,
            url: URL + item[1],
            component: 'kinopubvideos'
          });
        });
        var subebeneright = elementContainer[1].matchAll('<a title="(.*?)" href="(.*?)">');
        subebeneright.forEach(function (item) {
          itemData.push({
            title: item[1],
            image: LogoUrl,
            url: URL + item[2].replace('rel="nofollow', '').replace(' ', ''),
            component: 'kinopubvideos'
          });
        });
        var subebeneleft = elementContainer[1].matchAll('a href="(.*?)">(.*?)<');
        subebeneleft.forEach(function (item) {
          itemData.push({
            title: item[2],
            image: LogoUrl,
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWF6b25lLmpzIiwic291cmNlcyI6WyJtZWRpYXpvbmUvaXRlbS5qcyIsIm1lZGlhem9uZS9saW5lLmpzIiwibWVkaWF6b25lL3N0YXJ0LmpzIiwibWVkaWF6b25lL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJtZWRpYXpvbmUvcGFyc2Vycy9raW5vcHViL2tpbm9wdWJ2aWRlb3MuanMiLCJtZWRpYXpvbmUvbGlzdHZpZXcuanMiLCJtZWRpYXpvbmUvcGFyc2Vycy9raW5vcHViL2tpbm9wdWJ2aWRlb29iamVjdC5qcyIsIm1lZGlhem9uZS9wYXJzZXJzL2tpbm9wdWIva2lub3B1YnZpZGVvZGV0YWlsLmpzIiwibWVkaWF6b25lL3BhcnNlcnMva2lub3B1Yi9raW5vcHViLmpzIiwibWVkaWF6b25lL21lZGlhem9uZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpdGVtKGRhdGEpe1xyXG4gICAgbGV0IGl0ZW0gPSBMYW1wYS5UZW1wbGF0ZS5nZXQoJ21lZGlhem9uZV9pdGVtJyx7XHJcbiAgICAgICAgbmFtZTogZGF0YS50aXRsZVxyXG4gICAgfSlcclxuXHJcbiAgICBsZXQgaW1nID0gaXRlbS5maW5kKCdpbWcnKVswXVxyXG5cclxuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpbWcuc3JjID0gJy4vaW1nL2ltZ19icm9rZW4uc3ZnJ1xyXG4gICAgfVxyXG5cclxuICAgIGltZy5zcmMgPSBkYXRhLmltYWdlO1xyXG5cclxuICAgIHRoaXMudXJsID0gZGF0YS51cmw7XHJcbiAgICB0aGlzLnRpdGxlID0gZGF0YS50aXRsZTtcclxuICAgIHRoaXMuY29tcG9uZW50ID0gZGF0YS5jb21wb25lbnQ7XHJcblxyXG4gICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaW1nLm9uZXJyb3IgPSAoKT0+e31cclxuICAgICAgICBpbWcub25sb2FkID0gKCk9Pnt9XHJcblxyXG4gICAgICAgIGltZy5zcmMgPSAnJ1xyXG5cclxuICAgICAgICBpdGVtLnJlbW92ZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGl0ZW0iLCJpbXBvcnQgSXRlbSBmcm9tICcuL2l0ZW0nXHJcblxyXG5mdW5jdGlvbiBjcmVhdGUoZGF0YSwgcGFyYW1zID0ge30pe1xyXG4gICAgbGV0IGNvbnRlbnQgPSBMYW1wYS5UZW1wbGF0ZS5nZXQoJ2l0ZW1zX2xpbmUnLHt0aXRsZTogZGF0YS50aXRsZX0pXHJcbiAgICBsZXQgYm9keSAgICA9IGNvbnRlbnQuZmluZCgnLml0ZW1zLWxpbmVfX2JvZHknKVxyXG4gICAgbGV0IHNjcm9sbCAgPSBuZXcgTGFtcGEuU2Nyb2xsKHtob3Jpem9udGFsOnRydWUsIHZlcnRpY2FsOiB0cnVlLCBzdGVwOjMwMH0pXHJcbiAgICBsZXQgaXRlbXMgICA9IFtdXHJcbiAgICBsZXQgYWN0aXZlICA9IDBcclxuICAgIGxldCBsYXN0O1xyXG4gICBcclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzY3JvbGwucmVuZGVyKCkuZmluZCgnLnNjcm9sbF9fYm9keScpLmFkZENsYXNzKCdtZWRpYXpvbmUtaXRlbWxpc3QtY2VudGVyJylcclxuXHJcbiAgICAgICAgY29udGVudC5maW5kKCcuaXRlbXMtbGluZV9fdGl0bGUnKS50ZXh0KGRhdGEudGl0bGUpXHJcblxyXG4gICAgICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKHRoaXMuYXBwZW5kSXRlbS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICBsZXQgdGVzdCA9IFwiMFwiO1xyXG5cclxuICAgICAgICBib2R5LmFwcGVuZChzY3JvbGwucmVuZGVyKCkpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHBlbmRJdGVtID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgSXRlbShlbGVtZW50KVxyXG5cclxuICAgICAgICBpdGVtLnJlbmRlcigpLm9uKCdob3Zlcjpmb2N1cycsKCk9PntcclxuICAgICAgICAgICAgbGFzdCA9IGl0ZW0ucmVuZGVyKClbMF07XHJcbiAgICAgICAgICAgIGFjdGl2ZSA9IGl0ZW1zLmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSwgdHJ1ZSlcclxuICAgICAgICB9KS5vbignaG92ZXI6ZW50ZXInLCgpPT57XHJcbiAgICAgICAgICAgIExhbXBhLkFjdGl2aXR5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBpdGVtLnVybCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBpdGVtLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiBpdGVtLmNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzY3JvbGwuYXBwZW5kKGl0ZW0ucmVuZGVyKCkpXHJcblxyXG4gICAgICAgIGl0ZW1zLnB1c2goaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci5hZGQoJ21lZGlhem9uZV9saW5lJyx7XHJcbiAgICAgICAgICAgIHRvZ2dsZTogKCk9PntcclxuICAgICAgICAgICAgICAgIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvblNldChzY3JvbGwucmVuZGVyKCkpXHJcbiAgICAgICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLmNvbGxlY3Rpb25Gb2N1cyhsYXN0IHx8IGZhbHNlLHNjcm9sbC5yZW5kZXIoKSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmlnaHQ6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0b3IubW92ZSgncmlnaHQnKVxyXG5cclxuICAgICAgICAgICAgICAgIExhbXBhLkNvbnRyb2xsZXIuZW5hYmxlKCdtZWRpYXpvbmVfbGluZScpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZnQ6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZihOYXZpZ2F0b3IuY2FubW92ZSgnbGVmdCcpKSBOYXZpZ2F0b3IubW92ZSgnbGVmdCcpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMub25MZWZ0KSB0aGlzLm9uTGVmdCgpXHJcbiAgICAgICAgICAgICAgICBlbHNlIExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKCdtZW51JylcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZG93bjogdGhpcy5vbkRvd24sXHJcbiAgICAgICAgICAgIHVwOiAgIHRoaXMub25VcCxcclxuICAgICAgICAgICAgZ29uZTogKCk9PntcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhY2s6IHRoaXMub25CYWNrXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ21lZGlhem9uZV9saW5lJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpXHJcblxyXG4gICAgICAgIGNvbnRlbnQucmVtb3ZlKClcclxuXHJcbiAgICAgICAgaXRlbXMgPSBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZSIsImltcG9ydCBMaW5lIGZyb20gJy4vbGluZSdcclxuXHJcbmZ1bmN0aW9uIGNvbXBvbmVudCgpe1xyXG4gICAgbGV0IG5ldHdvcmsgPSBuZXcgTGFtcGEuUmVndWVzdCgpXHJcbiAgICBsZXQgc2Nyb2xsICA9IG5ldyBMYW1wYS5TY3JvbGwoe21hc2s6dHJ1ZSxvdmVyOiB0cnVlfSlcclxuICAgIGxldCBpdGVtcyAgID0gW11cclxuICAgIGxldCBodG1sICAgID0gJCgnPGRpdj48L2Rpdj4nKVxyXG4gICAgbGV0IGFjdGl2ZSAgPSAwXHJcblxyXG4gICAgbGV0IHNpdGVzID0gW107XHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0tpbm9wdWInLFxyXG4gICAgICAgIGNvbXBvbmVudDogJ2tpbm9wdWJjb21wb25lbnQnLFxyXG4gICAgICAgIHVybDogJ2h0dHBzOi8va2lub3B1Yi5tZS8nLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzEwOTE4MDc0NDgzNTUyMjk2OTcvU2dkb191MmpfNDAweDQwMC5qcGcnXHJcbiAgICB9KTtcclxuXHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0ZpbG1peCcsXHJcbiAgICAgICAgY29tcG9uZW50OiAna2lub3B1YmNvbXBvbmVudCcsXHJcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9maWxtaXguZm0vJyxcclxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vZmlsbWl4LmFjL3RlbXBsYXRlcy9GaWxtaXgvbWVkaWEvaW1nL2ZpbG1peC5wbmcnXHJcbiAgICB9KTtcclxuXHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0tpbm9rb25nJyxcclxuICAgICAgICBjb21wb25lbnQ6ICdraW5vcHViY29tcG9uZW50JyxcclxuICAgICAgICB1cmw6ICdodHRwczovL2tpbm9rb25nLnByby8nLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9raW5va29uZy5wcm8vdGVtcGxhdGVzL3NtYXJ0cGhvbmUva2sucG5nJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKHRydWUpXHJcblxyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJ1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIC8qbmV0d29yay5uYXRpdmUocHJveCArICdodHRwOi8vbG9jYWxob3N0OjMwMDAvcGx1Z2lucy9zdGF0aW9ucy5qc29uJywgdGhpcy5idWlsZC5iaW5kKHRoaXMpLCgpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpXHJcblxyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydFxyXG5cclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpXHJcbiAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzY3JvbGwubWludXMoKVxyXG5cclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpXHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiS2lub1wiLFxyXG4gICAgICAgICAgICByZXN1bHRzOiBzaXRlc1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qZGF0YS5yZXN1bHQuZ2VucmUuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBkYXRhLnJlc3VsdC5zdGF0aW9ucy5maWx0ZXIoc3RhdGlvbj0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRpb24uZ2VucmUuZmlsdGVyKGdlbnJlPT5nZW5yZS5pZCA9PSBlbGVtZW50LmlkKS5sZW5ndGhcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtZW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzOiByZXN1bHRzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2aXR5LmxvYWRlcihmYWxzZSlcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS50b2dnbGUoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwZW5kID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgTGluZShlbGVtZW50KVxyXG5cclxuICAgICAgICBpdGVtLmNyZWF0ZSgpXHJcblxyXG4gICAgICAgIGl0ZW0ub25Eb3duICA9IHRoaXMuZG93bi5iaW5kKHRoaXMpXHJcbiAgICAgICAgaXRlbS5vblVwICAgID0gdGhpcy51cC5iaW5kKHRoaXMpXHJcbiAgICAgICAgaXRlbS5vbkJhY2sgID0gdGhpcy5iYWNrLmJpbmQodGhpcylcclxuXHJcbiAgICAgICAgc2Nyb2xsLmFwcGVuZChpdGVtLnJlbmRlcigpKVxyXG5cclxuICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb3duID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUrK1xyXG5cclxuICAgICAgICBhY3RpdmUgPSBNYXRoLm1pbihhY3RpdmUsIGl0ZW1zLmxlbmd0aCAtIDEpXHJcblxyXG4gICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuXHJcbiAgICAgICAgc2Nyb2xsLnVwZGF0ZShpdGVtc1thY3RpdmVdLnJlbmRlcigpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXAgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGFjdGl2ZS0tXHJcblxyXG4gICAgICAgIGlmKGFjdGl2ZSA8IDApe1xyXG4gICAgICAgICAgICBhY3RpdmUgPSAwXHJcblxyXG4gICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnaGVhZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkJhY2tncm91bmQuaW1tZWRpYXRlbHkoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBWkNBWUFBQUJEMkd4bEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFIQVNVUkJWSGdCbFphTHJzTWdERU5YeEFmMy85WEhGZFhOWkxtMllaSFF5bVBrNENTMDI3N3Y5K2ZmcnV0NjJuRWNuL004bnpiNjljeGo2bGUxKzc1Zi9ScXJaOWZhdG0zRjl3d01SN3loYXdpbE5rZTRHaXMvN2o5c3JRYmRhVkZCbmtjUTFXcmZnbUlJQmNUcnZncXFzS2lUenZwT1FiVW5BeWtWVzRWVnFaWHl5RGxsWUZTS3g5UWFWck83bkdKSUI2M2crRkFxL3hoY0hXQllkd0NzbUF0dkZaVUtFME1sVlpXQ1Q0aWRPbHloVHAzSzM1Ui82TnpscTB1Qm5zS1dsRXpnU2gxVkdKeHY2cm1wWE1PN0VLK1hXVVBuREZSV3FpdFFGZVkyVXlaVnJ5dVdsSTh1bExnR2YxOUZvb0FVd0M5Z0NXTGN3eldQYjdXYTYwcWRsWnhqeDZvb1V1VXFWUXNLK3kxVm9BSnlCZUpBVnNMSmVZbWcvUklYZEcya1Bod1lQQlVRUXlZRjBYQzhsd1AzTVRDcllBWEI4ODU1NnBlQ2JVVVpWN1djY3drVVFmQ1pDNFBYZEE1aEtoU1ZoeXRoWnFqWk0wSjM5dzVtOEJSYWRLQWNyc0lwTlpzTElZZE9xY1o5aEV4aFoxTUgrUUwrY2lGelh6bVloWnIvTTZ5VVV3cDJkcDVVNG5hWkR3QUY1SlJTZWZkU2NKWjNTa1Uwbmw4eHBhQXkrN21sMUVxdk1YU3MxSFJyWjliYzNlWlVTWG1HYS9tZHlqYm1xeVg3QTlSYVlRYTlJUkowQUFBQUFFbEZUa1N1UW1DQycpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoTGFtcGEuQWN0aXZpdHkuYWN0aXZlKCkuYWN0aXZpdHkgIT09IHRoaXMuYWN0aXZpdHkpIHJldHVyblxyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmQoKVxyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLmFkZCgnY29udGVudCcse1xyXG4gICAgICAgICAgICB0b2dnbGU6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmFjazogdGhpcy5iYWNrXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2NvbnRlbnQnKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBodG1sXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKClcclxuXHJcbiAgICAgICAgTGFtcGEuQXJyYXlzLmRlc3Ryb3koaXRlbXMpXHJcblxyXG4gICAgICAgIHNjcm9sbC5kZXN0cm95KClcclxuXHJcbiAgICAgICAgaHRtbC5yZW1vdmUoKVxyXG5cclxuICAgICAgICBpdGVtcyA9IG51bGxcclxuICAgICAgICBuZXR3b3JrID0gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQiLCJmdW5jdGlvbiBpbml0KCl7XHJcbiAgICBMYW1wYS5UZW1wbGF0ZS5hZGQoJ21lZGlhem9uZV9pdGVtJyxgPGRpdiBjbGFzcz1cInNlbGVjdG9yIG1lZGlhem9uZS1pdGVtXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhem9uZS1pdGVtX19pbWdib3hcIj5cclxuICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhem9uZS1pdGVtX19pbWdcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWF6b25lLWl0ZW1fX25hbWVcIj57bmFtZX08L2Rpdj5cclxuICAgIDwvZGl2PmApO1xyXG5cclxuICAgIExhbXBhLlRlbXBsYXRlLmFkZCgnbWVkaWF6b25lX3N0eWxlJyxgPHN0eWxlPlxyXG4gICAgICAgIC5tZWRpYXpvbmVsaW5lLmZvY3VzIHtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBjb2xvcjogIzAwMDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDAuMzNlbTtcclxuICAgICAgICAgIHBhZGRpbmc6IDAuM2VtIDFlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLm1lZGlhem9uZWxpbmVjb250YWluZXJ7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB3aWR0aDogNTBlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLm1lZGlhem9uZWxpbmV7XHJcbiAgICAgICAgICBwYWRkaW5nLXRvcDogMC4zZW07XHJcbiAgICAgICAgICBmb250LXNpemU6IDEuM2VtO1xyXG4gICAgICAgIH1cclxuICAgICAgICAubWVkaWF6b25lLWl0ZW0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMTVlbTtcclxuICAgICAgICAgICAgLXdlYmtpdC1mbGV4LXNocmluazogMDtcclxuICAgICAgICAgICAgICAgIC1tcy1mbGV4LW5lZ2F0aXZlOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLm1lZGlhem9uZS1pdGVtX19pbWdib3gge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjM0UzRTNFO1xyXG4gICAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogODMlO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICAgICAgIC1tb3otYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW1fX2ltZyB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLm1lZGlhem9uZS1pdGVtX19uYW1lIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxLjFlbTtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC44ZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW0uZm9jdXMgLm1lZGlhem9uZS1pdGVtX19pbWdib3g6YWZ0ZXIge1xyXG4gICAgICAgICAgICBib3JkZXI6IHNvbGlkIDAuMjZlbSAjZmZmO1xyXG4gICAgICAgICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICBsZWZ0OiAtMC41ZW07XHJcbiAgICAgICAgICAgIHRvcDogIC0wLjVlbTtcclxuICAgICAgICAgICAgcmlnaHQ6ICAtMC41ZW07XHJcbiAgICAgICAgICAgIGJvdHRvbTogIC0xLjVlbTtcclxuICAgICAgICAgICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgICAgICAgLW1vei1ib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5tZWRpYXpvbmUtaXRlbSArIC5tZWRpYXpvbmUtaXRlbSB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbiAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW1saXN0LWNlbnRlcntcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgIDwvc3R5bGU+YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXRcclxufSIsImltcG9ydCBMaW5lIGZyb20gJy4uLy4uL2xpbmUnXHJcblxyXG5mdW5jdGlvbiBjb21wb25lbnQoZGF0YSl7XHJcbiAgICBsZXQgdmlkZW9kYXRhID0gZGF0YTtcclxuICAgIGxldCBuZXR3b3JrID0gbmV3IExhbXBhLlJlZ3Vlc3QoKTtcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KTtcclxuICAgIGxldCBodG1sICAgID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgIGxldCBib2R5ID0gJCgnPGRpdiBjbGFzcz1cImNhdGVnb3J5LWZ1bGxcIj48L2Rpdj4nKTtcclxuICAgIGxldCBsYXN0ID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKHRydWUpO1xyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJztcclxuICAgICAgICBwcm94ID0gXCJodHRwczovL2NvcnNwcm94eS5pby8/a2V5PWFhYmQ5YjZmJnVybD1cIjtcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXIgPSBbXTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCJ9KTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiOiBcInRydWVcIn0pO1xyXG4gICAgICAgIGhlYWRlci5wdXNoKHtcIkFjY2Vzcy1Db250cm9sLU1heC1BZ2VcIjogXCIxODAwXCJ9KTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiY29udGVudC10eXBlXCJ9KTtcclxuXHJcbiAgICAgICAgbmV0d29yay5uYXRpdmUocHJveCArIHZpZGVvZGF0YS51cmwsKGRhdGEpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZXh0cmFjdERhdGFLaW5vcHVidmlkZW9zKGRhdGEpO1xyXG4gICAgICAgIH0sKGEsYyk9PntcclxuICAgICAgICAgICAgbGV0IGVtcHR5ID0gbmV3IExhbXBhLkVtcHR5KClcclxuXHJcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kKGVtcHR5LnJlbmRlcigpKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGFydCA9IGVtcHR5LnN0YXJ0XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LmxvYWRlcihmYWxzZSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkudG9nZ2xlKClcclxuICAgICAgICB9LGZhbHNlLHtcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgaGVhZGVyOiBoZWFkZXJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmV4dHJhY3REYXRhS2lub3B1YnZpZGVvcyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgc2Nyb2xsLm1pbnVzKClcclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICAgIGxldCBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgnPGRpdiBjbGFzcz1cImItY29udGVudF9faW5saW5lX2l0ZW0uKj88aW1nIHNyYz1cIiguKj8pXCIuKj88ZGl2IGNsYXNzPVwiYi1jb250ZW50X19pbmxpbmVfaXRlbS1saW5rLio/aHJlZj1cIiguKj8pXCI+KC4qPyk8L2E+Jyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHRpdGVsOiBlbGVtZW50Q29udGFpbmVyWzNdLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBlbGVtZW50Q29udGFpbmVyWzJdLFxyXG4gICAgICAgICAgICAgICAgaW1nOiBlbGVtZW50Q29udGFpbmVyWzFdLFxyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgY2FyZCA9IExhbXBhLlRlbXBsYXRlLmdldChcImNhcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1lbnQudGl0ZWwsXHJcbiAgICAgICAgICAgICAgICByZWxlYXNlX3llYXI6IFwiXCJcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IGltZyA9IGNhcmQuZmluZChcIi5jYXJkX19pbWdcIilbMF07XHJcbiAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuYWRkQ2xhc3MoXCJjYXJkLS1sb2FkZWRcIik7XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgaW1nLnNyYyA9IGVsZW1lbnQuaW1nO1xyXG5cclxuICAgICAgICAgICAgICBjYXJkLm9uKFwiaG92ZXI6Zm9jdXNcIiwgKGZ1bmN0aW9uICgpIHsgXHJcbiAgICAgICAgICAgICAgICBsYXN0ID0gY2FyZFswXSwgXHJcbiAgICAgICAgICAgICAgICBzY3JvbGwudXBkYXRlKGNhcmQsICEwKX0pKTtcclxuXHJcbiAgICAgICAgICAgICAgY2FyZC5vbihcImhvdmVyOmhvdmVyXCIsIChmdW5jdGlvbiAoKSB7IFxyXG4gICAgICAgICAgICAgICAgbGFzdCA9IGNhcmRbMF0gXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBjYXJkLm9uKCdob3ZlcjplbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExhbXBhLkFjdGl2aXR5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogZWxlbWVudC51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAna2lub3B1YnZpZGVvZGV0YWlsJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbWVudC50aXRlbCxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZWxlbWVudC5pbWdcclxuICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICAgXHJcblx0XHRcdFx0ICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm9keS5hcHBlbmQoY2FyZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoYm9keSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgIH0gIFxyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQmFja2dyb3VuZC5pbW1lZGlhdGVseSgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUFaQ0FZQUFBQkQyR3hsQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUhBU1VSQlZIZ0JsWmFMcnNNZ0RFTlh4QWYzLzlYSEZkWE5aTG0yWVpIUXltUGs0Q1MwMjc3djkrZmZydXQ2Mm5FY24vTThuemI2OWN4ajZsZTErNzVmL1Jxclo5ZmF0bTNGOXd3TVI3eWhhd2lsTmtlNEdpcy83ajlzclFiZGFWRkJua2NRMVdyZmdtSUlCY1RydmdxcXNLaVR6dnBPUWJVbkF5a1ZXNFZWcVpYeXlEbGxZRlNLeDlRYVZyTzduR0pJQjYzZytGQXEveGhjSFdCWWR3Q3NtQXR2RlpVS0UwTWxWWldDVDRpZE9seWhUcDNLMzVSLzZOemxxMHVCbnNLV2xFemdTaDFWR0p4djZybXBYTU83RUsrWFdVUG5ERlJXcWl0UUZlWTJVeVpWcnl1V2xJOHVsTGdHZjE5Rm9vQVV3QzlnQ1dMY3d6V1BiN1dhNjBxZGxaeGp4Nm9vVXVVcVZRc0sreTFWb0FKeUJlSkFWc0xKZVltZy9SSVhkRzJrUGh3WVBCVVFReVlGMFhDOGx3UDNNVENyWUFYQjg4NTU2cGVDYlVVWlY3V2Njd2tVUWZDWkM0UFhkQTVoS2hTVmh5dGhacWpaTTBKMzl3NW04QlJhZEtBY3JzSXBOWnNMSVlkT3FjWjloRXhoWjFNSCtRTCtjaUZ6WHptWWhaci9NNnlVVXdwMmRwNVU0bmFaRHdBRjVKUlNlZmRTY0paM1NrVTBubDh4cGFBeSs3bWwxRXF2TVhTczFIUnJaOWJjM2VaVVNYbUdhL21keWpibXF5WDdBOVJhWVFhOUlSSjBBQUFBQUVsRlRrU3VRbUNDJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKFwiY29udGVudFwiLCB7XHJcblx0ICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQ29udHJvbGxlci5jb2xsZWN0aW9uU2V0KHNjcm9sbC5yZW5kZXIoKSksIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvbkZvY3VzKGxhc3QgfHwgITEsIHNjcm9sbC5yZW5kZXIoKSk7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgbGVmdDogZnVuY3Rpb24gbGVmdCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJsZWZ0XCIpID8gTmF2aWdhdG9yLm1vdmUoXCJsZWZ0XCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJtZW51XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIHJpZ2h0OiBmdW5jdGlvbiByaWdodCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJyaWdodFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwicmlnaHRcIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImNvbnRlbnRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgdXA6IGZ1bmN0aW9uIHVwKCkge1xyXG5cdCAgICAgICAgICBOYXZpZ2F0b3IuY2FubW92ZShcInVwXCIpID8gTmF2aWdhdG9yLm1vdmUoXCJ1cFwiKSA6IExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKFwiaGVhZFwiKTtcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBkb3duOiBmdW5jdGlvbiBkb3duKCkge1xyXG5cdCAgICAgICAgICBOYXZpZ2F0b3IuY2FubW92ZShcImRvd25cIikgPyBOYXZpZ2F0b3IubW92ZShcImRvd25cIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImNvbnRlbnRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgYmFjazogZnVuY3Rpb24gYmFjaygpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQWN0aXZpdHkuYmFja3dhcmQoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICB9KTtcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2NvbnRlbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbmV0d29yay5jbGVhcigpO1xyXG5cclxuICAgICAgICAvL0xhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICBodG1sLnJlbW92ZSgpO1xyXG4gIFxyXG4gICAgICAgIG5ldHdvcmsgPSBudWxsO1xyXG4gICAgICAgIHZpZGVvZGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudCIsImZ1bmN0aW9uIGxpc3R2aWV3KCl7XHJcbiAgICB0aGlzLm9uRW50ZXIgPSBmdW5jdGlvbigpe307XHJcbiAgICB0aGlzLm9uRm9jdXMgPSBmdW5jdGlvbigpe307XHJcblxyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwibWVkaWF6b25lbGluZWNvbnRhaW5lclwiPjwvZGl2PicpO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlTGlzdHZpZXcgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGluZSA9ICQoJzxkaXYgY2xhc3M9XCJtZWRpYXpvbmVsaW5lIHNlbGVjdG9yXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChsaW5lKTtcclxuICAgIFxyXG4gICAgICAgICAgICBsaW5lLm9uKCdob3ZlcjplbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25FbnRlcihpdGVtKTsgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxpbmUub24oXCJob3Zlcjpmb2N1c1wiLCAoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZvY3VzKGxpbmUpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQobGluZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGltZy5vbmVycm9yID0gKCk9Pnt9XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpPT57fVxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsaXN0dmlldyIsImZ1bmN0aW9uIGtpbm9wdWJ2aWRlb29iamVjdCgpe1xyXG4gICAgdGhpcy52aWRlb3MgPSBbXTtcclxuICAgIHRoaXMudHJhbnNsYXRvcnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLmdldFNlc29ucyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHNlc29ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNlc29ucy5pbmRleE9mKGVsZW1lbnQuZGF0YV9zZWFzb25faWQpIDwgMCl7XHJcbiAgICAgICAgICAgICAgICBzZXNvbnMucHVzaChlbGVtZW50LmRhdGFfc2Vhc29uX2lkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Vzb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VHJhbnNsYXRvcnNEYXRhID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgaXRlbXM6IFtdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdG9ycy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkXHJcbiAgICAgICAgICAgIH0pOyBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXNvbnNDb3VudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2Vzb25zKCkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0U2Vzb25zRGF0YSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBzZXNvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpZGVvcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBpZihzZXNvbnMuaW5kZXhPZihlbGVtZW50LmRhdGFfc2Vhc29uX2lkKSA8IDApe1xyXG4gICAgICAgICAgICAgICAgc2Vzb25zLnB1c2goZWxlbWVudC5kYXRhX3NlYXNvbl9pZCk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn0KHQtdC30L7QvSAnICsgZWxlbWVudC5kYXRhX3NlYXNvbl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudC5kYXRhX3NlYXNvbl9pZFxyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0U2VyaWVuRGF0YUZvclNlc29uID0gZnVuY3Rpb24oc2Vzb25pZCl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNlc29uaWQgPT0gZWxlbWVudC5kYXRhX3NlYXNvbl9pZCl7XHJcbiAgICAgICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtZW50LnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmRhdGFfZXBpc29kZV9pZFxyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaXNGaWxtTW9kZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQuc3RyZWFtcyAhPSB1bmRlZmluZWQgJiYgZWxlbWVudC5zdHJlYW1zICE9IFwiXCIpe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBraW5vcHVidmlkZW9vYmplY3QiLCJpbXBvcnQgTGluZSBmcm9tICcuLi8uLi9saW5lJ1xyXG5pbXBvcnQgTGlzdHZpZXcgZnJvbSAnLi4vLi4vbGlzdHZpZXcnXHJcbmltcG9ydCBLaW5vcHVidmlkZW9vYmplY3QgZnJvbSAnLi9raW5vcHVidmlkZW9vYmplY3QnXHJcblxyXG5mdW5jdGlvbiBjb21wb25lbnRraW5vcHVidmlkZW9kZXRhaWwoZGF0YSl7XHJcbiAgICBsZXQgbmV0d29yayA9IG5ldyBMYW1wYS5SZWd1ZXN0KClcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KVxyXG4gICAgbGV0IGl0ZW1zICAgPSBbXVxyXG4gICAgbGV0IGh0bWwgICAgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgbGV0IGFjdGl2ZSAgPSAwO1xyXG4gICAgbGV0IHZpZGVvZGF0YSA9IGRhdGE7XHJcbiAgICBcclxuICAgIHRoaXMudG9SZXBsYWNlID0gWyckJCEhQCQkQF4hQCMkJEAnLCAnQEBAQEAhIyMhXl5eJywgJyMjIyNeISEjIyFAQCcsICdeXl4hQCMjISEjIycsICckJCMhIUAjIUAjIyddO1xyXG4gICAgdGhpcy5maWxlc2VwYXJhdG9yID0gJ1xcXFwvXFxcXC9fXFxcXC9cXFxcLyc7XHJcbiAgICB0aGlzLm1vZGUgPSAnc2Vzb24nO1xyXG4gICAgdGhpcy5raW5vcHVidmlkZW9vYmplY3QgPSBuZXcgS2lub3B1YnZpZGVvb2JqZWN0KCk7XHJcbiAgICB0aGlzLmxpc3R2aWV3ID0gbmV3IExpc3R2aWV3KCk7XHJcbiAgICB0aGlzLmxhc3RTZWxlY3RlZFNlc29uID0gXCIxXCI7XHJcbiAgXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIodHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJztcclxuICAgICAgICBwcm94ID0gXCJodHRwczovL2NvcnNwcm94eS5pby8/a2V5PWFhYmQ5YjZmJnVybD1cIjtcclxuICAgICAgICBwcm94ID0gXCJodHRwczovL3Byb3h5LmNvcnNmaXguY29tLz9cIjtcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIG5ldHdvcmsubmF0aXZlKHByb3ggKyB2aWRlb2RhdGEudXJsLChkYXRhKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkS2lub3B1YnZpZGVvZGV0YWlscyhkYXRhKTtcclxuICAgICAgICB9LChhLGMpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpXHJcblxyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydFxyXG5cclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpXHJcbiAgICAgICAgfSxmYWxzZSx7XHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCdcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkS2lub3B1YnZpZGVvZGV0YWlscyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL1xcbi9nLCcnKTtcclxuICAgICAgICBzY3JvbGwubWludXMoKTtcclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpO1xyXG5cclxuICAgICAgICBsZXQgY2FyZCA9IExhbXBhLlRlbXBsYXRlLmdldChcImZ1bGxfc3RhcnRfbmV3XCIpO1xyXG5cclxuICAgICAgICAvLyBQb3N0ZXJcclxuICAgICAgICBsZXQgaW1nID0gY2FyZC5maW5kKFwiLmZ1bGwtLXBvc3RlclwiKVswXTtcclxuICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7fTtcclxuICAgICAgICBpbWcuc3JjID0gdmlkZW9kYXRhLmltYWdlOyAgICAgICAgXHJcbiAgICAgICAgY2FyZC5maW5kKFwiLmZ1bGwtc3RhcnQtbmV3X19wb3N0ZXJcIikuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xyXG5cclxuICAgICAgICAvLyBUaXRsZVxyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fdGl0bGVcIikudGV4dCh2aWRlb2RhdGEudGl0bGUpO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gVGFnbGluZVxyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fdGFnbGluZVwiKS5oaWRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRGVzY3JpcHRpb25cclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBzdHIubWF0Y2goJzxkaXYgY2xhc3M9XCJiLXBvc3RfX2Rlc2NyaXB0aW9uX3RleHRcIj4oLio/KTwvZGl2PicpO1xyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fZGV0YWlsc1wiKS50ZXh0KGRlc2NyaXB0aW9uWzFdKTtcclxuXHJcbiAgICAgICAgY2FyZC5maW5kKFwiLmJ1dHRvbi0tcGxheVwiKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIGNhcmQuZmluZChcIi5idXR0b24tLXJlYWN0aW9uXCIpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgLy9jYXJkLmZpbmQoXCIuYnV0dG9uLS1ib29rXCIpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgIC8vIFJhdGluZ1xyXG4gICAgICAgIGNhcmQuZmluZCgnLnJhdGUtLXRtZGInKS5oaWRlKCk7XHJcbiAgICAgICAgbGV0IHJhdGluZ0ltYmQgPSBzdHIubWF0Y2goJzxzcGFuIGNsYXNzPVwiYi1wb3N0X19pbmZvX3JhdGVzIGltZGJcIj4uKj9jbGFzcz1cImJvbGRcIj4oLio/KTwvc3Bhbj4nKTtcclxuICAgICAgICBpZihyYXRpbmdJbWJkICYmIHJhdGluZ0ltYmQubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIGxldCByYXRpbmdFbGVtZW50ID0gY2FyZC5maW5kKFwiLnJhdGUtLWltZGJcIik7XHJcbiAgICAgICAgICAgIGlmKHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKVswXS50ZXh0KHJhdGluZ0ltYmRbMV0pXHJcbiAgICAgICAgICAgICAgICByYXRpbmdFbGVtZW50LnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYXRpbmdLUCA9IHN0ci5tYXRjaCgnPHNwYW4gY2xhc3M9XCJiLXBvc3RfX2luZm9fcmF0ZXMga3BcIj4uKj9jbGFzcz1cImJvbGRcIj4oLio/KTwvc3Bhbj4nKTtcclxuICAgICAgICBpZihyYXRpbmdLUCAmJiByYXRpbmdLUC5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgbGV0IHJhdGluZ0VsZW1lbnQgPSBjYXJkLmZpbmQoXCIucmF0ZS0ta3BcIik7XHJcbiAgICAgICAgICAgIGlmKHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKVswXS50ZXh0KHJhdGluZ0tQWzFdKVxyXG4gICAgICAgICAgICAgICAgcmF0aW5nRWxlbWVudC5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoY2FyZCk7XHJcblxyXG4gICAgICAgIHRoaXMua2lub3B1YnZpZGVvb2JqZWN0LnZpZGVvcyA9IHRoaXMuZ2V0VmlkZW9zKHN0cik7XHJcbiAgICAgICAgdGhpcy5raW5vcHVidmlkZW9vYmplY3QudHJhbnNsYXRvcnMgPSB0aGlzLmdldFRyYW5zbGF0b3JzKHN0cik7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2Vzb25zRGF0YSgpO1xyXG4gICAgICAgIC8qaWYoZGF0YS5pdGVtcy5sZW5ndGggPCAxKXtcclxuICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3Nlcmllbic7XHJcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC5nZXRTZXJpZW5EYXRhRm9yU2Vzb24oJzEnKTtcclxuICAgICAgICB9ICAqLyAgICBcclxuICAgICAgICBpZih0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC5pc0ZpbG1Nb2RlKCkpe1xyXG4gICAgICAgICAgICB0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC52aWRlb3MuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldFZpZGVvRGF0YUxpbmtzRnJvbUhhc2goZWxlbWVudC5zdHJlYW1zKTtcclxuICAgICAgICAgICAgfSk7ICBcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGEpO1xyXG4gICAgICAgIHRoaXMubGlzdHZpZXcub25FbnRlciA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGl0ZW0uc3RyZWFtVXJsICE9IHVuZGVmaW5lZCAmJiBpdGVtLnN0cmVhbVVybCAhPSAnJyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBpdGVtLnRpdGxlLCBcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGl0ZW0uc3RyZWFtVXJsIFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vdmlkZW9bJ2lwdHYnXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGxheWxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIHBsYXlsaXN0LnB1c2goeyB0aXRsZTogaXRlbS50aXRsZSwgdXJsOiBpdGVtLnN0cmVhbVVybCB9KVxyXG4gICAgICAgICAgICAgICAgdmlkZW9bJ3BsYXlsaXN0J10gPSBwbGF5bGlzdDtcclxuICAgICAgICAgICAgICAgIExhbXBhLlBsYXllci5wbGF5KHZpZGVvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5tb2RlID09ICdzZXNvbicpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzZXJpZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhUyA9IHRoaXMua2lub3B1YnZpZGVvb2JqZWN0LmdldFNlcmllbkRhdGFGb3JTZXNvbihpdGVtLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGFTKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZFNlc29uID0gaXRlbS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5tb2RlID09ICdzZXJpZW4nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAndHJhbnNsYXRvcic7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0VHJhbnNsYXRvcnNEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0dmlldy5jcmVhdGVMaXN0dmlldyhkYXRhUyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0dmlldy5vbkZvY3VzID0gKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgc2Nyb2xsLnVwZGF0ZShsaW5lLCAhMClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoIHRoaXMubGlzdHZpZXcucmVuZGVyKCkpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFZpZGVvRGF0YUxpbmtzRnJvbUhhc2ggPSBmdW5jdGlvbihoYXNoKXtcclxuICAgICAgICBsZXQgaGFzaFdlcnQgPSBoYXNoLnN1YnN0cmluZygyLCBoYXNoLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy50b1JlcGxhY2UuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgaGFzaFdlcnQgPSBoYXNoV2VydC5yZXBsYWNlKHRoaXMuZmlsZXNlcGFyYXRvciArIGIxKGVsZW1lbnQpLCBcIlwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGxpbmtzU3RyaW5nO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxpbmtzU3RyaW5nID0gYjIoaGFzaFdlcnQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbGlua3NTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxpbmtzU3RyaW5nLnNwbGl0KCcsJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHF1YWxpdHkgPSBnZXRRdWFsaXR5KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBsZXQgZm9yUmVwbGFjZSA9ICgnWycgKyBxdWFsaXR5ICsgJ10nKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRPaG5lUXVhbGl0eSA9IGVsZW1lbnQucmVwbGFjZShmb3JSZXBsYWNlLCAnJylcclxuICAgICAgICAgICAgZWxlbWVudE9obmVRdWFsaXR5LnNwbGl0KCcgb3IgJykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmxmb3JtYXQgPSBpdGVtLmluZGV4T2YoJy5tM3U4JykgPiAwID8gXCJtM3U4XCIgOiBcIm1wNFwiO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5pdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJyAoJyArIHF1YWxpdHkgKyAnLCAnICsgdXJsZm9ybWF0ICsgJyknLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbVVybDogaXRlbS5yZXBsYWNlQWxsKCcgJywgJycpXHJcbiAgICAgICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRRdWFsaXR5KGlucHV0U3RyKXtcclxuICAgICAgICBsZXQgc3RhcnQgPSBpbnB1dFN0ci5pbmRleE9mKCdbJyk7XHJcbiAgICAgICAgbGV0IGVuZCA9IGlucHV0U3RyLmluZGV4T2YoJ10nKTtcclxuICAgICAgICByZXR1cm4gaW5wdXRTdHIuc3Vic3RyaW5nKHN0YXJ0KzEsIGVuZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGIxKHN0cikge1xyXG4gICAgICAgIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoXCIweFwiICsgcDEpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGIyKHN0cikge1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihzdHIpLnNwbGl0KFwiXCIpLm1hcChmdW5jdGlvbihjKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIiVcIiArIChcIjAwXCIgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XHJcbiAgICAgICAgfSkuam9pbihcIlwiKSk7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICB0aGlzLmdldFZpZGVvcyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgbGV0IHZpZGVvcyA9IFtdOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGhhc1ZpZGVvcyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgndWwgaWQ9XCJzaW1wbGUtZXBpc29kZXMoLio/KTwvdWw+Jyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyQXJyYXkgPSBlbGVtZW50Q29udGFpbmVyWzFdLm1hdGNoQWxsKCc8bGkgY2xhc3MuKj9kYXRhLWlkPVwiKC4qPylcIi4qP2RhdGEtc2Vhc29uX2lkPVwiKC4qPylcIi4qP2RhdGEtZXBpc29kZV9pZD1cIiguKj8pXCI+KC4qPyk8L2xpPicpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50Q29udGFpbmVyLmxlbmd0aCA+IDQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb3MucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2lkOiBlbGVtZW50Q29udGFpbmVyWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV9zZWFzb25faWQ6IGVsZW1lbnRDb250YWluZXJbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2VwaXNvZGVfaWQ6IGVsZW1lbnRDb250YWluZXJbM10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbWVudENvbnRhaW5lcls0XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBoYXNWaWRlb3MgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKCFoYXNWaWRlb3Mpe1xyXG4gICAgICAgICAgICBsZXQgY29udGFpbmVyQXJyYXkgPSBzdHIubWF0Y2hBbGwoJ1wic3RyZWFtc1wiLio/XCIoLio/KVwiLCcpO1xyXG4gICAgICAgICAgICBjb250YWluZXJBcnJheS5mb3JFYWNoKGVsZW1lbnRDb250YWluZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lci5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICB2aWRlb3MucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbXM6IGVsZW1lbnRDb250YWluZXJbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfaWQ6ICcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aWRlb3M7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRUcmFuc2xhdG9ycyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0b3JzID0gW107XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lckFycmF5ID0gc3RyLm1hdGNoQWxsKCdpbml0Q0ROU2VyaWVzRXZlbnRzKC4qPyksIGZhbHNlJyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXIgPSBlbGVtZW50Q29udGFpbmVyWzFdLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICBpZihhci5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVHJhbnNsYXRvcidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgnPGRpdiBjbGFzcz1cImItdHJhbnNsYXRvcnNfX2Jsb2NrKC4qPyliLXBvc3RfX3dhaXRfc3RhdHVzJyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJBcnJheSA9IGVsZW1lbnRDb250YWluZXJbMV0ubWF0Y2hBbGwoJzx1bCBpZD1cInRyYW5zbGF0b3JzLWxpc3RcIiBjbGFzcz1cImItdHJhbnNsYXRvcnNfX2xpc3RcIj4oLio/KTwvdWw+Jyk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJBcnJheS5mb3JFYWNoKGVsZW1lbnRDb250YWluZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnRDb250YWluZXJbMV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnRhaW5lckFycmF5ID0gZWxlbWVudENvbnRhaW5lclsxXS5tYXRjaEFsbCgnZGF0YS10cmFuc2xhdG9yX2lkPVwiKC4qPylcIj4oLio/KTwvbGk+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckFycmF5ID0gZWxlbWVudENvbnRhaW5lclsxXS5tYXRjaEFsbCgnZGF0YS10cmFuc2xhdG9yX2lkPVwiKC4qPylcIi4qPz4oLio/KTwvbGk+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckFycmF5LmZvckVhY2goZWxlbWVudENvbnRhaW5lciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50Q29udGFpbmVyLmxlbmd0aCA+IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0b3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudENvbnRhaW5lclsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudENvbnRhaW5lclsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2xhdG9ycztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKFwiY29udGVudFwiLCB7XHJcblx0ICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQ29udHJvbGxlci5jb2xsZWN0aW9uU2V0KHNjcm9sbC5yZW5kZXIoKSksIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvbkZvY3VzKCExLCBzY3JvbGwucmVuZGVyKCkpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGxlZnQ6IGZ1bmN0aW9uIGxlZnQoKSB7XHJcblx0ICAgICAgICAgIE5hdmlnYXRvci5jYW5tb3ZlKFwibGVmdFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwibGVmdFwiKSA6IExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKFwibWVudVwiKTtcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICByaWdodDogZnVuY3Rpb24gcmlnaHQoKSB7XHJcblx0ICAgICAgICAgIE5hdmlnYXRvci5jYW5tb3ZlKFwicmlnaHRcIikgPyBOYXZpZ2F0b3IubW92ZShcInJpZ2h0XCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJjb250ZW50XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIHVwOiBmdW5jdGlvbiB1cCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJ1cFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwidXBcIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImhlYWRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZG93bjogZnVuY3Rpb24gZG93bigpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJkb3duXCIpID8gTmF2aWdhdG9yLm1vdmUoXCJkb3duXCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJjb250ZW50XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMubW9kZSA9PSAnc2VyaWVuJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2Vzb25zRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGFTLml0ZW1zLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc2Vzb24nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGFTKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5tb2RlID09ICd0cmFuc2xhdG9yJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2VyaWVuRGF0YUZvclNlc29uKHRoaXMubGFzdFNlbGVjdGVkU2Vzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGFTLml0ZW1zLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc2VyaWVuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0dmlldy5jcmVhdGVMaXN0dmlldyhkYXRhUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTGFtcGEuQWN0aXZpdHkuYmFja3dhcmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgfVx0ICAgICAgICAgICAgXHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgfSk7XHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKCdjb250ZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5leHRyYWN0RGF0YSA9ICBmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgIGxldCBleHRyYWN0ID0ge307XHJcbiAgICAgICAgZXh0cmFjdC52b2ljZSAgID0gW11cclxuICAgICAgICBleHRyYWN0LnNlYXNvbiAgPSBbXVxyXG4gICAgICAgIGV4dHJhY3QuZXBpc29kZSA9IFtdXHJcblxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXG4vZywnJylcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lckFycmF5ID0gc3RyLm1hdGNoQWxsKCc8bGkgY2xhc3M9XCJiLXRvcG5hdl9faXRlbSguKj8pPC9kaXY+Lio/PC9saT4nKVxyXG4gICAgICAgIGNvbnRhaW5lckFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlYmVuZXRvcCA9IGVsZW1lbnRbMF0ubWF0Y2hBbGwoJzxhIGNsYXNzPVwiYi10b3BuYXZfX2l0ZW0uKj8gaHJlZj1cIiguKj8pXCI+KC4qPyk8JylcclxuICAgICAgICAgICAgZWJlbmV0b3AuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB2b2ljZXMgPSBzdHIubWF0Y2goJzxzZWxlY3QgbmFtZT1cInRyYW5zbGF0b3JcIltePl0rPiguKj8pPC9zZWxlY3Q+JylcclxuICAgICAgICBsZXQgc2Vzb25zID0gc3RyLm1hdGNoKCc8c2VsZWN0IG5hbWU9XCJzZWFzb25cIltePl0rPiguKj8pPC9zZWxlY3Q+JylcclxuICAgICAgICBsZXQgZXBpc29kID0gc3RyLm1hdGNoKCc8c2VsZWN0IG5hbWU9XCJlcGlzb2RlXCJbXj5dKz4oLio/KTwvc2VsZWN0PicpXHJcblxyXG4gICAgICAgIGlmKHNlc29ucyl7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKCc8c2VsZWN0Picrc2Vzb25zWzFdKyc8L3NlbGVjdD4nKVxyXG5cclxuICAgICAgICAgICAgJCgnb3B0aW9uJyxzZWxlY3QpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGV4dHJhY3Quc2Vhc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJCh0aGlzKS50ZXh0KClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2b2ljZXMpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnPHNlbGVjdD4nK3ZvaWNlc1sxXSsnPC9zZWxlY3Q+JylcclxuXHJcbiAgICAgICAgICAgICQoJ29wdGlvbicsc2VsZWN0KS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG9rZW4gPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdG9rZW4nKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRva2VuKXtcclxuICAgICAgICAgICAgICAgICAgICBleHRyYWN0LnZvaWNlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICQodGhpcykudGV4dCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJCh0aGlzKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlcGlzb2Qpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnPHNlbGVjdD4nK2VwaXNvZFsxXSsnPC9zZWxlY3Q+JylcclxuXHJcbiAgICAgICAgICAgICQoJ29wdGlvbicsc2VsZWN0KS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBleHRyYWN0LmVwaXNvZGUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICQodGhpcykuYXR0cigndmFsdWUnKSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAkKHRoaXMpLnRleHQoKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb3duID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUrK1xyXG5cclxuICAgICAgICBhY3RpdmUgPSBNYXRoLm1pbihhY3RpdmUsIGl0ZW1zLmxlbmd0aCAtIDEpXHJcblxyXG4gICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuXHJcbiAgICAgICAgc2Nyb2xsLnVwZGF0ZShpdGVtc1thY3RpdmVdLnJlbmRlcigpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXAgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGFjdGl2ZS0tXHJcblxyXG4gICAgICAgIGlmKGFjdGl2ZSA8IDApe1xyXG4gICAgICAgICAgICBhY3RpdmUgPSAwXHJcblxyXG4gICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnaGVhZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkJhY2tncm91bmQuaW1tZWRpYXRlbHkoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBWkNBWUFBQUJEMkd4bEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFIQVNVUkJWSGdCbFphTHJzTWdERU5YeEFmMy85WEhGZFhOWkxtMllaSFF5bVBrNENTMDI3N3Y5K2ZmcnV0NjJuRWNuL004bnpiNjljeGo2bGUxKzc1Zi9ScXJaOWZhdG0zRjl3d01SN3loYXdpbE5rZTRHaXMvN2o5c3JRYmRhVkZCbmtjUTFXcmZnbUlJQmNUcnZncXFzS2lUenZwT1FiVW5BeWtWVzRWVnFaWHl5RGxsWUZTS3g5UWFWck83bkdKSUI2M2crRkFxL3hoY0hXQllkd0NzbUF0dkZaVUtFME1sVlpXQ1Q0aWRPbHloVHAzSzM1Ui82TnpscTB1Qm5zS1dsRXpnU2gxVkdKeHY2cm1wWE1PN0VLK1hXVVBuREZSV3FpdFFGZVkyVXlaVnJ5dVdsSTh1bExnR2YxOUZvb0FVd0M5Z0NXTGN3eldQYjdXYTYwcWRsWnhqeDZvb1V1VXFWUXNLK3kxVm9BSnlCZUpBVnNMSmVZbWcvUklYZEcya1Bod1lQQlVRUXlZRjBYQzhsd1AzTVRDcllBWEI4ODU1NnBlQ2JVVVpWN1djY3drVVFmQ1pDNFBYZEE1aEtoU1ZoeXRoWnFqWk0wSjM5dzVtOEJSYWRLQWNyc0lwTlpzTElZZE9xY1o5aEV4aFoxTUgrUUwrY2lGelh6bVloWnIvTTZ5VVV3cDJkcDVVNG5hWkR3QUY1SlJTZWZkU2NKWjNTa1Uwbmw4eHBhQXkrN21sMUVxdk1YU3MxSFJyWjliYzNlWlVTWG1HYS9tZHlqYm1xeVg3QTlSYVlRYTlJUkowQUFBQUFFbEZUa1N1UW1DQycpXHJcbiAgICB9XHJcblxyXG4gICAvKiB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCgpXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKCdjb250ZW50Jyx7XHJcbiAgICAgICAgICAgIHRvZ2dsZTogKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbYWN0aXZlXS50b2dnbGUoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYWNrOiB0aGlzLmJhY2tcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnY29udGVudCcpXHJcbiAgICB9Ki9cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbmV0d29yay5jbGVhcigpXHJcblxyXG4gICAgICAgIExhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpXHJcblxyXG4gICAgICAgIGh0bWwucmVtb3ZlKClcclxuXHJcbiAgICAgICAgaXRlbXMgPSBudWxsXHJcbiAgICAgICAgbmV0d29yayA9IG51bGxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50a2lub3B1YnZpZGVvZGV0YWlsXHJcbiIsImltcG9ydCBMaW5lIGZyb20gJy4uLy4uL2xpbmUnXHJcbmltcG9ydCBraW5vcHVidmlkZW9zIGZyb20gJy4va2lub3B1YnZpZGVvcydcclxuaW1wb3J0IGtpbm9wdWJ2aWRlb2RldGFpbCBmcm9tICcuL2tpbm9wdWJ2aWRlb2RldGFpbCdcclxuLy9pbXBvcnQgcHVwcGV0ZWVyIGZyb20gJ3B1cHBldGVlcic7XHJcbi8vaW1wb3J0IHJlcXVpcmUgZnJvbSAncmVxdWlyZSdcclxuXHJcblxyXG5mdW5jdGlvbiBpbml0Q29tcG9uZW50cygpIHtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJjb21wb25lbnQnLCBjb21wb25lbnRraW5vcHViKTtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJ2aWRlb3MnLCBraW5vcHVidmlkZW9zKTtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJ2aWRlb2RldGFpbCcsIGtpbm9wdWJ2aWRlb2RldGFpbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBvbmVudGtpbm9wdWIoKXsgICAgXHJcbiAgICBsZXQgbmV0d29yayA9IG5ldyBMYW1wYS5SZWd1ZXN0KClcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KVxyXG4gICAgbGV0IFVSTCA9IFwiaHR0cHM6Ly9raW5vcHViLm1lL1wiO1xyXG4gICAgbGV0IExvZ29VcmwgPSBcImh0dHBzOi8va2lub3B1Yi5tZS90ZW1wbGF0ZXMvaGRyZXprYS9pbWFnZXMvaGRyZXprYS1sb2dvLnBuZ1wiO1xyXG4gICAgbGV0IGl0ZW1zICAgPSBbXVxyXG4gICAgbGV0IGh0bWwgICAgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgbGV0IGFjdGl2ZSAgPSAwO1xyXG4gICBcclxuLy9sYW1wYS5teC9tc3gvc3RhcnQuanNvblxyXG4gICAgdGhpcy50ZXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBwdXBwZXRlZXIubGF1bmNoKCkudGhlbihhc3luYyBicm93c2VyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHBhZ2UuZ290byhVUkwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCByZXNwb25zZS50ZXh0KCkpO1xyXG4gICAgICAgICAgICBhd2FpdCBicm93c2VyLmNsb3NlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIodHJ1ZSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgcHJveCAgPSBMYW1wYS5QbGF0Zm9ybS5pcygnd2Vib3MnKSB8fCBMYW1wYS5QbGF0Zm9ybS5pcygndGl6ZW4nKSB8fCBMYW1wYS5TdG9yYWdlLmZpZWxkKCdwcm94eV9vdGhlcicpID09PSBmYWxzZSA/ICcnIDogJyc7XHJcbiAgICAgICAgcHJveCA9IFwiaHR0cHM6Ly9wcm94eS5jb3JzZml4LmNvbS8/XCI7XHJcbiAgICAgICAgLy9wcm94ID0gXCJodHRwczovLzE5NC40NC4zNi4xMTQ6Njg2OC8/XCJcclxuICAgICAgICBwcm94ID0gXCJodHRwczovL2NvcnNwcm94eS5pby8/a2V5PWFhYmQ5YjZmJnVybD1cIlxyXG4gICAgICAgIC8vcHJveCA9IFwiaHR0cHM6Ly9jb3JzLXByb3h5Lmh0bWxkcml2ZW4uY29tLz91cmw9XCI7XHJcbiAgICAgICAgLy9wcm94ID0gXCJodHRwczovL2FwaS5hbGxvcmlnaW5zLndpbi9nZXQ/dXJsPVwiO1xyXG4gICAgICAgIG5ldHdvcmsuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgLyp2YXIgYWp4UmVxID0gJC5hamF4KCB7IHVybCA6IHByb3ggKyBVUkwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlIDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhVHlwZSA6ICd0ZXh0JyxcclxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oIGpxWEhSICkge1xyXG4gICAgICAgICAgICAgICAganFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJPcmlnaW5cIiwgXCJsYW1wYS5teFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYWp4UmVxLnN1Y2Nlc3MoIGZ1bmN0aW9uICggZGF0YSwgc3RhdHVzLCBqcVhociApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YVwiLCBkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGFqeFJlcS5lcnJvciggZnVuY3Rpb24gKCBqcVhociwgdGV4dFN0YXR1cywgZXJyb3JNZXNzYWdlICkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0ZXh0U3RhdHVzXCIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTsqL1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IHtcclxuICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcclxuICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiOiBcInRydWVcIixcclxuICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1NYXgtQWdlXCI6IFwiMTgwMFwiLFxyXG4gICAgICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCIqXCIsXHJcbiAgICAgICAgICAgIFwiQWNjZXB0XCI6ICd0ZXh0L2h0bWwsYXBwbGljYXRpb24veGh0bWwreG1sLGFwcGxpY2F0aW9uL3htbDtxPTAuOSxpbWFnZS9hdmlmLGltYWdlL3dlYnAsaW1hZ2UvYXBuZywqLyo7cT0wLjgsYXBwbGljYXRpb24vc2lnbmVkLWV4Y2hhbmdlO3Y9YjM7cT0wLjcnLFxyXG4gICAgICAgICAgICBcIkFjY2VwdC1FbmNvZGluZ1wiOiAnZ3ppcCwgZGVmbGF0ZSwgYnIsIHpzdGQnLFxyXG4gICAgICAgICAgICBcIkFjY2VwdC1MYW5ndWFnZVwiOiAnZGUtREUsZGU7cT0wLjksZW4tVVM7cT0wLjgsZW47cT0wLjcnLFxyXG4gICAgICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogJ21heC1hZ2U9MCcsXHJcbiAgICAgICAgICAgIFwiQ29ubmVjdGlvblwiOiAna2VlcC1hbGl2ZScsXHJcbiAgICAgICAgICAgIFwiSG9zdFwiOiAna2lub3B1Yi5tZScsXHJcbiAgICAgICAgICAgIFwiU2VjLVNoLVVhXCI6ICdcIkdvb2dsZSBDaHJvbWVcIjt2PVwiMTMxXCIsIFwiQ2hyb21pdW1cIjt2PVwiMTMxXCIsIFwiTm90X0EgQnJhbmRcIjt2PVwiMjRcIicsXHJcbiAgICAgICAgICAgIFwiU2VjLUNoLVVhLU1vYmlsZVwiOiBcIj8wXCIsXHJcbiAgICAgICAgICAgIFwiU2VjLUNoLVVhLVBsYXRmb3JtXCI6ICdcIldpbmRvd3NcIicsXHJcbiAgICAgICAgICAgIFwiU2VjLUZldGNoLURlc3RcIjogJ2RvY3VtZW50JyxcclxuICAgICAgICAgICAgXCJTZWMtRmV0Y2gtTW9kZVwiOiAnbmF2aWdhdGUnLFxyXG4gICAgICAgICAgICBcIlNlYy1GZXRjaC1TaXRlXCI6ICdub25lJyxcclxuICAgICAgICAgICAgXCJTZWMtRmV0Y2gtVXNlclwiOiAnPzEnLFxyXG4gICAgICAgICAgICBcInVwZ3JhZGUtaW5zZWN1cmUtcmVxdWVzdHNcIjogJzEnLFxyXG4gICAgICAgICAgICBcIlJlZmVyZXJcIjogXCJraW5vcHViLm1lXCIsXHJcbiAgICAgICAgICAgIFwiT3JpZ2luXCI6IFwia2lub3B1Yi5tZVwiLFxyXG4gICAgICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogXCJHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TXCIsXHJcbiAgICAgICAgICAgIFwiVXNlci1BZ2VudFwiOiAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS4wLjAuMCBTYWZhcmkvNTM3LjM2JyxcclxuICAgICAgICAgICAgJ0Nvb2tpZSc6J2RsZV91c2VyX3Rha2VuPTE7IGRsZV91c2VyX3Rva2VuPTUyYmE3NzJmYzQzYzgzODA5MDk3Nzk2NmMzMTRiZWJlOyBfeW1fdWlkPTE3Mjc1OTYyOTMyMDUyOTU2Mjg7IF95bV9kPTE3Mjc1OTYyOTM7IF95bV9pc2FkPTI7IFBIUFNFU1NJRD1jY2xxM3ExNmNma3BoMjFzbjhoYTQwNm40cydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVSTDpcIiwgcHJveCArIFVSTCk7XHJcbiAgICAgICAgalF1ZXJ5LmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHByb3ggKyBVUkwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICB0aW1lb3V0OiAyMDAwMCxcclxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24odGVzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0OlwiLCB0ZXN0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNZWRpYXpvbmVTOlwiLCByZXN1bHQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWVkaWF6b25lUzpcIiwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAsIGVycm9yOiBmdW5jdGlvbihlcnJvcikgeyAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWVkaWF6b25lRTpcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgLyogICAgICBoZWFkZXJzLnB1c2goe1wiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCJ9KTtcclxuICAgICAgICBoZWFkZXJzLnB1c2goe1wiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIjogXCJ0cnVlXCJ9KTtcclxuICAgICAgICBoZWFkZXJzLnB1c2goe1wiQWNjZXNzLUNvbnRyb2wtTWF4LUFnZVwiOiBcIjE4MDBcIn0pO1xyXG4gICAgICAgIGhlYWRlcnMucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiKlwifSk7XHJcblxyXG4gICAgICAgIFxyXG4qL1xyXG5cclxuLy8gd2l0aCBoZWFkZXJzIG92ZXJyaWRlXHJcbi8qZmV0Y2goXCJodHRwczovL3Byb3h5LmNvcnNmaXguY29tLz88VEFSR0VUX1VSTD5cIiwge1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIngtY29yc2ZpeC1oZWFkZXJzXCI6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBcIk9yaWdpblwiOiBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb21cIixcclxuICAgICAgICBcIlJlZmVyZXJcIjogXCJodHRwczovL3d3dy5nb29nbGUuY29tXCIsXHJcbiAgICAgIH0pLFxyXG4gICAgfSxcclxuICB9KTsqL1xyXG5cclxuICAvKmxldCBoZWFkZXJzMiA9IHtcclxuICAgIFwieC1yYXBpZGFwaS1rZXlcIjogXCIxNzQwMmQyZWVjbXNoNGNmOWNiOGY1NzdlMmNkcDEzYzI3Y2pzbjQyODI4OGFlYzUwZFwiLFxyXG4gICAgXCJ4LXJhcGlkYXBpLWhvc3RcIjogXCJjb3JzLXByb3h5MS5wLnJhcGlkYXBpLmNvbVwiXHJcbn07XHJcblxyXG4gICAgICAgIHByb3ggPSBcImh0dHBzOi8vY29ycy1wcm94eTEucC5yYXBpZGFwaS5jb20vP1wiO1xyXG5cclxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNyb3NzRG9tYWluOiB0cnVlLFxyXG4gICAgICAgICAgICB1cmw6ICdodHRwczovL2NvcnMtcHJveHkxLnAucmFwaWRhcGkuY29tLycsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICd4LXJhcGlkYXBpLWtleSc6ICcxNzQwMmQyZWVjbXNoNGNmOWNiOGY1NzdlMmNkcDEzYzI3Y2pzbjQyODI4OGFlYzUwZCcsXHJcbiAgICAgICAgICAgICAgICAneC1yYXBpZGFwaS1ob3N0JzogJ2NvcnMtcHJveHkxLnAucmFwaWRhcGkuY29tJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICQuYWpheChzZXR0aW5ncykuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIHVybDogVVJMLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHt9LFxyXG4gICAgICAgICAgICBkYXRhOiB7fSxcclxuICAgICAgICAgICAganNvbl9kYXRhOiB7fSxcclxuICAgICAgICAgICAgaGVhZGVyczoge30sXHJcbiAgICAgICAgICAgIGNvb2tpZXM6IHt9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLmJ1aWxkS2lub3B1YlN0YXJ0U2VpdGUodGhpcy5yZXNwb25zZVRleHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsICdodHRwczovL2NvcnMtcHJveHkxLnAucmFwaWRhcGkuY29tL3YxJyk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtcmFwaWRhcGkta2V5JywgJzE3NDAyZDJlZWNtc2g0Y2Y5Y2I4ZjU3N2UyY2RwMTNjMjdjanNuNDI4Mjg4YWVjNTBkJyk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtcmFwaWRhcGktaG9zdCcsICdjb3JzLXByb3h5MS5wLnJhcGlkYXBpLmNvbScpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHhoci5zZW5kKGRhdGEpOyovXHJcblxyXG4gICAgICAgIC8vcHJveCA9IFwiaHR0cHM6Ly9hcGkuY29kZXRhYnMuY29tL3YxL3Byb3h5P3F1ZXN0PVwiO1xyXG4gICAgICAgIFx0XHJcbiAgICAgICAgLypjb25zb2xlLmxvZyhcIkhvc3RuYW1lOlwiLCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSG9zdDpcIiwgd2luZG93LmxvY2F0aW9uLmhvc3QpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJvdG9jb2w6XCIsIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3J0OlwiLCB3aW5kb3cubG9jYXRpb24ucG9ydCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXRobmFtZTpcIiwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk9yaWdpbjpcIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7Ki9cclxuXHJcbiAgICAgICAgbmV0d29yay5uYXRpdmUocHJveCArIFVSTCwoc3RyKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkS2lub3B1YlN0YXJ0U2VpdGUoc3RyKTtcclxuICAgICAgICB9LChhLGMpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpO1xyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydDtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpO1xyXG4gICAgICAgIH0sZmFsc2Use1xyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgIC8vIGhlYWRlcnM6IGhlYWRlcnMyLFxyXG4gICAgICAgICAgICAvL3dpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkS2lub3B1YlN0YXJ0U2VpdGUgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXG4vZywnJylcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0cjpcIiwgc3RyKTtcclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICAgIGxldCBjb250YWluZXJBcnJheSA9IFwidGVzdFwiOyAvL3N0ci5tYXRjaEFsbCgnPGxpIGNsYXNzPVwiYi10b3BuYXZfX2l0ZW0oLio/KTwvZGl2Pi4qPzwvbGk+JylcclxuICAgICAgICBjb250YWluZXJBcnJheS5mb3JFYWNoKGVsZW1lbnRDb250YWluZXIgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbURhdGEgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGViZW5ldG9wID0gZWxlbWVudENvbnRhaW5lclsxXS5tYXRjaEFsbCgnPGEgY2xhc3M9XCJiLXRvcG5hdl9faXRlbS4qPyBocmVmPVwiKC4qPylcIj4oLio/KTwnKTtcclxuICAgICAgICAgICAgbGV0IGthdGVnb3JpZSA9IFwiIyMjI1wiO1xyXG4gICAgICAgICAgICBlYmVuZXRvcC5mb3JFYWNoKGl0ZW0gPT57XHJcbiAgICAgICAgICAgICAgICBrYXRlZ29yaWUgPSBpdGVtWzJdXHJcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogaXRlbVsyXSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogTG9nb1VybCxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFVSTCArIGl0ZW1bMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAna2lub3B1YnZpZGVvcydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgc3ViZWJlbmVyaWdodCA9IGVsZW1lbnRDb250YWluZXJbMV0ubWF0Y2hBbGwoJzxhIHRpdGxlPVwiKC4qPylcIiBocmVmPVwiKC4qPylcIj4nKTtcclxuICAgICAgICAgICAgc3ViZWJlbmVyaWdodC5mb3JFYWNoKGl0ZW0gPT57XHJcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogaXRlbVsxXSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogTG9nb1VybCxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFVSTCArIGl0ZW1bMl0ucmVwbGFjZSgncmVsPVwibm9mb2xsb3cnLCAnJykucmVwbGFjZSgnICcsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdraW5vcHVidmlkZW9zJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHN1YmViZW5lbGVmdCA9IGVsZW1lbnRDb250YWluZXJbMV0ubWF0Y2hBbGwoJ2EgaHJlZj1cIiguKj8pXCI+KC4qPyk8Jyk7XHJcbiAgICAgICAgICAgIHN1YmViZW5lbGVmdC5mb3JFYWNoKGl0ZW0gPT57XHJcbiAgICAgICAgICAgICAgICBpdGVtRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogaXRlbVsyXSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogTG9nb1VybCxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFVSTCArIGl0ZW1bMV0ucmVwbGFjZSgncmVsPVwibm9mb2xsb3cnLCAnJykucmVwbGFjZSgnICcsICcnKSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdraW5vcHVidmlkZW9zJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGthdGVnb3JpZToga2F0ZWdvcmllLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IGl0ZW1EYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzY3JvbGwubWludXMoKTtcclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpO1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1lbnQua2F0ZWdvcmllLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0czogZWxlbWVudC5pdGVtc1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwZW5kID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgTGluZShlbGVtZW50KVxyXG5cclxuICAgICAgICBpdGVtLmNyZWF0ZSgpO1xyXG5cclxuICAgICAgICBpdGVtLm9uRG93biAgPSB0aGlzLmRvd24uYmluZCh0aGlzKTtcclxuICAgICAgICBpdGVtLm9uVXAgICAgPSB0aGlzLnVwLmJpbmQodGhpcyk7XHJcbiAgICAgICAgaXRlbS5vbkJhY2sgID0gdGhpcy5iYWNrLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoaXRlbS5yZW5kZXIoKSk7XHJcblxyXG4gICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb3duID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUrKztcclxuICAgICAgICBhY3RpdmUgPSBNYXRoLm1pbihhY3RpdmUsIGl0ZW1zLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKCk7XHJcbiAgICAgICAgc2Nyb2xsLnVwZGF0ZShpdGVtc1thY3RpdmVdLnJlbmRlcigpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUtLTtcclxuICAgICAgICBpZihhY3RpdmUgPCAwKXtcclxuICAgICAgICAgICAgYWN0aXZlID0gMDtcclxuICAgICAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2hlYWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaXRlbXNbYWN0aXZlXS50b2dnbGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5CYWNrZ3JvdW5kLmltbWVkaWF0ZWx5KCdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQVpDQVlBQUFCRDJHeGxBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBSEFTVVJCVkhnQmxaYUxyc01nREVOWHhBZjMvOVhIRmRYTlpMbTJZWkhReW1QazRDUzAyNzd2OStmZnJ1dDYybkVjbi9NOG56YjY5Y3hqNmxlMSs3NWYvUnFyWjlmYXRtM0Y5d3dNUjd5aGF3aWxOa2U0R2lzLzdqOXNyUWJkYVZGQm5rY1ExV3JmZ21JSUJjVHJ2Z3Fxc0tpVHp2cE9RYlVuQXlrVlc0VlZxWlh5eURsbFlGU0t4OVFhVnJPN25HSklCNjNnK0ZBcS94aGNIV0JZZHdDc21BdHZGWlVLRTBNbFZaV0NUNGlkT2x5aFRwM0szNVIvNk56bHEwdUJuc0tXbEV6Z1NoMVZHSnh2NnJtcFhNTzdFSytYV1VQbkRGUldxaXRRRmVZMlV5WlZyeXVXbEk4dWxMZ0dmMTlGb29BVXdDOWdDV0xjd3pXUGI3V2E2MHFkbFp4ang2b29VdVVxVlFzSyt5MVZvQUp5QmVKQVZzTEplWW1nL1JJWGRHMmtQaHdZUEJVUVF5WUYwWEM4bHdQM01UQ3JZQVhCODg1NTZwZUNiVVVaVjdXY2N3a1VRZkNaQzRQWGRBNWhLaFNWaHl0aFpxalpNMEozOXc1bThCUmFkS0FjcnNJcE5ac0xJWWRPcWNaOWhFeGhaMU1IK1FMK2NpRnpYem1ZaFpyL002eVVVd3AyZHA1VTRuYVpEd0FGNUpSU2VmZFNjSlozU2tVMG5sOHhwYUF5KzdtbDFFcXZNWFNzMUhSclo5YmMzZVpVU1htR2EvbWR5amJtcXlYN0E5UmFZUWE5SVJKMEFBQUFBRWxGVGtTdVFtQ0MnKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhcnQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKExhbXBhLkFjdGl2aXR5LmFjdGl2ZSgpLmFjdGl2aXR5ICE9PSB0aGlzLmFjdGl2aXR5KSByZXR1cm5cclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kKCk7XHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKCdjb250ZW50Jyx7XHJcbiAgICAgICAgICAgIHRvZ2dsZTogKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbYWN0aXZlXS50b2dnbGUoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYWNrOiB0aGlzLmJhY2tcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnY29udGVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbigpeyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKXsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbmV0d29yay5jbGVhcigpO1xyXG4gICAgICAgIExhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKTtcclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpO1xyXG4gICAgICAgIGh0bWwucmVtb3ZlKCk7XHJcbiAgICAgICAgaXRlbXMgPSBudWxsO1xyXG4gICAgICAgIG5ldHdvcmsgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBjb21wb25lbnRraW5vcHViLFxyXG4gICAgaW5pdENvbXBvbmVudHNcclxufVxyXG4iLCJpbXBvcnQgY29tcG9uZW50U3RhcnQgZnJvbSAnLi9zdGFydCc7XHJcbmltcG9ydCBUZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZXMvdGVtcGxhdGVzJztcclxuaW1wb3J0IGtpbm9wdWIgZnJvbSAnLi9wYXJzZXJzL2tpbm9wdWIva2lub3B1Yic7XHJcblxyXG5mdW5jdGlvbiBzdGFydFBsdWdpbigpIHtcclxuICAgIHdpbmRvdy52aWV3X3BsdWdpbl9yZWFkeSA9IHRydWU7XHJcblxyXG4gICAgTGFtcGEuQ29tcG9uZW50LmFkZCgnc3RhcnRjb21wb25lbnQnLCBjb21wb25lbnRTdGFydCk7XHJcbiAgICBraW5vcHViLmluaXRDb21wb25lbnRzKCk7XHJcbiAgICBUZW1wbGF0ZXMuaW5pdCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFN0YXJ0QnV0dG9uKCl7XHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoYDxsaSBjbGFzcz1cIm1lbnVfX2l0ZW0gc2VsZWN0b3JcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnVfX2ljb1wiPlxyXG4gICAgICAgICAgICAgICAgPHN2ZyBoZWlnaHQ9XCI0NFwiIHZpZXdCb3g9XCIwIDAgNDQgNDRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjIxXCIgaGVpZ2h0PVwiMjFcIiByeD1cIjJcIiBmaWxsPVwid2hpdGVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJwYXRoLTItaW5zaWRlLTFfMTU0OjI0XCIgZmlsbD1cIndoaXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjJcIiB5PVwiMjdcIiB3aWR0aD1cIjE3XCIgaGVpZ2h0PVwiMTdcIiByeD1cIjJcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIyXCIgeT1cIjI3XCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCIgcng9XCIyXCIgc3Ryb2tlPVwid2hpdGVcIiBzdHJva2Utd2lkdGg9XCI2XCIgbWFzaz1cInVybCgjcGF0aC0yLWluc2lkZS0xXzE1NDoyNClcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjI3XCIgeT1cIjJcIiB3aWR0aD1cIjE3XCIgaGVpZ2h0PVwiMTdcIiByeD1cIjJcIiBmaWxsPVwid2hpdGVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjI3XCIgeT1cIjM0XCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjNcIiBmaWxsPVwid2hpdGVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjM0XCIgeT1cIjQ0XCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjNcIiB0cmFuc2Zvcm09XCJyb3RhdGUoLTkwIDM0IDQ0KVwiIGZpbGw9XCJ3aGl0ZVwiPjwvcmVjdD5cclxuICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnVfX3RleHRcIj5NZWRpYXpvbmU8L2Rpdj5cclxuICAgICAgICA8L2xpPmApXHJcblxyXG4gICAgICAgIGJ1dHRvbi5vbignaG92ZXI6ZW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIExhbXBhLkFjdGl2aXR5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTWVkaWF6b25lJyxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogJ3N0YXJ0Y29tcG9uZW50JyxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkKCcubWVudSAubWVudV9fbGlzdCcpLmVxKDApLmFwcGVuZChidXR0b24pO1xyXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoTGFtcGEuVGVtcGxhdGUuZ2V0KCdtZWRpYXpvbmVfc3R5bGUnLHt9LHRydWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZih3aW5kb3cuYXBwcmVhZHkpIFxyXG4gICAgICAgIGFkZFN0YXJ0QnV0dG9uKCk7XHJcbiAgICBlbHNle1xyXG4gICAgICAgIExhbXBhLkxpc3RlbmVyLmZvbGxvdygnYXBwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUudHlwZSA9PSAncmVhZHknKSBcclxuICAgICAgICAgICAgICAgIGFkZFN0YXJ0QnV0dG9uKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuaWYoIXdpbmRvdy52aWV3X3BsdWdpbl9yZWFkeSkgc3RhcnRQbHVnaW4oKSJdLCJuYW1lcyI6WyJpdGVtIiwiZGF0YSIsIkxhbXBhIiwiVGVtcGxhdGUiLCJnZXQiLCJuYW1lIiwidGl0bGUiLCJpbWciLCJmaW5kIiwib25lcnJvciIsInNyYyIsImltYWdlIiwidXJsIiwiY29tcG9uZW50IiwicmVuZGVyIiwidG9nZ2xlIiwiZGVzdHJveSIsIm9ubG9hZCIsInJlbW92ZSIsImNyZWF0ZSIsImNvbnRlbnQiLCJib2R5Iiwic2Nyb2xsIiwiU2Nyb2xsIiwiaG9yaXpvbnRhbCIsInZlcnRpY2FsIiwic3RlcCIsIml0ZW1zIiwiYWN0aXZlIiwibGFzdCIsImFkZENsYXNzIiwidGV4dCIsInJlc3VsdHMiLCJmb3JFYWNoIiwiYXBwZW5kSXRlbSIsImJpbmQiLCJhcHBlbmQiLCJlbGVtZW50IiwiSXRlbSIsIm9uIiwiaW5kZXhPZiIsInVwZGF0ZSIsIkFjdGl2aXR5IiwicHVzaCIsInBhZ2UiLCJfdGhpcyIsIkNvbnRyb2xsZXIiLCJhZGQiLCJjb2xsZWN0aW9uU2V0IiwiY29sbGVjdGlvbkZvY3VzIiwicmlnaHQiLCJOYXZpZ2F0b3IiLCJtb3ZlIiwiZW5hYmxlIiwibGVmdCIsImNhbm1vdmUiLCJvbkxlZnQiLCJkb3duIiwib25Eb3duIiwidXAiLCJvblVwIiwiZ29uZSIsImJhY2siLCJvbkJhY2siLCJBcnJheXMiLCJuZXR3b3JrIiwiUmVndWVzdCIsIm1hc2siLCJvdmVyIiwiaHRtbCIsIiQiLCJzaXRlcyIsImFjdGl2aXR5IiwibG9hZGVyIiwiUGxhdGZvcm0iLCJpcyIsIlN0b3JhZ2UiLCJmaWVsZCIsImJ1aWxkIiwibWludXMiLCJMaW5lIiwiYmFja3dhcmQiLCJNYXRoIiwibWluIiwibGVuZ3RoIiwiYmFja2dyb3VuZCIsIkJhY2tncm91bmQiLCJpbW1lZGlhdGVseSIsInN0YXJ0IiwicGF1c2UiLCJzdG9wIiwiY2xlYXIiLCJpbml0IiwidmlkZW9kYXRhIiwicHJveCIsImhlYWRlciIsImV4dHJhY3REYXRhS2lub3B1YnZpZGVvcyIsImEiLCJjIiwiZW1wdHkiLCJFbXB0eSIsImRhdGFUeXBlIiwic3RyIiwiY29udGFpbmVyQXJyYXkiLCJtYXRjaEFsbCIsImVsZW1lbnRDb250YWluZXIiLCJ0aXRlbCIsImNhcmQiLCJyZWxlYXNlX3llYXIiLCJlIiwibGlzdHZpZXciLCJvbkVudGVyIiwib25Gb2N1cyIsImNvbnRhaW5lciIsImNyZWF0ZUxpc3R2aWV3IiwibGluZSIsImtpbm9wdWJ2aWRlb29iamVjdCIsInZpZGVvcyIsInRyYW5zbGF0b3JzIiwiZ2V0U2Vzb25zIiwic2Vzb25zIiwiZGF0YV9zZWFzb25faWQiLCJnZXRUcmFuc2xhdG9yc0RhdGEiLCJpZCIsInNlc29uc0NvdW50IiwiZ2V0U2Vzb25zRGF0YSIsImdldFNlcmllbkRhdGFGb3JTZXNvbiIsInNlc29uaWQiLCJkYXRhX2VwaXNvZGVfaWQiLCJpc0ZpbG1Nb2RlIiwicmVzdWx0Iiwic3RyZWFtcyIsInVuZGVmaW5lZCIsImNvbXBvbmVudGtpbm9wdWJ2aWRlb2RldGFpbCIsInRvUmVwbGFjZSIsImZpbGVzZXBhcmF0b3IiLCJtb2RlIiwiS2lub3B1YnZpZGVvb2JqZWN0IiwiTGlzdHZpZXciLCJsYXN0U2VsZWN0ZWRTZXNvbiIsImJ1aWxkS2lub3B1YnZpZGVvZGV0YWlscyIsIl90aGlzMiIsInJlcGxhY2UiLCJoaWRlIiwiZGVzY3JpcHRpb24iLCJtYXRjaCIsInJhdGluZ0ltYmQiLCJyYXRpbmdFbGVtZW50IiwiY2hpbGRyZW4iLCJyZW1vdmVDbGFzcyIsInJhdGluZ0tQIiwiZ2V0VmlkZW9zIiwiZ2V0VHJhbnNsYXRvcnMiLCJnZXRWaWRlb0RhdGFMaW5rc0Zyb21IYXNoIiwic3RyZWFtVXJsIiwidmlkZW8iLCJwbGF5bGlzdCIsIlBsYXllciIsInBsYXkiLCJkYXRhUyIsImhhc2giLCJfdGhpczMiLCJoYXNoV2VydCIsInN1YnN0cmluZyIsImIxIiwibGlua3NTdHJpbmciLCJiMiIsInNwbGl0IiwicXVhbGl0eSIsImdldFF1YWxpdHkiLCJmb3JSZXBsYWNlIiwiZWxlbWVudE9obmVRdWFsaXR5IiwidXJsZm9ybWF0IiwicmVwbGFjZUFsbCIsImlucHV0U3RyIiwiZW5kIiwiYnRvYSIsImVuY29kZVVSSUNvbXBvbmVudCIsInRvU29saWRCeXRlcyIsInAxIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiYXRvYiIsIm1hcCIsImNoYXJDb2RlQXQiLCJ0b1N0cmluZyIsInNsaWNlIiwiam9pbiIsImhhc1ZpZGVvcyIsImRhdGFfaWQiLCJhciIsIl90aGlzNCIsImV4dHJhY3REYXRhIiwiZXh0cmFjdCIsInZvaWNlIiwic2Vhc29uIiwiZXBpc29kZSIsImViZW5ldG9wIiwiY29uc29sZSIsImxvZyIsInZvaWNlcyIsImVwaXNvZCIsInNlbGVjdCIsImVhY2giLCJhdHRyIiwidG9rZW4iLCJ2YWwiLCJpbml0Q29tcG9uZW50cyIsIkNvbXBvbmVudCIsImNvbXBvbmVudGtpbm9wdWIiLCJraW5vcHVidmlkZW9zIiwia2lub3B1YnZpZGVvZGV0YWlsIiwiVVJMIiwiTG9nb1VybCIsInRlc3QiLCJwdXBwZXRlZXIiLCJsYXVuY2giLCJ0aGVuIiwiX3JlZiIsIl9hc3luY1RvR2VuZXJhdG9yIiwiX3JlZ2VuZXJhdG9yUnVudGltZSIsIm1hcmsiLCJfY2FsbGVlIiwiYnJvd3NlciIsInJlc3BvbnNlIiwid3JhcCIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJwcmV2IiwibmV4dCIsIm5ld1BhZ2UiLCJzZW50IiwidDAiLCJ0MSIsImNhbGwiLCJjbG9zZSIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJqUXVlcnkiLCJhamF4IiwidHlwZSIsInRpbWVvdXQiLCJiZWZvcmVTZW5kIiwic3VjY2VzcyIsImVycm9yIiwiYnVpbGRLaW5vcHViU3RhcnRTZWl0ZSIsIml0ZW1EYXRhIiwia2F0ZWdvcmllIiwic3ViZWJlbmVyaWdodCIsInN1YmViZW5lbGVmdCIsInN0YXJ0UGx1Z2luIiwid2luZG93Iiwidmlld19wbHVnaW5fcmVhZHkiLCJjb21wb25lbnRTdGFydCIsImtpbm9wdWIiLCJUZW1wbGF0ZXMiLCJhZGRTdGFydEJ1dHRvbiIsImJ1dHRvbiIsImVxIiwiYXBwcmVhZHkiLCJMaXN0ZW5lciIsImZvbGxvdyJdLCJtYXBwaW5ncyI6Ijs7O0lBQUEsU0FBU0EsSUFBSUEsQ0FBQ0MsSUFBSSxFQUFDO01BQ2YsSUFBSUQsSUFBSSxHQUFHRSxLQUFLLENBQUNDLFFBQVEsQ0FBQ0MsR0FBRyxDQUFDLGdCQUFnQixFQUFDO1FBQzNDQyxJQUFJLEVBQUVKLElBQUksQ0FBQ0s7T0FDZCxDQUFDO01BRUYsSUFBSUMsR0FBRyxHQUFHUCxJQUFJLENBQUNRLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFFN0JELEdBQUcsQ0FBQ0UsT0FBTyxHQUFHLFlBQVU7UUFDcEJGLEdBQUcsQ0FBQ0csR0FBRyxHQUFHLHNCQUFzQjtPQUNuQztNQUVESCxHQUFHLENBQUNHLEdBQUcsR0FBR1QsSUFBSSxDQUFDVSxLQUFLO01BRXBCLElBQUksQ0FBQ0MsR0FBRyxHQUFHWCxJQUFJLENBQUNXLEdBQUc7TUFDbkIsSUFBSSxDQUFDTixLQUFLLEdBQUdM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