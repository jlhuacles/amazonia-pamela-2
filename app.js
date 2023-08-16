"use strict";

(function () {
  // JS //
  var ww = window.innerWidth,
    wh = window.innerHeight,
    currentST = 0,
    targetST = 0,
    up = false;
  var lang = document.documentElement.lang.substr(0, 2);

  var _events = {},
    _scrollEvents = [],
    _startEvents = [];
  

  // FUnctions
  var addScroll = function addScroll(func) {
    _scrollEvents.push({
      func: func
    });
  };
  var removeAllScrollEvents = function removeAllScrollEvents() {
    _scrollEvents = [];
  };
  var addStart = function addStart(func) {
    _startEvents.push({
      func: func
    });
  };
  var removeAllStartEvents = function removeAllStartEvents() {
    _startEvents = [];
  };
  function transformFunc(item, y) {
    var style = "translate(" + y + ")";
    item.style.transform = style;
    item.style.webkitTransform = style;
    item.style.mozTransform = style;
    item.style.msTransform = style;
    item.style.oTransform = style;
  }
  var fixedScrollFunction = function fixedScrollFunction(event) {
    _startEvents.forEach(function (e) {
      e.func();
    });
    targetST = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    targetST = parseFloat(targetST.toFixed(2));
    up = targetST < currentST;
    currentST = targetST;
    _scrollEvents.forEach(function (e) {
      e.func();
    });
  };

  // Tradução
 
  var traduz = function traduz(p) {
    var c = traducoes[p];
    return c && c[lang] ? c[lang] : p;
  };
  var comparaData = function comparaData(d) {
    var currentDate = new Date();
    var currentUtcDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()));
    var providedDate = new Date(d);
    return providedDate <= currentUtcDate;
  };
  var generalApp = {
    init: function init() {
      // Pros stickys
      var page = document.querySelector("#page");
      if (page) page.style.overflow = 'initial !important';

      //BTN RESPONSIVO
      var btnHamburguer = document.querySelector('.btn-hamburguer');
      if (btnHamburguer) btnHamburguer.onclick = function (e) {
        btnHamburguer.classList.toggle('opened');
        btnHamburguer.setAttribute('aria-expanded', btnHamburguer.classList.contains('opened'));
        document.querySelector('.menu-responsivo').classList.toggle('show-menu', btnHamburguer.classList.contains('opened'));
      };
      var btnLang = document.querySelector('.btn-lang');
      if (btnLang) btnLang.onclick = function (e) {
        btnLang.classList.toggle('opened');
        document.querySelector('.lang-opt').classList.toggle('show-lang', btnLang.classList.contains('opened'));
      };

      //tabs
      var tabWrapper = document.querySelectorAll(".tab-wrapper");
      if (tabWrapper.length) tabWrapper.forEach(function (tw) {
        var openTabBtn = tw.querySelectorAll("[data-tab]");
        var tabContent = tw.querySelectorAll(".tab-content");
        openTabBtn.forEach(function (button) {
          button.onclick = function (event) {
            tabContent.forEach(function (tab) {
              if (tab.classList.contains("is-visible")) {
                tab.classList.remove("is-visible");
              }
            });
            openTabBtn.forEach(function (btn) {
              if (btn.classList.contains("ativo")) {
                btn.classList.remove("ativo");
              }
            });
            button.classList.add("ativo");
            var tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add("is-visible");
          };
        });
      });

      // modal
      var openModalBtn = document.querySelectorAll("[data-modal]");
      if (openModalBtn.length) openModalBtn.forEach(function (button) {
        button.onclick = function (event) {
          var modalId = button.dataset.modal;
          document.getElementById(modalId).classList.toggle("is-visible");
          var any = document.querySelector('.modal.is-visible,.modalbase.is-visible');
          document.body.classList.toggle('scrollblocked', any);
        };
      });
      var closeModalBtn = document.querySelectorAll(".modal,.modalbase");
      if (closeModalBtn.length) closeModalBtn.forEach(function (b) {
        b.onclick = function (event) {
          if (['modal', 'modalbase', 'modalclose'].some(function (className) {
            return event.target.classList.contains(className);
          })) {
            b.classList.toggle("is-visible");
            var any = document.querySelector('.modal.is-visible,.modalbase.is-visible');
            document.body.classList.toggle('scrollblocked', any);
          }
        };
      });
      var storiesDiv = document.querySelector("#storiesdiv");
      if (storiesDiv) storiesDiv.addEventListener("wheel", function (evt) {
        var maxScrollLeft = storiesDiv.scrollWidth - storiesDiv.clientWidth;
        var isAtMaxHorizontalScroll = storiesDiv.scrollLeft === maxScrollLeft;
        if (isAtMaxHorizontalScroll && evt.deltaY > 0 || storiesDiv.scrollLeft == 0 && evt.deltaY < 0) {
          return;
        }
        evt.preventDefault();
        storiesDiv.scrollLeft += evt.deltaY;
      });
    }
  };


  // Parallax
  var parallaxApp = {
    itens: {},
    init: function init() {
      parallaxApp.itens = [];
      var containers = document.querySelectorAll('.parallaxContainer');
      containers.forEach(function (x, i) {
        parallaxApp.itens[i] = {
          y: x.offsetTop,
          h: x.clientHeight,
          ch: x.querySelectorAll('[data-fly]')
        };
        addScroll(function (e) {
          parallaxApp.itens.forEach(function (d) {
            if (currentST + wh > d.y && currentST < d.y + d.h) {
              var yy = currentST - d.y;
              var hh = yy / d.y;
              d.ch.forEach(function (z) {
                var f = '0,';
                if (z.dataset.flyx) f = Number(z.dataset.flyx) * hh + "%";
                f += ',' + Number(z.dataset.fly) * hh + "%";
                transformFunc(z, f);
              });
            }
          });
        });
      });
    }
  };
  var scrollytellingApp = {
    itens: {},
    init: function init() {
      scrollytellingApp.itens = [];
      var containers = document.querySelectorAll('.scrollytelling');
      if (containers.length) containers.forEach(function (x, i) {
        scrollytellingApp.itens[i] = {
          y: x.offsetTop,
          h: x.clientHeight,
          item: x,
          bgs: x.querySelectorAll('.bg'),
          stks: x.querySelector('.stks'),
          ch: x.querySelectorAll('.scrollytelling-inner'),
          cur: '0'
        };
        addScroll(function (e) {
          scrollytellingApp.itens.forEach(function (d) {
            if (currentST + wh > d.y && currentST < d.y + d.h) {
              var yy = currentST - d.y + wh / 2;
              var hh = Math.max(0, Math.min(d.ch.length, Math.ceil(yy / d.h * d.ch.length)) - 1);
              console.log(d.ch[hh].dataset.scrl);
              if (d.ch[hh] && d.ch[hh].dataset.scrl && d.ch[hh].dataset.scrl != d.cur) {
                d.cur = d.ch[hh].dataset.scrl;
                scrollytellingApp.changeBg(d);
              }
            }
          });
        });
        scrollytellingApp.changeBg(scrollytellingApp.itens[0]);
      });
    },
    changeBg: function changeBg(d) {
      d.bgs.forEach(function (x) {
        if (x.tagName == 'VIDEO') {
          x.currentTime = 0;
          x.play();
        }
        x.classList.toggle('active', x.dataset.scrl == d.cur);
      });
    }
  };
  var dragasApp = {
    d: false,
    init: function init() {
      var dragasinfo = document.querySelector('#dragasinfo');
      if (dragasinfo) {
        var f = dragasinfo.querySelector('.fundo');
        dragasApp.d = {
          y: dragasinfo.offsetTop,
          h: dragasinfo.clientHeight,
          f: f,
          s: f.clientWidth,
          item: dragasinfo
        };
        addScroll(function (e) {
          var d = dragasApp.d;
          if (currentST + wh > d.y && currentST < d.y + d.h) {
            var yy = currentST - d.y;
            var hh = Math.max(0, Math.min(1, yy / (d.h - wh))) * (d.s - ww);
            transformFunc(d.f, -hh + 'px');
          }
        });
      }
    }
  };
  var mapaLinks = {
    init: function init() {
      var it = document.querySelector('#mapalinks');
      if (it) {
        var a = '';
        var b = '';
        links.forEach(function (l) {
          a += "<a class=\"marcador ".concat(l.id, " disabled\" numero=\"").concat(l.n, "\" href=\"javascript:void(0)\"></a>");
          b += "<a class=\"conteudo ".concat(l.id, " disabled\" href=\"javascript:void(0)\">\n            <div class=\"titulo\">").concat(l['local_' + lang], "</div>\n            <div class=\"texto\">").concat(l['name_' + lang], "</div>\n            <span>").concat(traduz('read more'), " &rarr;</span>\n          </a>");
        });
        b += "<div class=\"explorer\">".concat(traduz('Explore the stories by clicking on the icons'), "</div>\n        <div class=\"start\">").concat(traduz('start here'), "</div>\n        <div class=\"route\">").concat(traduz('Suggested route'), "</div>");
        it.innerHTML = a + '' + b;
      }
    }
  };



  // Start
  function start() {
    wh = window.innerHeight;
    ww = window.innerWidth;
    removeAllScrollEvents();
    removeAllStartEvents();
   
    parallaxApp.init();
   
    
   
   
 
  
    scrollytellingApp.init();
   
    fixedScrollFunction();
  }
  window.addEventListener("scroll", fixedScrollFunction);
  document.addEventListener("DOMContentLoaded", start);
  window.addEventListener('resize', start, true);
  start();
})();
function topo() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}