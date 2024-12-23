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
      network["native"](prox + videodata.url, function (data) {
        _this.extractDataKinopubvideos(data);
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

      //URL = "https://www.geojs.io/";

      //prox = "https://cors-anywhere.herokuapp.com/";

      /*console.log("URL:", prox + URL);
      jQuery.ajax({
          url: prox + URL,
          type: 'GET',
          timeout: 20000,
          beforeSend: (test) => {
              console.log("test:", test);
          },
          success: (result) => {
              //console.log("MedS:", result.length);
              //console.log("MedS:", result);
              //console.log("MedS:", result.indexOf('720p'));   
              //console.log("MedS:", this);             
              this.buildKinopubStartSeite(result);  
          }
          , error: (error) => {    
              console.log("MediazoneE:", error);
          }
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

      //html.append($('<iframe src="https://corsproxy.io/?key=aabd9b6f&url=https://kinopub.me/" title="test"></iframe>'));

      this.activity.loader(false);
      return this.render();
    };
    this.buildKinopubStartSeite = function (str) {
      var _this2 = this;
      console.log("MedS:", "NEWWWWWWWWWWWWWWWWWWWWWW");
      str = str.replace(/\n/g, '');
      //console.log("Str:", str);
      var data = [];
      console.log("MedS:", str.indexOf('b-topnav__item'));
      var start = str.indexOf('<li class="b-topnav__item');
      var end = str.indexOf('</div>', start);
      var tetst = str.substring(start, end);
      console.log("MedS:", tetst);
      var containerArray = str.match('<li class="b-topnav__item(.*?)</div>.*?</li>');
      console.log("MedS:", containerArray);
      //containerArray = [];
      containerArray.forEach(function (elementContainer) {
        console.log("MedS:", elementContainer);
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
      var itemData = [];
      itemData.push({
        title: 'Title 1',
        image: 'https://static.hdrezka.ac/i/2024/12/23/n5c756bfcfe95ck25r12l.png',
        url: 'https://static.hdrezka.ac/i/2024/12/23/n5c756bfcfe95ck25r12l.png',
        component: 'kinopubvideos'
      });
      data.push({
        kategorie: "Kino",
        items: itemData
      });
      console.log("MedS:", "scroll.minus()");
      scroll.minus();
      html.append(scroll.render());
      data.forEach(function (element) {
        _this2.append({
          title: element.kategorie,
          results: element.items
        });
      });
      console.log("MedS:", data);
      this.activity.loader(false);
      this.activity.toggle();
      console.log("MedS:", "Ende");
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