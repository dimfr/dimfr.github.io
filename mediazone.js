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
      network.clear();

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
        // headers: headers
      });
      return this.render();
    };
    this.buildKinopubStartSeite = function (str) {
      var _this2 = this;
      str = str.replace(/\n/g, '');
      var data = [];
      var containerArray = str.matchAll('<li class="b-topnav__item(.*?)</div>.*?</li>');
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWF6b25lLmpzIiwic291cmNlcyI6WyJtZWRpYXpvbmUvaXRlbS5qcyIsIm1lZGlhem9uZS9saW5lLmpzIiwibWVkaWF6b25lL3N0YXJ0LmpzIiwibWVkaWF6b25lL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJtZWRpYXpvbmUvcGFyc2Vycy9raW5vcHViL2tpbm9wdWJ2aWRlb3MuanMiLCJtZWRpYXpvbmUvbGlzdHZpZXcuanMiLCJtZWRpYXpvbmUvcGFyc2Vycy9raW5vcHViL2tpbm9wdWJ2aWRlb29iamVjdC5qcyIsIm1lZGlhem9uZS9wYXJzZXJzL2tpbm9wdWIva2lub3B1YnZpZGVvZGV0YWlsLmpzIiwibWVkaWF6b25lL3BhcnNlcnMva2lub3B1Yi9raW5vcHViLmpzIiwibWVkaWF6b25lL21lZGlhem9uZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpdGVtKGRhdGEpe1xyXG4gICAgbGV0IGl0ZW0gPSBMYW1wYS5UZW1wbGF0ZS5nZXQoJ21lZGlhem9uZV9pdGVtJyx7XHJcbiAgICAgICAgbmFtZTogZGF0YS50aXRsZVxyXG4gICAgfSlcclxuXHJcbiAgICBsZXQgaW1nID0gaXRlbS5maW5kKCdpbWcnKVswXVxyXG5cclxuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpbWcuc3JjID0gJy4vaW1nL2ltZ19icm9rZW4uc3ZnJ1xyXG4gICAgfVxyXG5cclxuICAgIGltZy5zcmMgPSBkYXRhLmltYWdlO1xyXG5cclxuICAgIHRoaXMudXJsID0gZGF0YS51cmw7XHJcbiAgICB0aGlzLnRpdGxlID0gZGF0YS50aXRsZTtcclxuICAgIHRoaXMuY29tcG9uZW50ID0gZGF0YS5jb21wb25lbnQ7XHJcblxyXG4gICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaW1nLm9uZXJyb3IgPSAoKT0+e31cclxuICAgICAgICBpbWcub25sb2FkID0gKCk9Pnt9XHJcblxyXG4gICAgICAgIGltZy5zcmMgPSAnJ1xyXG5cclxuICAgICAgICBpdGVtLnJlbW92ZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGl0ZW0iLCJpbXBvcnQgSXRlbSBmcm9tICcuL2l0ZW0nXHJcblxyXG5mdW5jdGlvbiBjcmVhdGUoZGF0YSwgcGFyYW1zID0ge30pe1xyXG4gICAgbGV0IGNvbnRlbnQgPSBMYW1wYS5UZW1wbGF0ZS5nZXQoJ2l0ZW1zX2xpbmUnLHt0aXRsZTogZGF0YS50aXRsZX0pXHJcbiAgICBsZXQgYm9keSAgICA9IGNvbnRlbnQuZmluZCgnLml0ZW1zLWxpbmVfX2JvZHknKVxyXG4gICAgbGV0IHNjcm9sbCAgPSBuZXcgTGFtcGEuU2Nyb2xsKHtob3Jpem9udGFsOnRydWUsIHZlcnRpY2FsOiB0cnVlLCBzdGVwOjMwMH0pXHJcbiAgICBsZXQgaXRlbXMgICA9IFtdXHJcbiAgICBsZXQgYWN0aXZlICA9IDBcclxuICAgIGxldCBsYXN0O1xyXG4gICBcclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzY3JvbGwucmVuZGVyKCkuZmluZCgnLnNjcm9sbF9fYm9keScpLmFkZENsYXNzKCdtZWRpYXpvbmUtaXRlbWxpc3QtY2VudGVyJylcclxuXHJcbiAgICAgICAgY29udGVudC5maW5kKCcuaXRlbXMtbGluZV9fdGl0bGUnKS50ZXh0KGRhdGEudGl0bGUpXHJcblxyXG4gICAgICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKHRoaXMuYXBwZW5kSXRlbS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICBsZXQgdGVzdCA9IFwiMFwiO1xyXG5cclxuICAgICAgICBib2R5LmFwcGVuZChzY3JvbGwucmVuZGVyKCkpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHBlbmRJdGVtID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgSXRlbShlbGVtZW50KVxyXG5cclxuICAgICAgICBpdGVtLnJlbmRlcigpLm9uKCdob3Zlcjpmb2N1cycsKCk9PntcclxuICAgICAgICAgICAgbGFzdCA9IGl0ZW0ucmVuZGVyKClbMF07XHJcbiAgICAgICAgICAgIGFjdGl2ZSA9IGl0ZW1zLmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSwgdHJ1ZSlcclxuICAgICAgICB9KS5vbignaG92ZXI6ZW50ZXInLCgpPT57XHJcbiAgICAgICAgICAgIExhbXBhLkFjdGl2aXR5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBpdGVtLnVybCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBpdGVtLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiBpdGVtLmNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzY3JvbGwuYXBwZW5kKGl0ZW0ucmVuZGVyKCkpXHJcblxyXG4gICAgICAgIGl0ZW1zLnB1c2goaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci5hZGQoJ21lZGlhem9uZV9saW5lJyx7XHJcbiAgICAgICAgICAgIHRvZ2dsZTogKCk9PntcclxuICAgICAgICAgICAgICAgIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvblNldChzY3JvbGwucmVuZGVyKCkpXHJcbiAgICAgICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLmNvbGxlY3Rpb25Gb2N1cyhsYXN0IHx8IGZhbHNlLHNjcm9sbC5yZW5kZXIoKSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmlnaHQ6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBOYXZpZ2F0b3IubW92ZSgncmlnaHQnKVxyXG5cclxuICAgICAgICAgICAgICAgIExhbXBhLkNvbnRyb2xsZXIuZW5hYmxlKCdtZWRpYXpvbmVfbGluZScpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZnQ6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZihOYXZpZ2F0b3IuY2FubW92ZSgnbGVmdCcpKSBOYXZpZ2F0b3IubW92ZSgnbGVmdCcpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRoaXMub25MZWZ0KSB0aGlzLm9uTGVmdCgpXHJcbiAgICAgICAgICAgICAgICBlbHNlIExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKCdtZW51JylcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZG93bjogdGhpcy5vbkRvd24sXHJcbiAgICAgICAgICAgIHVwOiAgIHRoaXMub25VcCxcclxuICAgICAgICAgICAgZ29uZTogKCk9PntcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhY2s6IHRoaXMub25CYWNrXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ21lZGlhem9uZV9saW5lJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpXHJcblxyXG4gICAgICAgIGNvbnRlbnQucmVtb3ZlKClcclxuXHJcbiAgICAgICAgaXRlbXMgPSBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZSIsImltcG9ydCBMaW5lIGZyb20gJy4vbGluZSdcclxuXHJcbmZ1bmN0aW9uIGNvbXBvbmVudCgpe1xyXG4gICAgbGV0IG5ldHdvcmsgPSBuZXcgTGFtcGEuUmVndWVzdCgpXHJcbiAgICBsZXQgc2Nyb2xsICA9IG5ldyBMYW1wYS5TY3JvbGwoe21hc2s6dHJ1ZSxvdmVyOiB0cnVlfSlcclxuICAgIGxldCBpdGVtcyAgID0gW11cclxuICAgIGxldCBodG1sICAgID0gJCgnPGRpdj48L2Rpdj4nKVxyXG4gICAgbGV0IGFjdGl2ZSAgPSAwXHJcblxyXG4gICAgbGV0IHNpdGVzID0gW107XHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0tpbm9wdWInLFxyXG4gICAgICAgIGNvbXBvbmVudDogJ2tpbm9wdWJjb21wb25lbnQnLFxyXG4gICAgICAgIHVybDogJ2h0dHBzOi8va2lub3B1Yi5tZS8nLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzEwOTE4MDc0NDgzNTUyMjk2OTcvU2dkb191MmpfNDAweDQwMC5qcGcnXHJcbiAgICB9KTtcclxuXHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0ZpbG1peCcsXHJcbiAgICAgICAgY29tcG9uZW50OiAna2lub3B1YmNvbXBvbmVudCcsXHJcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9maWxtaXguZm0vJyxcclxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vZmlsbWl4LmFjL3RlbXBsYXRlcy9GaWxtaXgvbWVkaWEvaW1nL2ZpbG1peC5wbmcnXHJcbiAgICB9KTtcclxuXHJcbiAgICBzaXRlcy5wdXNoKHtcclxuICAgICAgICB0aXRsZTogJ0tpbm9rb25nJyxcclxuICAgICAgICBjb21wb25lbnQ6ICdraW5vcHViY29tcG9uZW50JyxcclxuICAgICAgICB1cmw6ICdodHRwczovL2tpbm9rb25nLnByby8nLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9raW5va29uZy5wcm8vdGVtcGxhdGVzL3NtYXJ0cGhvbmUva2sucG5nJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKHRydWUpXHJcblxyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJ1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIC8qbmV0d29yay5uYXRpdmUocHJveCArICdodHRwOi8vbG9jYWxob3N0OjMwMDAvcGx1Z2lucy9zdGF0aW9ucy5qc29uJywgdGhpcy5idWlsZC5iaW5kKHRoaXMpLCgpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpXHJcblxyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydFxyXG5cclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpXHJcbiAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzY3JvbGwubWludXMoKVxyXG5cclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpXHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiS2lub1wiLFxyXG4gICAgICAgICAgICByZXN1bHRzOiBzaXRlc1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qZGF0YS5yZXN1bHQuZ2VucmUuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBkYXRhLnJlc3VsdC5zdGF0aW9ucy5maWx0ZXIoc3RhdGlvbj0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRpb24uZ2VucmUuZmlsdGVyKGdlbnJlPT5nZW5yZS5pZCA9PSBlbGVtZW50LmlkKS5sZW5ndGhcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtZW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzOiByZXN1bHRzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkqL1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2aXR5LmxvYWRlcihmYWxzZSlcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS50b2dnbGUoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwZW5kID0gZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBuZXcgTGluZShlbGVtZW50KVxyXG5cclxuICAgICAgICBpdGVtLmNyZWF0ZSgpXHJcblxyXG4gICAgICAgIGl0ZW0ub25Eb3duICA9IHRoaXMuZG93bi5iaW5kKHRoaXMpXHJcbiAgICAgICAgaXRlbS5vblVwICAgID0gdGhpcy51cC5iaW5kKHRoaXMpXHJcbiAgICAgICAgaXRlbS5vbkJhY2sgID0gdGhpcy5iYWNrLmJpbmQodGhpcylcclxuXHJcbiAgICAgICAgc2Nyb2xsLmFwcGVuZChpdGVtLnJlbmRlcigpKVxyXG5cclxuICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb3duID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUrK1xyXG5cclxuICAgICAgICBhY3RpdmUgPSBNYXRoLm1pbihhY3RpdmUsIGl0ZW1zLmxlbmd0aCAtIDEpXHJcblxyXG4gICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuXHJcbiAgICAgICAgc2Nyb2xsLnVwZGF0ZShpdGVtc1thY3RpdmVdLnJlbmRlcigpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXAgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGFjdGl2ZS0tXHJcblxyXG4gICAgICAgIGlmKGFjdGl2ZSA8IDApe1xyXG4gICAgICAgICAgICBhY3RpdmUgPSAwXHJcblxyXG4gICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnaGVhZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkJhY2tncm91bmQuaW1tZWRpYXRlbHkoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBWkNBWUFBQUJEMkd4bEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFIQVNVUkJWSGdCbFphTHJzTWdERU5YeEFmMy85WEhGZFhOWkxtMllaSFF5bVBrNENTMDI3N3Y5K2ZmcnV0NjJuRWNuL004bnpiNjljeGo2bGUxKzc1Zi9ScXJaOWZhdG0zRjl3d01SN3loYXdpbE5rZTRHaXMvN2o5c3JRYmRhVkZCbmtjUTFXcmZnbUlJQmNUcnZncXFzS2lUenZwT1FiVW5BeWtWVzRWVnFaWHl5RGxsWUZTS3g5UWFWck83bkdKSUI2M2crRkFxL3hoY0hXQllkd0NzbUF0dkZaVUtFME1sVlpXQ1Q0aWRPbHloVHAzSzM1Ui82TnpscTB1Qm5zS1dsRXpnU2gxVkdKeHY2cm1wWE1PN0VLK1hXVVBuREZSV3FpdFFGZVkyVXlaVnJ5dVdsSTh1bExnR2YxOUZvb0FVd0M5Z0NXTGN3eldQYjdXYTYwcWRsWnhqeDZvb1V1VXFWUXNLK3kxVm9BSnlCZUpBVnNMSmVZbWcvUklYZEcya1Bod1lQQlVRUXlZRjBYQzhsd1AzTVRDcllBWEI4ODU1NnBlQ2JVVVpWN1djY3drVVFmQ1pDNFBYZEE1aEtoU1ZoeXRoWnFqWk0wSjM5dzVtOEJSYWRLQWNyc0lwTlpzTElZZE9xY1o5aEV4aFoxTUgrUUwrY2lGelh6bVloWnIvTTZ5VVV3cDJkcDVVNG5hWkR3QUY1SlJTZWZkU2NKWjNTa1Uwbmw4eHBhQXkrN21sMUVxdk1YU3MxSFJyWjliYzNlWlVTWG1HYS9tZHlqYm1xeVg3QTlSYVlRYTlJUkowQUFBQUFFbEZUa1N1UW1DQycpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoTGFtcGEuQWN0aXZpdHkuYWN0aXZlKCkuYWN0aXZpdHkgIT09IHRoaXMuYWN0aXZpdHkpIHJldHVyblxyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmQoKVxyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLmFkZCgnY29udGVudCcse1xyXG4gICAgICAgICAgICB0b2dnbGU6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmFjazogdGhpcy5iYWNrXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2NvbnRlbnQnKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBodG1sXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKClcclxuXHJcbiAgICAgICAgTGFtcGEuQXJyYXlzLmRlc3Ryb3koaXRlbXMpXHJcblxyXG4gICAgICAgIHNjcm9sbC5kZXN0cm95KClcclxuXHJcbiAgICAgICAgaHRtbC5yZW1vdmUoKVxyXG5cclxuICAgICAgICBpdGVtcyA9IG51bGxcclxuICAgICAgICBuZXR3b3JrID0gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQiLCJmdW5jdGlvbiBpbml0KCl7XHJcbiAgICBMYW1wYS5UZW1wbGF0ZS5hZGQoJ21lZGlhem9uZV9pdGVtJyxgPGRpdiBjbGFzcz1cInNlbGVjdG9yIG1lZGlhem9uZS1pdGVtXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhem9uZS1pdGVtX19pbWdib3hcIj5cclxuICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhem9uZS1pdGVtX19pbWdcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWF6b25lLWl0ZW1fX25hbWVcIj57bmFtZX08L2Rpdj5cclxuICAgIDwvZGl2PmApO1xyXG5cclxuICAgIExhbXBhLlRlbXBsYXRlLmFkZCgnbWVkaWF6b25lX3N0eWxlJyxgPHN0eWxlPlxyXG4gICAgICAgIC5tZWRpYXpvbmVsaW5lLmZvY3VzIHtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBjb2xvcjogIzAwMDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDAuMzNlbTtcclxuICAgICAgICAgIHBhZGRpbmc6IDAuM2VtIDFlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLm1lZGlhem9uZWxpbmVjb250YWluZXJ7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB3aWR0aDogNTBlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLm1lZGlhem9uZWxpbmV7XHJcbiAgICAgICAgICBwYWRkaW5nLXRvcDogMC4zZW07XHJcbiAgICAgICAgICBmb250LXNpemU6IDEuM2VtO1xyXG4gICAgICAgIH1cclxuICAgICAgICAubWVkaWF6b25lLWl0ZW0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMTVlbTtcclxuICAgICAgICAgICAgLXdlYmtpdC1mbGV4LXNocmluazogMDtcclxuICAgICAgICAgICAgICAgIC1tcy1mbGV4LW5lZ2F0aXZlOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLm1lZGlhem9uZS1pdGVtX19pbWdib3gge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjM0UzRTNFO1xyXG4gICAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogODMlO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICAgICAgIC1tb3otYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMC4zZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW1fX2ltZyB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLm1lZGlhem9uZS1pdGVtX19uYW1lIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxLjFlbTtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC44ZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW0uZm9jdXMgLm1lZGlhem9uZS1pdGVtX19pbWdib3g6YWZ0ZXIge1xyXG4gICAgICAgICAgICBib3JkZXI6IHNvbGlkIDAuMjZlbSAjZmZmO1xyXG4gICAgICAgICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICBsZWZ0OiAtMC41ZW07XHJcbiAgICAgICAgICAgIHRvcDogIC0wLjVlbTtcclxuICAgICAgICAgICAgcmlnaHQ6ICAtMC41ZW07XHJcbiAgICAgICAgICAgIGJvdHRvbTogIC0xLjVlbTtcclxuICAgICAgICAgICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgICAgICAgLW1vei1ib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwLjhlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC5tZWRpYXpvbmUtaXRlbSArIC5tZWRpYXpvbmUtaXRlbSB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAxZW07XHJcbiAgICAgICAgICB9ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAubWVkaWF6b25lLWl0ZW1saXN0LWNlbnRlcntcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgIDwvc3R5bGU+YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXRcclxufSIsImltcG9ydCBMaW5lIGZyb20gJy4uLy4uL2xpbmUnXHJcblxyXG5mdW5jdGlvbiBjb21wb25lbnQoZGF0YSl7XHJcbiAgICBsZXQgdmlkZW9kYXRhID0gZGF0YTtcclxuICAgIGxldCBuZXR3b3JrID0gbmV3IExhbXBhLlJlZ3Vlc3QoKTtcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KTtcclxuICAgIGxldCBodG1sICAgID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgIGxldCBib2R5ID0gJCgnPGRpdiBjbGFzcz1cImNhdGVnb3J5LWZ1bGxcIj48L2Rpdj4nKTtcclxuICAgIGxldCBsYXN0ID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKHRydWUpO1xyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJztcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXIgPSBbXTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCJ9KTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiOiBcInRydWVcIn0pO1xyXG4gICAgICAgIGhlYWRlci5wdXNoKHtcIkFjY2Vzcy1Db250cm9sLU1heC1BZ2VcIjogXCIxODAwXCJ9KTtcclxuICAgICAgICBoZWFkZXIucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiY29udGVudC10eXBlXCJ9KTtcclxuXHJcbiAgICAgICAgbmV0d29yay5uYXRpdmUocHJveCArIHZpZGVvZGF0YS51cmwsKGRhdGEpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZXh0cmFjdERhdGFLaW5vcHVidmlkZW9zKGRhdGEpO1xyXG4gICAgICAgIH0sKGEsYyk9PntcclxuICAgICAgICAgICAgbGV0IGVtcHR5ID0gbmV3IExhbXBhLkVtcHR5KClcclxuXHJcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kKGVtcHR5LnJlbmRlcigpKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGFydCA9IGVtcHR5LnN0YXJ0XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LmxvYWRlcihmYWxzZSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdHkudG9nZ2xlKClcclxuICAgICAgICB9LGZhbHNlLHtcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgaGVhZGVyOiBoZWFkZXJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmV4dHJhY3REYXRhS2lub3B1YnZpZGVvcyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgc2Nyb2xsLm1pbnVzKClcclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICAgIGxldCBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgnPGRpdiBjbGFzcz1cImItY29udGVudF9faW5saW5lX2l0ZW0uKj88aW1nIHNyYz1cIiguKj8pXCIuKj88ZGl2IGNsYXNzPVwiYi1jb250ZW50X19pbmxpbmVfaXRlbS1saW5rLio/aHJlZj1cIiguKj8pXCI+KC4qPyk8L2E+Jyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHRpdGVsOiBlbGVtZW50Q29udGFpbmVyWzNdLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBlbGVtZW50Q29udGFpbmVyWzJdLFxyXG4gICAgICAgICAgICAgICAgaW1nOiBlbGVtZW50Q29udGFpbmVyWzFdLFxyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgY2FyZCA9IExhbXBhLlRlbXBsYXRlLmdldChcImNhcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1lbnQudGl0ZWwsXHJcbiAgICAgICAgICAgICAgICByZWxlYXNlX3llYXI6IFwiXCJcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IGltZyA9IGNhcmQuZmluZChcIi5jYXJkX19pbWdcIilbMF07XHJcbiAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuYWRkQ2xhc3MoXCJjYXJkLS1sb2FkZWRcIik7XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgaW1nLnNyYyA9IGVsZW1lbnQuaW1nO1xyXG5cclxuICAgICAgICAgICAgICBjYXJkLm9uKFwiaG92ZXI6Zm9jdXNcIiwgKGZ1bmN0aW9uICgpIHsgXHJcbiAgICAgICAgICAgICAgICBsYXN0ID0gY2FyZFswXSwgXHJcbiAgICAgICAgICAgICAgICBzY3JvbGwudXBkYXRlKGNhcmQsICEwKX0pKTtcclxuXHJcbiAgICAgICAgICAgICAgY2FyZC5vbihcImhvdmVyOmhvdmVyXCIsIChmdW5jdGlvbiAoKSB7IFxyXG4gICAgICAgICAgICAgICAgbGFzdCA9IGNhcmRbMF0gXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICBjYXJkLm9uKCdob3ZlcjplbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIExhbXBhLkFjdGl2aXR5LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogZWxlbWVudC51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAna2lub3B1YnZpZGVvZGV0YWlsJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbWVudC50aXRlbCxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZWxlbWVudC5pbWdcclxuICAgICAgICAgICAgICAgIH0pICAgICAgICAgICAgICAgICAgICAgXHJcblx0XHRcdFx0ICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYm9keS5hcHBlbmQoY2FyZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoYm9keSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgIH0gIFxyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQmFja2dyb3VuZC5pbW1lZGlhdGVseSgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUFaQ0FZQUFBQkQyR3hsQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUhBU1VSQlZIZ0JsWmFMcnNNZ0RFTlh4QWYzLzlYSEZkWE5aTG0yWVpIUXltUGs0Q1MwMjc3djkrZmZydXQ2Mm5FY24vTThuemI2OWN4ajZsZTErNzVmL1Jxclo5ZmF0bTNGOXd3TVI3eWhhd2lsTmtlNEdpcy83ajlzclFiZGFWRkJua2NRMVdyZmdtSUlCY1RydmdxcXNLaVR6dnBPUWJVbkF5a1ZXNFZWcVpYeXlEbGxZRlNLeDlRYVZyTzduR0pJQjYzZytGQXEveGhjSFdCWWR3Q3NtQXR2RlpVS0UwTWxWWldDVDRpZE9seWhUcDNLMzVSLzZOemxxMHVCbnNLV2xFemdTaDFWR0p4djZybXBYTU83RUsrWFdVUG5ERlJXcWl0UUZlWTJVeVpWcnl1V2xJOHVsTGdHZjE5Rm9vQVV3QzlnQ1dMY3d6V1BiN1dhNjBxZGxaeGp4Nm9vVXVVcVZRc0sreTFWb0FKeUJlSkFWc0xKZVltZy9SSVhkRzJrUGh3WVBCVVFReVlGMFhDOGx3UDNNVENyWUFYQjg4NTU2cGVDYlVVWlY3V2Njd2tVUWZDWkM0UFhkQTVoS2hTVmh5dGhacWpaTTBKMzl3NW04QlJhZEtBY3JzSXBOWnNMSVlkT3FjWjloRXhoWjFNSCtRTCtjaUZ6WHptWWhaci9NNnlVVXdwMmRwNVU0bmFaRHdBRjVKUlNlZmRTY0paM1NrVTBubDh4cGFBeSs3bWwxRXF2TVhTczFIUnJaOWJjM2VaVVNYbUdhL21keWpibXF5WDdBOVJhWVFhOUlSSjBBQUFBQUVsRlRrU3VRbUNDJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKFwiY29udGVudFwiLCB7XHJcblx0ICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQ29udHJvbGxlci5jb2xsZWN0aW9uU2V0KHNjcm9sbC5yZW5kZXIoKSksIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvbkZvY3VzKGxhc3QgfHwgITEsIHNjcm9sbC5yZW5kZXIoKSk7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgbGVmdDogZnVuY3Rpb24gbGVmdCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJsZWZ0XCIpID8gTmF2aWdhdG9yLm1vdmUoXCJsZWZ0XCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJtZW51XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIHJpZ2h0OiBmdW5jdGlvbiByaWdodCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJyaWdodFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwicmlnaHRcIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImNvbnRlbnRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgdXA6IGZ1bmN0aW9uIHVwKCkge1xyXG5cdCAgICAgICAgICBOYXZpZ2F0b3IuY2FubW92ZShcInVwXCIpID8gTmF2aWdhdG9yLm1vdmUoXCJ1cFwiKSA6IExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKFwiaGVhZFwiKTtcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICBkb3duOiBmdW5jdGlvbiBkb3duKCkge1xyXG5cdCAgICAgICAgICBOYXZpZ2F0b3IuY2FubW92ZShcImRvd25cIikgPyBOYXZpZ2F0b3IubW92ZShcImRvd25cIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImNvbnRlbnRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgYmFjazogZnVuY3Rpb24gYmFjaygpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQWN0aXZpdHkuYmFja3dhcmQoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICB9KTtcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2NvbnRlbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbmV0d29yay5jbGVhcigpO1xyXG5cclxuICAgICAgICAvL0xhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICBodG1sLnJlbW92ZSgpO1xyXG4gIFxyXG4gICAgICAgIG5ldHdvcmsgPSBudWxsO1xyXG4gICAgICAgIHZpZGVvZGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudCIsImZ1bmN0aW9uIGxpc3R2aWV3KCl7XHJcbiAgICB0aGlzLm9uRW50ZXIgPSBmdW5jdGlvbigpe307XHJcbiAgICB0aGlzLm9uRm9jdXMgPSBmdW5jdGlvbigpe307XHJcblxyXG4gICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwibWVkaWF6b25lbGluZWNvbnRhaW5lclwiPjwvZGl2PicpO1xyXG5cclxuICAgIHRoaXMuY3JlYXRlTGlzdHZpZXcgPSBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgZGF0YS5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGluZSA9ICQoJzxkaXYgY2xhc3M9XCJtZWRpYXpvbmVsaW5lIHNlbGVjdG9yXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChsaW5lKTtcclxuICAgIFxyXG4gICAgICAgICAgICBsaW5lLm9uKCdob3ZlcjplbnRlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25FbnRlcihpdGVtKTsgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxpbmUub24oXCJob3Zlcjpmb2N1c1wiLCAoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZvY3VzKGxpbmUpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQobGluZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGltZy5vbmVycm9yID0gKCk9Pnt9XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpPT57fVxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsaXN0dmlldyIsImZ1bmN0aW9uIGtpbm9wdWJ2aWRlb29iamVjdCgpe1xyXG4gICAgdGhpcy52aWRlb3MgPSBbXTtcclxuICAgIHRoaXMudHJhbnNsYXRvcnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLmdldFNlc29ucyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHNlc29ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNlc29ucy5pbmRleE9mKGVsZW1lbnQuZGF0YV9zZWFzb25faWQpIDwgMCl7XHJcbiAgICAgICAgICAgICAgICBzZXNvbnMucHVzaChlbGVtZW50LmRhdGFfc2Vhc29uX2lkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2Vzb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VHJhbnNsYXRvcnNEYXRhID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgaXRlbXM6IFtdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdG9ycy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkXHJcbiAgICAgICAgICAgIH0pOyBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXNvbnNDb3VudCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2Vzb25zKCkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0U2Vzb25zRGF0YSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBzZXNvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpZGVvcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBpZihzZXNvbnMuaW5kZXhPZihlbGVtZW50LmRhdGFfc2Vhc29uX2lkKSA8IDApe1xyXG4gICAgICAgICAgICAgICAgc2Vzb25zLnB1c2goZWxlbWVudC5kYXRhX3NlYXNvbl9pZCk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn0KHQtdC30L7QvSAnICsgZWxlbWVudC5kYXRhX3NlYXNvbl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudC5kYXRhX3NlYXNvbl9pZFxyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0U2VyaWVuRGF0YUZvclNlc29uID0gZnVuY3Rpb24oc2Vzb25pZCl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKHNlc29uaWQgPT0gZWxlbWVudC5kYXRhX3NlYXNvbl9pZCl7XHJcbiAgICAgICAgICAgICAgICBkYXRhLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtZW50LnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50LmRhdGFfZXBpc29kZV9pZFxyXG4gICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaXNGaWxtTW9kZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmlkZW9zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVsZW1lbnQuc3RyZWFtcyAhPSB1bmRlZmluZWQgJiYgZWxlbWVudC5zdHJlYW1zICE9IFwiXCIpe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBraW5vcHVidmlkZW9vYmplY3QiLCJpbXBvcnQgTGluZSBmcm9tICcuLi8uLi9saW5lJ1xyXG5pbXBvcnQgTGlzdHZpZXcgZnJvbSAnLi4vLi4vbGlzdHZpZXcnXHJcbmltcG9ydCBLaW5vcHVidmlkZW9vYmplY3QgZnJvbSAnLi9raW5vcHVidmlkZW9vYmplY3QnXHJcblxyXG5mdW5jdGlvbiBjb21wb25lbnRraW5vcHVidmlkZW9kZXRhaWwoZGF0YSl7XHJcbiAgICBsZXQgbmV0d29yayA9IG5ldyBMYW1wYS5SZWd1ZXN0KClcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KVxyXG4gICAgbGV0IGl0ZW1zICAgPSBbXVxyXG4gICAgbGV0IGh0bWwgICAgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgbGV0IGFjdGl2ZSAgPSAwO1xyXG4gICAgbGV0IHZpZGVvZGF0YSA9IGRhdGE7XHJcbiAgICBcclxuICAgIHRoaXMudG9SZXBsYWNlID0gWyckJCEhQCQkQF4hQCMkJEAnLCAnQEBAQEAhIyMhXl5eJywgJyMjIyNeISEjIyFAQCcsICdeXl4hQCMjISEjIycsICckJCMhIUAjIUAjIyddO1xyXG4gICAgdGhpcy5maWxlc2VwYXJhdG9yID0gJ1xcXFwvXFxcXC9fXFxcXC9cXFxcLyc7XHJcbiAgICB0aGlzLm1vZGUgPSAnc2Vzb24nO1xyXG4gICAgdGhpcy5raW5vcHVidmlkZW9vYmplY3QgPSBuZXcgS2lub3B1YnZpZGVvb2JqZWN0KCk7XHJcbiAgICB0aGlzLmxpc3R2aWV3ID0gbmV3IExpc3R2aWV3KCk7XHJcbiAgICB0aGlzLmxhc3RTZWxlY3RlZFNlc29uID0gXCIxXCI7XHJcbiAgXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIodHJ1ZSk7XHJcblxyXG4gICAgICAgIGxldCBwcm94ICA9IExhbXBhLlBsYXRmb3JtLmlzKCd3ZWJvcycpIHx8IExhbXBhLlBsYXRmb3JtLmlzKCd0aXplbicpIHx8IExhbXBhLlN0b3JhZ2UuZmllbGQoJ3Byb3h5X290aGVyJykgPT09IGZhbHNlID8gJycgOiAnJztcclxuICAgICAgICBuZXR3b3JrLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIG5ldHdvcmsubmF0aXZlKHByb3ggKyB2aWRlb2RhdGEudXJsLChkYXRhKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkS2lub3B1YnZpZGVvZGV0YWlscyhkYXRhKTtcclxuICAgICAgICB9LChhLGMpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpXHJcblxyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydFxyXG5cclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpXHJcbiAgICAgICAgfSxmYWxzZSx7XHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCdcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkS2lub3B1YnZpZGVvZGV0YWlscyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL1xcbi9nLCcnKTtcclxuICAgICAgICBzY3JvbGwubWludXMoKTtcclxuICAgICAgICBodG1sLmFwcGVuZChzY3JvbGwucmVuZGVyKCkpO1xyXG5cclxuICAgICAgICBsZXQgY2FyZCA9IExhbXBhLlRlbXBsYXRlLmdldChcImZ1bGxfc3RhcnRfbmV3XCIpO1xyXG5cclxuICAgICAgICAvLyBQb3N0ZXJcclxuICAgICAgICBsZXQgaW1nID0gY2FyZC5maW5kKFwiLmZ1bGwtLXBvc3RlclwiKVswXTtcclxuICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7fTtcclxuICAgICAgICBpbWcuc3JjID0gdmlkZW9kYXRhLmltYWdlOyAgICAgICAgXHJcbiAgICAgICAgY2FyZC5maW5kKFwiLmZ1bGwtc3RhcnQtbmV3X19wb3N0ZXJcIikuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xyXG5cclxuICAgICAgICAvLyBUaXRsZVxyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fdGl0bGVcIikudGV4dCh2aWRlb2RhdGEudGl0bGUpO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gVGFnbGluZVxyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fdGFnbGluZVwiKS5oaWRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRGVzY3JpcHRpb25cclxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBzdHIubWF0Y2goJzxkaXYgY2xhc3M9XCJiLXBvc3RfX2Rlc2NyaXB0aW9uX3RleHRcIj4oLio/KTwvZGl2PicpO1xyXG4gICAgICAgIGNhcmQuZmluZChcIi5mdWxsLXN0YXJ0LW5ld19fZGV0YWlsc1wiKS50ZXh0KGRlc2NyaXB0aW9uWzFdKTtcclxuXHJcbiAgICAgICAgY2FyZC5maW5kKFwiLmJ1dHRvbi0tcGxheVwiKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIGNhcmQuZmluZChcIi5idXR0b24tLXJlYWN0aW9uXCIpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgLy9jYXJkLmZpbmQoXCIuYnV0dG9uLS1ib29rXCIpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAgIC8vIFJhdGluZ1xyXG4gICAgICAgIGNhcmQuZmluZCgnLnJhdGUtLXRtZGInKS5oaWRlKCk7XHJcbiAgICAgICAgbGV0IHJhdGluZ0ltYmQgPSBzdHIubWF0Y2goJzxzcGFuIGNsYXNzPVwiYi1wb3N0X19pbmZvX3JhdGVzIGltZGJcIj4uKj9jbGFzcz1cImJvbGRcIj4oLio/KTwvc3Bhbj4nKTtcclxuICAgICAgICBpZihyYXRpbmdJbWJkICYmIHJhdGluZ0ltYmQubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIGxldCByYXRpbmdFbGVtZW50ID0gY2FyZC5maW5kKFwiLnJhdGUtLWltZGJcIik7XHJcbiAgICAgICAgICAgIGlmKHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKVswXS50ZXh0KHJhdGluZ0ltYmRbMV0pXHJcbiAgICAgICAgICAgICAgICByYXRpbmdFbGVtZW50LnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByYXRpbmdLUCA9IHN0ci5tYXRjaCgnPHNwYW4gY2xhc3M9XCJiLXBvc3RfX2luZm9fcmF0ZXMga3BcIj4uKj9jbGFzcz1cImJvbGRcIj4oLio/KTwvc3Bhbj4nKTtcclxuICAgICAgICBpZihyYXRpbmdLUCAmJiByYXRpbmdLUC5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgbGV0IHJhdGluZ0VsZW1lbnQgPSBjYXJkLmZpbmQoXCIucmF0ZS0ta3BcIik7XHJcbiAgICAgICAgICAgIGlmKHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIHJhdGluZ0VsZW1lbnQuY2hpbGRyZW4oKVswXS50ZXh0KHJhdGluZ0tQWzFdKVxyXG4gICAgICAgICAgICAgICAgcmF0aW5nRWxlbWVudC5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoY2FyZCk7XHJcblxyXG4gICAgICAgIHRoaXMua2lub3B1YnZpZGVvb2JqZWN0LnZpZGVvcyA9IHRoaXMuZ2V0VmlkZW9zKHN0cik7XHJcbiAgICAgICAgdGhpcy5raW5vcHVidmlkZW9vYmplY3QudHJhbnNsYXRvcnMgPSB0aGlzLmdldFRyYW5zbGF0b3JzKHN0cik7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2Vzb25zRGF0YSgpO1xyXG4gICAgICAgIC8qaWYoZGF0YS5pdGVtcy5sZW5ndGggPCAxKXtcclxuICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3Nlcmllbic7XHJcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC5nZXRTZXJpZW5EYXRhRm9yU2Vzb24oJzEnKTtcclxuICAgICAgICB9ICAqLyAgICBcclxuICAgICAgICBpZih0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC5pc0ZpbG1Nb2RlKCkpe1xyXG4gICAgICAgICAgICB0aGlzLmtpbm9wdWJ2aWRlb29iamVjdC52aWRlb3MuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldFZpZGVvRGF0YUxpbmtzRnJvbUhhc2goZWxlbWVudC5zdHJlYW1zKTtcclxuICAgICAgICAgICAgfSk7ICBcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGEpO1xyXG4gICAgICAgIHRoaXMubGlzdHZpZXcub25FbnRlciA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGl0ZW0uc3RyZWFtVXJsICE9IHVuZGVmaW5lZCAmJiBpdGVtLnN0cmVhbVVybCAhPSAnJyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBpdGVtLnRpdGxlLCBcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGl0ZW0uc3RyZWFtVXJsIFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8vdmlkZW9bJ2lwdHYnXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGxheWxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIHBsYXlsaXN0LnB1c2goeyB0aXRsZTogaXRlbS50aXRsZSwgdXJsOiBpdGVtLnN0cmVhbVVybCB9KVxyXG4gICAgICAgICAgICAgICAgdmlkZW9bJ3BsYXlsaXN0J10gPSBwbGF5bGlzdDtcclxuICAgICAgICAgICAgICAgIExhbXBhLlBsYXllci5wbGF5KHZpZGVvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5tb2RlID09ICdzZXNvbicpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzZXJpZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhUyA9IHRoaXMua2lub3B1YnZpZGVvb2JqZWN0LmdldFNlcmllbkRhdGFGb3JTZXNvbihpdGVtLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGFTKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZFNlc29uID0gaXRlbS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5tb2RlID09ICdzZXJpZW4nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAndHJhbnNsYXRvcic7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0VHJhbnNsYXRvcnNEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0dmlldy5jcmVhdGVMaXN0dmlldyhkYXRhUyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0dmlldy5vbkZvY3VzID0gKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgc2Nyb2xsLnVwZGF0ZShsaW5lLCAhMClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC5hcHBlbmQoIHRoaXMubGlzdHZpZXcucmVuZGVyKCkpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkubG9hZGVyKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFZpZGVvRGF0YUxpbmtzRnJvbUhhc2ggPSBmdW5jdGlvbihoYXNoKXtcclxuICAgICAgICBsZXQgaGFzaFdlcnQgPSBoYXNoLnN1YnN0cmluZygyLCBoYXNoLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy50b1JlcGxhY2UuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgaGFzaFdlcnQgPSBoYXNoV2VydC5yZXBsYWNlKHRoaXMuZmlsZXNlcGFyYXRvciArIGIxKGVsZW1lbnQpLCBcIlwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGxpbmtzU3RyaW5nO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxpbmtzU3RyaW5nID0gYjIoaGFzaFdlcnQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbGlua3NTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxpbmtzU3RyaW5nLnNwbGl0KCcsJykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgbGV0IHF1YWxpdHkgPSBnZXRRdWFsaXR5KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBsZXQgZm9yUmVwbGFjZSA9ICgnWycgKyBxdWFsaXR5ICsgJ10nKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRPaG5lUXVhbGl0eSA9IGVsZW1lbnQucmVwbGFjZShmb3JSZXBsYWNlLCAnJylcclxuICAgICAgICAgICAgZWxlbWVudE9obmVRdWFsaXR5LnNwbGl0KCcgb3IgJykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmxmb3JtYXQgPSBpdGVtLmluZGV4T2YoJy5tM3U4JykgPiAwID8gXCJtM3U4XCIgOiBcIm1wNFwiO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5pdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJyAoJyArIHF1YWxpdHkgKyAnLCAnICsgdXJsZm9ybWF0ICsgJyknLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbVVybDogaXRlbS5yZXBsYWNlQWxsKCcgJywgJycpXHJcbiAgICAgICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRRdWFsaXR5KGlucHV0U3RyKXtcclxuICAgICAgICBsZXQgc3RhcnQgPSBpbnB1dFN0ci5pbmRleE9mKCdbJyk7XHJcbiAgICAgICAgbGV0IGVuZCA9IGlucHV0U3RyLmluZGV4T2YoJ10nKTtcclxuICAgICAgICByZXR1cm4gaW5wdXRTdHIuc3Vic3RyaW5nKHN0YXJ0KzEsIGVuZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGIxKHN0cikge1xyXG4gICAgICAgIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoXCIweFwiICsgcDEpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGIyKHN0cikge1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihzdHIpLnNwbGl0KFwiXCIpLm1hcChmdW5jdGlvbihjKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIiVcIiArIChcIjAwXCIgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XHJcbiAgICAgICAgfSkuam9pbihcIlwiKSk7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICB0aGlzLmdldFZpZGVvcyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgbGV0IHZpZGVvcyA9IFtdOyAgICAgICAgXHJcbiAgICAgICAgbGV0IGhhc1ZpZGVvcyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgndWwgaWQ9XCJzaW1wbGUtZXBpc29kZXMoLio/KTwvdWw+Jyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyQXJyYXkgPSBlbGVtZW50Q29udGFpbmVyWzFdLm1hdGNoQWxsKCc8bGkgY2xhc3MuKj9kYXRhLWlkPVwiKC4qPylcIi4qP2RhdGEtc2Vhc29uX2lkPVwiKC4qPylcIi4qP2RhdGEtZXBpc29kZV9pZD1cIiguKj8pXCI+KC4qPyk8L2xpPicpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50Q29udGFpbmVyLmxlbmd0aCA+IDQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb3MucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2lkOiBlbGVtZW50Q29udGFpbmVyWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV9zZWFzb25faWQ6IGVsZW1lbnRDb250YWluZXJbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2VwaXNvZGVfaWQ6IGVsZW1lbnRDb250YWluZXJbM10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbWVudENvbnRhaW5lcls0XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBoYXNWaWRlb3MgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKCFoYXNWaWRlb3Mpe1xyXG4gICAgICAgICAgICBsZXQgY29udGFpbmVyQXJyYXkgPSBzdHIubWF0Y2hBbGwoJ1wic3RyZWFtc1wiLio/XCIoLio/KVwiLCcpO1xyXG4gICAgICAgICAgICBjb250YWluZXJBcnJheS5mb3JFYWNoKGVsZW1lbnRDb250YWluZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lci5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICB2aWRlb3MucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbXM6IGVsZW1lbnRDb250YWluZXJbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfaWQ6ICcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aWRlb3M7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRUcmFuc2xhdG9ycyA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0b3JzID0gW107XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lckFycmF5ID0gc3RyLm1hdGNoQWxsKCdpbml0Q0ROU2VyaWVzRXZlbnRzKC4qPyksIGZhbHNlJyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXIgPSBlbGVtZW50Q29udGFpbmVyWzFdLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICBpZihhci5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFyWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnVHJhbnNsYXRvcidcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXJBcnJheSA9IHN0ci5tYXRjaEFsbCgnPGRpdiBjbGFzcz1cImItdHJhbnNsYXRvcnNfX2Jsb2NrKC4qPyliLXBvc3RfX3dhaXRfc3RhdHVzJyk7XHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudENvbnRhaW5lclsxXSl7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJBcnJheSA9IGVsZW1lbnRDb250YWluZXJbMV0ubWF0Y2hBbGwoJzx1bCBpZD1cInRyYW5zbGF0b3JzLWxpc3RcIiBjbGFzcz1cImItdHJhbnNsYXRvcnNfX2xpc3RcIj4oLio/KTwvdWw+Jyk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJBcnJheS5mb3JFYWNoKGVsZW1lbnRDb250YWluZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnRDb250YWluZXJbMV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnRhaW5lckFycmF5ID0gZWxlbWVudENvbnRhaW5lclsxXS5tYXRjaEFsbCgnZGF0YS10cmFuc2xhdG9yX2lkPVwiKC4qPylcIj4oLio/KTwvbGk+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckFycmF5ID0gZWxlbWVudENvbnRhaW5lclsxXS5tYXRjaEFsbCgnZGF0YS10cmFuc2xhdG9yX2lkPVwiKC4qPylcIi4qPz4oLio/KTwvbGk+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckFycmF5LmZvckVhY2goZWxlbWVudENvbnRhaW5lciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50Q29udGFpbmVyLmxlbmd0aCA+IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0b3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZWxlbWVudENvbnRhaW5lclsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudENvbnRhaW5lclsyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2xhdG9ycztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKFwiY29udGVudFwiLCB7XHJcblx0ICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuXHQgICAgICAgICAgTGFtcGEuQ29udHJvbGxlci5jb2xsZWN0aW9uU2V0KHNjcm9sbC5yZW5kZXIoKSksIExhbXBhLkNvbnRyb2xsZXIuY29sbGVjdGlvbkZvY3VzKCExLCBzY3JvbGwucmVuZGVyKCkpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGxlZnQ6IGZ1bmN0aW9uIGxlZnQoKSB7XHJcblx0ICAgICAgICAgIE5hdmlnYXRvci5jYW5tb3ZlKFwibGVmdFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwibGVmdFwiKSA6IExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKFwibWVudVwiKTtcclxuXHQgICAgICAgIH0sXHJcblx0ICAgICAgICByaWdodDogZnVuY3Rpb24gcmlnaHQoKSB7XHJcblx0ICAgICAgICAgIE5hdmlnYXRvci5jYW5tb3ZlKFwicmlnaHRcIikgPyBOYXZpZ2F0b3IubW92ZShcInJpZ2h0XCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJjb250ZW50XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIHVwOiBmdW5jdGlvbiB1cCgpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJ1cFwiKSA/IE5hdmlnYXRvci5tb3ZlKFwidXBcIikgOiBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZShcImhlYWRcIik7XHJcblx0ICAgICAgICB9LFxyXG5cdCAgICAgICAgZG93bjogZnVuY3Rpb24gZG93bigpIHtcclxuXHQgICAgICAgICAgTmF2aWdhdG9yLmNhbm1vdmUoXCJkb3duXCIpID8gTmF2aWdhdG9yLm1vdmUoXCJkb3duXCIpIDogTGFtcGEuQ29udHJvbGxlci50b2dnbGUoXCJjb250ZW50XCIpO1xyXG5cdCAgICAgICAgfSxcclxuXHQgICAgICAgIGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMubW9kZSA9PSAnc2VyaWVuJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2Vzb25zRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGFTLml0ZW1zLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc2Vzb24nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3R2aWV3LmNyZWF0ZUxpc3R2aWV3KGRhdGFTKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5tb2RlID09ICd0cmFuc2xhdG9yJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGFTID0gdGhpcy5raW5vcHVidmlkZW9vYmplY3QuZ2V0U2VyaWVuRGF0YUZvclNlc29uKHRoaXMubGFzdFNlbGVjdGVkU2Vzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGFTLml0ZW1zLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc2VyaWVuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0dmlldy5jcmVhdGVMaXN0dmlldyhkYXRhUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTGFtcGEuQWN0aXZpdHkuYmFja3dhcmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgfVx0ICAgICAgICAgICAgXHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgfSk7XHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKCdjb250ZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5leHRyYWN0RGF0YSA9ICBmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgIGxldCBleHRyYWN0ID0ge307XHJcbiAgICAgICAgZXh0cmFjdC52b2ljZSAgID0gW11cclxuICAgICAgICBleHRyYWN0LnNlYXNvbiAgPSBbXVxyXG4gICAgICAgIGV4dHJhY3QuZXBpc29kZSA9IFtdXHJcblxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXG4vZywnJylcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lckFycmF5ID0gc3RyLm1hdGNoQWxsKCc8bGkgY2xhc3M9XCJiLXRvcG5hdl9faXRlbSguKj8pPC9kaXY+Lio/PC9saT4nKVxyXG4gICAgICAgIGNvbnRhaW5lckFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlYmVuZXRvcCA9IGVsZW1lbnRbMF0ubWF0Y2hBbGwoJzxhIGNsYXNzPVwiYi10b3BuYXZfX2l0ZW0uKj8gaHJlZj1cIiguKj8pXCI+KC4qPyk8JylcclxuICAgICAgICAgICAgZWJlbmV0b3AuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB2b2ljZXMgPSBzdHIubWF0Y2goJzxzZWxlY3QgbmFtZT1cInRyYW5zbGF0b3JcIltePl0rPiguKj8pPC9zZWxlY3Q+JylcclxuICAgICAgICBsZXQgc2Vzb25zID0gc3RyLm1hdGNoKCc8c2VsZWN0IG5hbWU9XCJzZWFzb25cIltePl0rPiguKj8pPC9zZWxlY3Q+JylcclxuICAgICAgICBsZXQgZXBpc29kID0gc3RyLm1hdGNoKCc8c2VsZWN0IG5hbWU9XCJlcGlzb2RlXCJbXj5dKz4oLio/KTwvc2VsZWN0PicpXHJcblxyXG4gICAgICAgIGlmKHNlc29ucyl7XHJcbiAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKCc8c2VsZWN0Picrc2Vzb25zWzFdKyc8L3NlbGVjdD4nKVxyXG5cclxuICAgICAgICAgICAgJCgnb3B0aW9uJyxzZWxlY3QpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGV4dHJhY3Quc2Vhc29uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAkKHRoaXMpLmF0dHIoJ3ZhbHVlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJCh0aGlzKS50ZXh0KClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2b2ljZXMpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnPHNlbGVjdD4nK3ZvaWNlc1sxXSsnPC9zZWxlY3Q+JylcclxuXHJcbiAgICAgICAgICAgICQoJ29wdGlvbicsc2VsZWN0KS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG9rZW4gPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdG9rZW4nKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRva2VuKXtcclxuICAgICAgICAgICAgICAgICAgICBleHRyYWN0LnZvaWNlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICQodGhpcykudGV4dCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJCh0aGlzKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlcGlzb2Qpe1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnPHNlbGVjdD4nK2VwaXNvZFsxXSsnPC9zZWxlY3Q+JylcclxuXHJcbiAgICAgICAgICAgICQoJ29wdGlvbicsc2VsZWN0KS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBleHRyYWN0LmVwaXNvZGUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICQodGhpcykuYXR0cigndmFsdWUnKSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAkKHRoaXMpLnRleHQoKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iYWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBMYW1wYS5BY3Rpdml0eS5iYWNrd2FyZCgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kb3duID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBhY3RpdmUrK1xyXG5cclxuICAgICAgICBhY3RpdmUgPSBNYXRoLm1pbihhY3RpdmUsIGl0ZW1zLmxlbmd0aCAtIDEpXHJcblxyXG4gICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuXHJcbiAgICAgICAgc2Nyb2xsLnVwZGF0ZShpdGVtc1thY3RpdmVdLnJlbmRlcigpKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXAgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGFjdGl2ZS0tXHJcblxyXG4gICAgICAgIGlmKGFjdGl2ZSA8IDApe1xyXG4gICAgICAgICAgICBhY3RpdmUgPSAwXHJcblxyXG4gICAgICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnaGVhZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJhY2tncm91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIExhbXBhLkJhY2tncm91bmQuaW1tZWRpYXRlbHkoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBWkNBWUFBQUJEMkd4bEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFIQVNVUkJWSGdCbFphTHJzTWdERU5YeEFmMy85WEhGZFhOWkxtMllaSFF5bVBrNENTMDI3N3Y5K2ZmcnV0NjJuRWNuL004bnpiNjljeGo2bGUxKzc1Zi9ScXJaOWZhdG0zRjl3d01SN3loYXdpbE5rZTRHaXMvN2o5c3JRYmRhVkZCbmtjUTFXcmZnbUlJQmNUcnZncXFzS2lUenZwT1FiVW5BeWtWVzRWVnFaWHl5RGxsWUZTS3g5UWFWck83bkdKSUI2M2crRkFxL3hoY0hXQllkd0NzbUF0dkZaVUtFME1sVlpXQ1Q0aWRPbHloVHAzSzM1Ui82TnpscTB1Qm5zS1dsRXpnU2gxVkdKeHY2cm1wWE1PN0VLK1hXVVBuREZSV3FpdFFGZVkyVXlaVnJ5dVdsSTh1bExnR2YxOUZvb0FVd0M5Z0NXTGN3eldQYjdXYTYwcWRsWnhqeDZvb1V1VXFWUXNLK3kxVm9BSnlCZUpBVnNMSmVZbWcvUklYZEcya1Bod1lQQlVRUXlZRjBYQzhsd1AzTVRDcllBWEI4ODU1NnBlQ2JVVVpWN1djY3drVVFmQ1pDNFBYZEE1aEtoU1ZoeXRoWnFqWk0wSjM5dzVtOEJSYWRLQWNyc0lwTlpzTElZZE9xY1o5aEV4aFoxTUgrUUwrY2lGelh6bVloWnIvTTZ5VVV3cDJkcDVVNG5hWkR3QUY1SlJTZWZkU2NKWjNTa1Uwbmw4eHBhQXkrN21sMUVxdk1YU3MxSFJyWjliYzNlWlVTWG1HYS9tZHlqYm1xeVg3QTlSYVlRYTlJUkowQUFBQUFFbEZUa1N1UW1DQycpXHJcbiAgICB9XHJcblxyXG4gICAvKiB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCgpXHJcblxyXG4gICAgICAgIExhbXBhLkNvbnRyb2xsZXIuYWRkKCdjb250ZW50Jyx7XHJcbiAgICAgICAgICAgIHRvZ2dsZTogKCk9PntcclxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbYWN0aXZlXS50b2dnbGUoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYWNrOiB0aGlzLmJhY2tcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLnRvZ2dsZSgnY29udGVudCcpXHJcbiAgICB9Ki9cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbmV0d29yay5jbGVhcigpXHJcblxyXG4gICAgICAgIExhbXBhLkFycmF5cy5kZXN0cm95KGl0ZW1zKVxyXG5cclxuICAgICAgICBzY3JvbGwuZGVzdHJveSgpXHJcblxyXG4gICAgICAgIGh0bWwucmVtb3ZlKClcclxuXHJcbiAgICAgICAgaXRlbXMgPSBudWxsXHJcbiAgICAgICAgbmV0d29yayA9IG51bGxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50a2lub3B1YnZpZGVvZGV0YWlsXHJcbiIsImltcG9ydCBMaW5lIGZyb20gJy4uLy4uL2xpbmUnXHJcbmltcG9ydCBraW5vcHVidmlkZW9zIGZyb20gJy4va2lub3B1YnZpZGVvcydcclxuaW1wb3J0IGtpbm9wdWJ2aWRlb2RldGFpbCBmcm9tICcuL2tpbm9wdWJ2aWRlb2RldGFpbCdcclxuLy9pbXBvcnQgcHVwcGV0ZWVyIGZyb20gJ3B1cHBldGVlcic7XHJcbi8vaW1wb3J0IHJlcXVpcmUgZnJvbSAncmVxdWlyZSdcclxuXHJcblxyXG5mdW5jdGlvbiBpbml0Q29tcG9uZW50cygpIHtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJjb21wb25lbnQnLCBjb21wb25lbnRraW5vcHViKTtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJ2aWRlb3MnLCBraW5vcHVidmlkZW9zKTtcclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ2tpbm9wdWJ2aWRlb2RldGFpbCcsIGtpbm9wdWJ2aWRlb2RldGFpbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBvbmVudGtpbm9wdWIoKXsgICAgXHJcbiAgICBsZXQgbmV0d29yayA9IG5ldyBMYW1wYS5SZWd1ZXN0KClcclxuICAgIGxldCBzY3JvbGwgID0gbmV3IExhbXBhLlNjcm9sbCh7bWFzazp0cnVlLG92ZXI6IHRydWV9KVxyXG4gICAgbGV0IFVSTCA9IFwiaHR0cHM6Ly9raW5vcHViLm1lL1wiO1xyXG4gICAgbGV0IExvZ29VcmwgPSBcImh0dHBzOi8va2lub3B1Yi5tZS90ZW1wbGF0ZXMvaGRyZXprYS9pbWFnZXMvaGRyZXprYS1sb2dvLnBuZ1wiO1xyXG4gICAgbGV0IGl0ZW1zICAgPSBbXVxyXG4gICAgbGV0IGh0bWwgICAgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgbGV0IGFjdGl2ZSAgPSAwO1xyXG4gICBcclxuLy9sYW1wYS5teC9tc3gvc3RhcnQuanNvblxyXG4gICAgdGhpcy50ZXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBwdXBwZXRlZXIubGF1bmNoKCkudGhlbihhc3luYyBicm93c2VyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHBhZ2UuZ290byhVUkwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCByZXNwb25zZS50ZXh0KCkpO1xyXG4gICAgICAgICAgICBhd2FpdCBicm93c2VyLmNsb3NlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIodHJ1ZSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgcHJveCAgPSBMYW1wYS5QbGF0Zm9ybS5pcygnd2Vib3MnKSB8fCBMYW1wYS5QbGF0Zm9ybS5pcygndGl6ZW4nKSB8fCBMYW1wYS5TdG9yYWdlLmZpZWxkKCdwcm94eV9vdGhlcicpID09PSBmYWxzZSA/ICcnIDogJyc7XHJcbiAgICAgICAgcHJveCA9IFwiaHR0cHM6Ly9wcm94eS5jb3JzZml4LmNvbS8/XCI7XHJcbiAgICAgICAgLy9wcm94ID0gXCJodHRwczovLzE5NC40NC4zNi4xMTQ6Njg2OC8/XCJcclxuICAgICAgICBwcm94ID0gXCJodHRwczovL2NvcnNwcm94eS5pby8/a2V5PWFhYmQ5YjZmJnVybD1cIlxyXG4gICAgICAgIG5ldHdvcmsuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXHJcbiAgICAgICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtTWF4LUFnZVwiOiBcIjE4MDBcIixcclxuICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6IFwiKlwiLFxyXG4gICAgICAgICAgICBcIkFjY2VwdFwiOiAndGV4dC9odG1sLGFwcGxpY2F0aW9uL3hodG1sK3htbCxhcHBsaWNhdGlvbi94bWw7cT0wLjksaW1hZ2UvYXZpZixpbWFnZS93ZWJwLGltYWdlL2FwbmcsKi8qO3E9MC44LGFwcGxpY2F0aW9uL3NpZ25lZC1leGNoYW5nZTt2PWIzO3E9MC43JyxcclxuICAgICAgICAgICAgXCJBY2NlcHQtRW5jb2RpbmdcIjogJ2d6aXAsIGRlZmxhdGUsIGJyLCB6c3RkJyxcclxuICAgICAgICAgICAgXCJBY2NlcHQtTGFuZ3VhZ2VcIjogJ2RlLURFLGRlO3E9MC45LGVuLVVTO3E9MC44LGVuO3E9MC43JyxcclxuICAgICAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6ICdtYXgtYWdlPTAnLFxyXG4gICAgICAgICAgICBcIkNvbm5lY3Rpb25cIjogJ2tlZXAtYWxpdmUnLFxyXG4gICAgICAgICAgICBcIkhvc3RcIjogJ2tpbm9wdWIubWUnLFxyXG4gICAgICAgICAgICBcIlNlYy1TaC1VYVwiOiAnXCJHb29nbGUgQ2hyb21lXCI7dj1cIjEzMVwiLCBcIkNocm9taXVtXCI7dj1cIjEzMVwiLCBcIk5vdF9BIEJyYW5kXCI7dj1cIjI0XCInLFxyXG4gICAgICAgICAgICBcIlNlYy1DaC1VYS1Nb2JpbGVcIjogXCI/MFwiLFxyXG4gICAgICAgICAgICBcIlNlYy1DaC1VYS1QbGF0Zm9ybVwiOiAnXCJXaW5kb3dzXCInLFxyXG4gICAgICAgICAgICBcIlNlYy1GZXRjaC1EZXN0XCI6ICdkb2N1bWVudCcsXHJcbiAgICAgICAgICAgIFwiU2VjLUZldGNoLU1vZGVcIjogJ25hdmlnYXRlJyxcclxuICAgICAgICAgICAgXCJTZWMtRmV0Y2gtU2l0ZVwiOiAnbm9uZScsXHJcbiAgICAgICAgICAgIFwiU2VjLUZldGNoLVVzZXJcIjogJz8xJyxcclxuICAgICAgICAgICAgXCJ1cGdyYWRlLWluc2VjdXJlLXJlcXVlc3RzXCI6ICcxJyxcclxuICAgICAgICAgICAgXCJSZWZlcmVyXCI6IFwia2lub3B1Yi5tZVwiLFxyXG4gICAgICAgICAgICBcIk9yaWdpblwiOiBcImtpbm9wdWIubWVcIixcclxuICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCI6IFwiR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OU1wiLFxyXG4gICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNicsXHJcbiAgICAgICAgICAgICdDb29raWUnOidkbGVfdXNlcl90YWtlbj0xOyBkbGVfdXNlcl90b2tlbj01MmJhNzcyZmM0M2M4MzgwOTA5Nzc5NjZjMzE0YmViZTsgX3ltX3VpZD0xNzI3NTk2MjkzMjA1Mjk1NjI4OyBfeW1fZD0xNzI3NTk2MjkzOyBfeW1faXNhZD0yOyBQSFBTRVNTSUQ9Y2NscTNxMTZjZmtwaDIxc244aGE0MDZuNHMnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAvKiAgICAgIGhlYWRlcnMucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIn0pO1xyXG4gICAgICAgIGhlYWRlcnMucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiOiBcInRydWVcIn0pO1xyXG4gICAgICAgIGhlYWRlcnMucHVzaCh7XCJBY2Nlc3MtQ29udHJvbC1NYXgtQWdlXCI6IFwiMTgwMFwifSk7XHJcbiAgICAgICAgaGVhZGVycy5wdXNoKHtcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogXCIqXCJ9KTtcclxuXHJcbiAgICAgICAgXHJcbiovXHJcblxyXG4vLyB3aXRoIGhlYWRlcnMgb3ZlcnJpZGVcclxuLypmZXRjaChcImh0dHBzOi8vcHJveHkuY29yc2ZpeC5jb20vPzxUQVJHRVRfVVJMPlwiLCB7XHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgIFwieC1jb3JzZml4LWhlYWRlcnNcIjogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIFwiT3JpZ2luXCI6IFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbVwiLFxyXG4gICAgICAgIFwiUmVmZXJlclwiOiBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb21cIixcclxuICAgICAgfSksXHJcbiAgICB9LFxyXG4gIH0pOyovXHJcblxyXG4gICAgICAgIG5ldHdvcmsubmF0aXZlKHByb3ggKyBVUkwsKHN0cik9PntcclxuICAgICAgICAgICAgdGhpcy5idWlsZEtpbm9wdWJTdGFydFNlaXRlKHN0cilcclxuICAgICAgICB9LChhLGMpPT57XHJcbiAgICAgICAgICAgIGxldCBlbXB0eSA9IG5ldyBMYW1wYS5FbXB0eSgpO1xyXG4gICAgICAgICAgICBodG1sLmFwcGVuZChlbXB0eS5yZW5kZXIoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBlbXB0eS5zdGFydDtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpdml0eS5sb2FkZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2aXR5LnRvZ2dsZSgpO1xyXG4gICAgICAgIH0sZmFsc2Use1xyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgIC8vIGhlYWRlcnM6IGhlYWRlcnNcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkS2lub3B1YlN0YXJ0U2VpdGUgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXG4vZywnJylcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICBsZXQgY29udGFpbmVyQXJyYXkgPSBzdHIubWF0Y2hBbGwoJzxsaSBjbGFzcz1cImItdG9wbmF2X19pdGVtKC4qPyk8L2Rpdj4uKj88L2xpPicpXHJcbiAgICAgICAgY29udGFpbmVyQXJyYXkuZm9yRWFjaChlbGVtZW50Q29udGFpbmVyID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW1EYXRhID0gW107XHJcbiAgICAgICAgICAgIGxldCBlYmVuZXRvcCA9IGVsZW1lbnRDb250YWluZXJbMV0ubWF0Y2hBbGwoJzxhIGNsYXNzPVwiYi10b3BuYXZfX2l0ZW0uKj8gaHJlZj1cIiguKj8pXCI+KC4qPyk8Jyk7XHJcbiAgICAgICAgICAgIGxldCBrYXRlZ29yaWUgPSBcIiMjIyNcIjtcclxuICAgICAgICAgICAgZWJlbmV0b3AuZm9yRWFjaChpdGVtID0+e1xyXG4gICAgICAgICAgICAgICAga2F0ZWdvcmllID0gaXRlbVsyXVxyXG4gICAgICAgICAgICAgICAgaXRlbURhdGEucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGl0ZW1bMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IExvZ29VcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBVUkwgKyBpdGVtWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogJ2tpbm9wdWJ2aWRlb3MnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHN1YmViZW5lcmlnaHQgPSBlbGVtZW50Q29udGFpbmVyWzFdLm1hdGNoQWxsKCc8YSB0aXRsZT1cIiguKj8pXCIgaHJlZj1cIiguKj8pXCI+Jyk7XHJcbiAgICAgICAgICAgIHN1YmViZW5lcmlnaHQuZm9yRWFjaChpdGVtID0+e1xyXG4gICAgICAgICAgICAgICAgaXRlbURhdGEucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGl0ZW1bMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IExvZ29VcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBVUkwgKyBpdGVtWzJdLnJlcGxhY2UoJ3JlbD1cIm5vZm9sbG93JywgJycpLnJlcGxhY2UoJyAnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAna2lub3B1YnZpZGVvcydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdWJlYmVuZWxlZnQgPSBlbGVtZW50Q29udGFpbmVyWzFdLm1hdGNoQWxsKCdhIGhyZWY9XCIoLio/KVwiPiguKj8pPCcpO1xyXG4gICAgICAgICAgICBzdWJlYmVuZWxlZnQuZm9yRWFjaChpdGVtID0+e1xyXG4gICAgICAgICAgICAgICAgaXRlbURhdGEucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGl0ZW1bMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IExvZ29VcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBVUkwgKyBpdGVtWzFdLnJlcGxhY2UoJ3JlbD1cIm5vZm9sbG93JywgJycpLnJlcGxhY2UoJyAnLCAnJyksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAna2lub3B1YnZpZGVvcydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBrYXRlZ29yaWU6IGthdGVnb3JpZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBpdGVtRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2Nyb2xsLm1pbnVzKCk7XHJcbiAgICAgICAgaHRtbC5hcHBlbmQoc2Nyb2xsLnJlbmRlcigpKTtcclxuICAgICAgICBkYXRhLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtZW50LmthdGVnb3JpZSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IGVsZW1lbnQuaXRlbXNcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFjdGl2aXR5LmxvYWRlcihmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eS50b2dnbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFwcGVuZCA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG4gICAgICAgIGxldCBpdGVtID0gbmV3IExpbmUoZWxlbWVudClcclxuXHJcbiAgICAgICAgaXRlbS5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgaXRlbS5vbkRvd24gID0gdGhpcy5kb3duLmJpbmQodGhpcyk7XHJcbiAgICAgICAgaXRlbS5vblVwICAgID0gdGhpcy51cC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIGl0ZW0ub25CYWNrICA9IHRoaXMuYmFjay5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICBzY3JvbGwuYXBwZW5kKGl0ZW0ucmVuZGVyKCkpO1xyXG5cclxuICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYmFjayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQWN0aXZpdHkuYmFja3dhcmQoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG93biA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYWN0aXZlKys7XHJcbiAgICAgICAgYWN0aXZlID0gTWF0aC5taW4oYWN0aXZlLCBpdGVtcy5sZW5ndGggLSAxKTtcclxuICAgICAgICBpdGVtc1thY3RpdmVdLnRvZ2dsZSgpO1xyXG4gICAgICAgIHNjcm9sbC51cGRhdGUoaXRlbXNbYWN0aXZlXS5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYWN0aXZlLS07XHJcbiAgICAgICAgaWYoYWN0aXZlIDwgMCl7XHJcbiAgICAgICAgICAgIGFjdGl2ZSA9IDA7XHJcbiAgICAgICAgICAgIExhbXBhLkNvbnRyb2xsZXIudG9nZ2xlKCdoZWFkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY3JvbGwudXBkYXRlKGl0ZW1zW2FjdGl2ZV0ucmVuZGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYmFja2dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgTGFtcGEuQmFja2dyb3VuZC5pbW1lZGlhdGVseSgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUFaQ0FZQUFBQkQyR3hsQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUhBU1VSQlZIZ0JsWmFMcnNNZ0RFTlh4QWYzLzlYSEZkWE5aTG0yWVpIUXltUGs0Q1MwMjc3djkrZmZydXQ2Mm5FY24vTThuemI2OWN4ajZsZTErNzVmL1Jxclo5ZmF0bTNGOXd3TVI3eWhhd2lsTmtlNEdpcy83ajlzclFiZGFWRkJua2NRMVdyZmdtSUlCY1RydmdxcXNLaVR6dnBPUWJVbkF5a1ZXNFZWcVpYeXlEbGxZRlNLeDlRYVZyTzduR0pJQjYzZytGQXEveGhjSFdCWWR3Q3NtQXR2RlpVS0UwTWxWWldDVDRpZE9seWhUcDNLMzVSLzZOemxxMHVCbnNLV2xFemdTaDFWR0p4djZybXBYTU83RUsrWFdVUG5ERlJXcWl0UUZlWTJVeVpWcnl1V2xJOHVsTGdHZjE5Rm9vQVV3QzlnQ1dMY3d6V1BiN1dhNjBxZGxaeGp4Nm9vVXVVcVZRc0sreTFWb0FKeUJlSkFWc0xKZVltZy9SSVhkRzJrUGh3WVBCVVFReVlGMFhDOGx3UDNNVENyWUFYQjg4NTU2cGVDYlVVWlY3V2Njd2tVUWZDWkM0UFhkQTVoS2hTVmh5dGhacWpaTTBKMzl3NW04QlJhZEtBY3JzSXBOWnNMSVlkT3FjWjloRXhoWjFNSCtRTCtjaUZ6WHptWWhaci9NNnlVVXdwMmRwNVU0bmFaRHdBRjVKUlNlZmRTY0paM1NrVTBubDh4cGFBeSs3bWwxRXF2TVhTczFIUnJaOWJjM2VaVVNYbUdhL21keWpibXF5WDdBOVJhWVFhOUlSSjBBQUFBQUVsRlRrU3VRbUNDJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihMYW1wYS5BY3Rpdml0eS5hY3RpdmUoKS5hY3Rpdml0eSAhPT0gdGhpcy5hY3Rpdml0eSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCgpO1xyXG5cclxuICAgICAgICBMYW1wYS5Db250cm9sbGVyLmFkZCgnY29udGVudCcse1xyXG4gICAgICAgICAgICB0b2dnbGU6ICgpPT57XHJcbiAgICAgICAgICAgICAgICBpZihpdGVtcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2FjdGl2ZV0udG9nZ2xlKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmFjazogdGhpcy5iYWNrXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgTGFtcGEuQ29udHJvbGxlci50b2dnbGUoJ2NvbnRlbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24oKXsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCl7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGh0bWxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIG5ldHdvcmsuY2xlYXIoKTtcclxuICAgICAgICBMYW1wYS5BcnJheXMuZGVzdHJveShpdGVtcyk7XHJcbiAgICAgICAgc2Nyb2xsLmRlc3Ryb3koKTtcclxuICAgICAgICBodG1sLnJlbW92ZSgpO1xyXG4gICAgICAgIGl0ZW1zID0gbnVsbDtcclxuICAgICAgICBuZXR3b3JrID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgY29tcG9uZW50a2lub3B1YixcclxuICAgIGluaXRDb21wb25lbnRzXHJcbn1cclxuIiwiaW1wb3J0IGNvbXBvbmVudFN0YXJ0IGZyb20gJy4vc3RhcnQnO1xyXG5pbXBvcnQgVGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGVzL3RlbXBsYXRlcyc7XHJcbmltcG9ydCBraW5vcHViIGZyb20gJy4vcGFyc2Vycy9raW5vcHViL2tpbm9wdWInO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRQbHVnaW4oKSB7XHJcbiAgICB3aW5kb3cudmlld19wbHVnaW5fcmVhZHkgPSB0cnVlO1xyXG5cclxuICAgIExhbXBhLkNvbXBvbmVudC5hZGQoJ3N0YXJ0Y29tcG9uZW50JywgY29tcG9uZW50U3RhcnQpO1xyXG4gICAga2lub3B1Yi5pbml0Q29tcG9uZW50cygpO1xyXG4gICAgVGVtcGxhdGVzLmluaXQoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRTdGFydEJ1dHRvbigpe1xyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGA8bGkgY2xhc3M9XCJtZW51X19pdGVtIHNlbGVjdG9yXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZW51X19pY29cIj5cclxuICAgICAgICAgICAgICAgIDxzdmcgaGVpZ2h0PVwiNDRcIiB2aWV3Qm94PVwiMCAwIDQ0IDQ0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIyMVwiIGhlaWdodD1cIjIxXCIgcng9XCIyXCIgZmlsbD1cIndoaXRlXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGF0aC0yLWluc2lkZS0xXzE1NDoyNFwiIGZpbGw9XCJ3aGl0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIyXCIgeT1cIjI3XCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCIgcng9XCIyXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbWFzaz5cclxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMlwiIHk9XCIyN1wiIHdpZHRoPVwiMTdcIiBoZWlnaHQ9XCIxN1wiIHJ4PVwiMlwiIHN0cm9rZT1cIndoaXRlXCIgc3Ryb2tlLXdpZHRoPVwiNlwiIG1hc2s9XCJ1cmwoI3BhdGgtMi1pbnNpZGUtMV8xNTQ6MjQpXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIyN1wiIHk9XCIyXCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCIgcng9XCIyXCIgZmlsbD1cIndoaXRlXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIyN1wiIHk9XCIzNFwiIHdpZHRoPVwiMTdcIiBoZWlnaHQ9XCIzXCIgZmlsbD1cIndoaXRlXCI+PC9yZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIzNFwiIHk9XCI0NFwiIHdpZHRoPVwiMTdcIiBoZWlnaHQ9XCIzXCIgdHJhbnNmb3JtPVwicm90YXRlKC05MCAzNCA0NClcIiBmaWxsPVwid2hpdGVcIj48L3JlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZW51X190ZXh0XCI+TWVkaWF6b25lPC9kaXY+XHJcbiAgICAgICAgPC9saT5gKVxyXG5cclxuICAgICAgICBidXR0b24ub24oJ2hvdmVyOmVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBMYW1wYS5BY3Rpdml0eS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHVybDogJycsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ01lZGlhem9uZScsXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdzdGFydGNvbXBvbmVudCcsXHJcbiAgICAgICAgICAgICAgICBwYWdlOiAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgJCgnLm1lbnUgLm1lbnVfX2xpc3QnKS5lcSgwKS5hcHBlbmQoYnV0dG9uKTtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKExhbXBhLlRlbXBsYXRlLmdldCgnbWVkaWF6b25lX3N0eWxlJyx7fSx0cnVlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYod2luZG93LmFwcHJlYWR5KSBcclxuICAgICAgICBhZGRTdGFydEJ1dHRvbigpO1xyXG4gICAgZWxzZXtcclxuICAgICAgICBMYW1wYS5MaXN0ZW5lci5mb2xsb3coJ2FwcCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT0gJ3JlYWR5JykgXHJcbiAgICAgICAgICAgICAgICBhZGRTdGFydEJ1dHRvbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmlmKCF3aW5kb3cudmlld19wbHVnaW5fcmVhZHkpIHN0YXJ0UGx1Z2luKCkiXSwibmFtZXMiOlsiaXRlbSIsImRhdGEiLCJMYW1wYSIsIlRlbXBsYXRlIiwiZ2V0IiwibmFtZSIsInRpdGxlIiwiaW1nIiwiZmluZCIsIm9uZXJyb3IiLCJzcmMiLCJpbWFnZSIsInVybCIsImNvbXBvbmVudCIsInJlbmRlciIsInRvZ2dsZSIsImRlc3Ryb3kiLCJvbmxvYWQiLCJyZW1vdmUiLCJjcmVhdGUiLCJjb250ZW50IiwiYm9keSIsInNjcm9sbCIsIlNjcm9sbCIsImhvcml6b250YWwiLCJ2ZXJ0aWNhbCIsInN0ZXAiLCJpdGVtcyIsImFjdGl2ZSIsImxhc3QiLCJhZGRDbGFzcyIsInRleHQiLCJyZXN1bHRzIiwiZm9yRWFjaCIsImFwcGVuZEl0ZW0iLCJiaW5kIiwiYXBwZW5kIiwiZWxlbWVudCIsIkl0ZW0iLCJvbiIsImluZGV4T2YiLCJ1cGRhdGUiLCJBY3Rpdml0eSIsInB1c2giLCJwYWdlIiwiX3RoaXMiLCJDb250cm9sbGVyIiwiYWRkIiwiY29sbGVjdGlvblNldCIsImNvbGxlY3Rpb25Gb2N1cyIsInJpZ2h0IiwiTmF2aWdhdG9yIiwibW92ZSIsImVuYWJsZSIsImxlZnQiLCJjYW5tb3ZlIiwib25MZWZ0IiwiZG93biIsIm9uRG93biIsInVwIiwib25VcCIsImdvbmUiLCJiYWNrIiwib25CYWNrIiwiQXJyYXlzIiwibmV0d29yayIsIlJlZ3Vlc3QiLCJtYXNrIiwib3ZlciIsImh0bWwiLCIkIiwic2l0ZXMiLCJhY3Rpdml0eSIsImxvYWRlciIsIlBsYXRmb3JtIiwiaXMiLCJTdG9yYWdlIiwiZmllbGQiLCJidWlsZCIsIm1pbnVzIiwiTGluZSIsImJhY2t3YXJkIiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsImJhY2tncm91bmQiLCJCYWNrZ3JvdW5kIiwiaW1tZWRpYXRlbHkiLCJzdGFydCIsInBhdXNlIiwic3RvcCIsImNsZWFyIiwiaW5pdCIsInZpZGVvZGF0YSIsInByb3giLCJoZWFkZXIiLCJleHRyYWN0RGF0YUtpbm9wdWJ2aWRlb3MiLCJhIiwiYyIsImVtcHR5IiwiRW1wdHkiLCJkYXRhVHlwZSIsInN0ciIsImNvbnRhaW5lckFycmF5IiwibWF0Y2hBbGwiLCJlbGVtZW50Q29udGFpbmVyIiwidGl0ZWwiLCJjYXJkIiwicmVsZWFzZV95ZWFyIiwiZSIsImxpc3R2aWV3Iiwib25FbnRlciIsIm9uRm9jdXMiLCJjb250YWluZXIiLCJjcmVhdGVMaXN0dmlldyIsImxpbmUiLCJraW5vcHVidmlkZW9vYmplY3QiLCJ2aWRlb3MiLCJ0cmFuc2xhdG9ycyIsImdldFNlc29ucyIsInNlc29ucyIsImRhdGFfc2Vhc29uX2lkIiwiZ2V0VHJhbnNsYXRvcnNEYXRhIiwiaWQiLCJzZXNvbnNDb3VudCIsImdldFNlc29uc0RhdGEiLCJnZXRTZXJpZW5EYXRhRm9yU2Vzb24iLCJzZXNvbmlkIiwiZGF0YV9lcGlzb2RlX2lkIiwiaXNGaWxtTW9kZSIsInJlc3VsdCIsInN0cmVhbXMiLCJ1bmRlZmluZWQiLCJjb21wb25lbnRraW5vcHVidmlkZW9kZXRhaWwiLCJ0b1JlcGxhY2UiLCJmaWxlc2VwYXJhdG9yIiwibW9kZSIsIktpbm9wdWJ2aWRlb29iamVjdCIsIkxpc3R2aWV3IiwibGFzdFNlbGVjdGVkU2Vzb24iLCJidWlsZEtpbm9wdWJ2aWRlb2RldGFpbHMiLCJfdGhpczIiLCJyZXBsYWNlIiwiaGlkZSIsImRlc2NyaXB0aW9uIiwibWF0Y2giLCJyYXRpbmdJbWJkIiwicmF0aW5nRWxlbWVudCIsImNoaWxkcmVuIiwicmVtb3ZlQ2xhc3MiLCJyYXRpbmdLUCIsImdldFZpZGVvcyIsImdldFRyYW5zbGF0b3JzIiwiZ2V0VmlkZW9EYXRhTGlua3NGcm9tSGFzaCIsInN0cmVhbVVybCIsInZpZGVvIiwicGxheWxpc3QiLCJQbGF5ZXIiLCJwbGF5IiwiZGF0YVMiLCJoYXNoIiwiX3RoaXMzIiwiaGFzaFdlcnQiLCJzdWJzdHJpbmciLCJiMSIsImxpbmtzU3RyaW5nIiwiYjIiLCJzcGxpdCIsInF1YWxpdHkiLCJnZXRRdWFsaXR5IiwiZm9yUmVwbGFjZSIsImVsZW1lbnRPaG5lUXVhbGl0eSIsInVybGZvcm1hdCIsInJlcGxhY2VBbGwiLCJpbnB1dFN0ciIsImVuZCIsImJ0b2EiLCJlbmNvZGVVUklDb21wb25lbnQiLCJ0b1NvbGlkQnl0ZXMiLCJwMSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImF0b2IiLCJtYXAiLCJjaGFyQ29kZUF0IiwidG9TdHJpbmciLCJzbGljZSIsImpvaW4iLCJoYXNWaWRlb3MiLCJkYXRhX2lkIiwiYXIiLCJfdGhpczQiLCJleHRyYWN0RGF0YSIsImV4dHJhY3QiLCJ2b2ljZSIsInNlYXNvbiIsImVwaXNvZGUiLCJlYmVuZXRvcCIsImNvbnNvbGUiLCJsb2ciLCJ2b2ljZXMiLCJlcGlzb2QiLCJzZWxlY3QiLCJlYWNoIiwiYXR0ciIsInRva2VuIiwidmFsIiwiaW5pdENvbXBvbmVudHMiLCJDb21wb25lbnQiLCJjb21wb25lbnRraW5vcHViIiwia2lub3B1YnZpZGVvcyIsImtpbm9wdWJ2aWRlb2RldGFpbCIsIlVSTCIsIkxvZ29VcmwiLCJ0ZXN0IiwicHVwcGV0ZWVyIiwibGF1bmNoIiwidGhlbiIsIl9yZWYiLCJfYXN5bmNUb0dlbmVyYXRvciIsIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJtYXJrIiwiX2NhbGxlZSIsImJyb3dzZXIiLCJyZXNwb25zZSIsIndyYXAiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwicHJldiIsIm5leHQiLCJuZXdQYWdlIiwic2VudCIsInQwIiwidDEiLCJjYWxsIiwiY2xvc2UiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiYnVpbGRLaW5vcHViU3RhcnRTZWl0ZSIsIml0ZW1EYXRhIiwia2F0ZWdvcmllIiwic3ViZWJlbmVyaWdodCIsInN1YmViZW5lbGVmdCIsInN0YXJ0UGx1Z2luIiwid2luZG93Iiwidmlld19wbHVnaW5fcmVhZHkiLCJjb21wb25lbnRTdGFydCIsImtpbm9wdWIiLCJUZW1wbGF0ZXMiLCJhZGRTdGFydEJ1dHRvbiIsImJ1dHRvbiIsImVxIiwiYXBwcmVhZHkiLCJMaXN0ZW5lciIsImZvbGxvdyIsInR5cGUiXSwibWFwcGluZ3MiOiI7OztJQUFBLFNBQVNBLElBQUlBLENBQUNDLElBQUksRUFBQztNQUNmLElBQUlELElBQUksR0FBR0UsS0FBSyxDQUFDQyxRQUFRLENBQUNDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBQztRQUMzQ0MsSUFBSSxFQUFFSixJQUFJLENBQUNLO09BQ2QsQ0FBQztNQUVGLElBQUlDLEdBQUcsR0FBR1AsSUFBSSxDQUFDUSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BRTdCRCxHQUFHLENBQUNFLE9BQU8sR0FBRyxZQUFVO1FBQ3BCRixHQUFHLENBQUNHLEdBQUcsR0FBRyxzQkFBc0I7T0FDbkM7TUFFREgsR0FBRyxDQUFDRyxHQUFHLEdBQUdULElBQUksQ0FBQ1UsS0FBSztNQUVwQixJQUFJLENBQUNDLEdBQUcsR0FBR1gsSUFBSSxDQUFDVyxHQUFHO01BQ25CLElBQUksQ0FBQ04sS0FBSyxHQUFHTCxJQUFJLENBQUNLLEtBQUs7TUFDdkIsSUFBSSxDQUFDTyxTQUFTLEdBQUdaLElBQUksQ0FBQ1ksU0FBUztNQUUvQixJQUFJLENBQUNDLE1BQU0sR0FBRyxZQUFVO1FBQ3BCLE9BQU9kLElBQUk7T0FDZDtNQUVELElBQUksQ0FBQ2UsTUFBTSxHQUFHLFlBQVUsRUFFdkI7TUFFRCxJQUFJLENBQUNDLE9BQU8sR0FBRyxZQUFVO1FBQ3JCVCxHQUFHLENBQUNFLE9BQU8sR0FBRyxZQUFJLEVBQUU7UUFDcEJGLEdBQUcsQ0FBQ1UsTUFBTSxHQUFHLFlBQUksRUFBRTtRQUVuQlYsR0FBRyxDQUFDRyxHQUFHLEdBQUcsRUFBRTtRQUVa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