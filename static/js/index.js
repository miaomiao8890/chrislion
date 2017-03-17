/**  
  * index.js
  * Created by sunchi 2015/11/18.
**/
"use strict";

import Slide from "./lib/Slide.js";

jQuery(function() {
  class Index {
    constructor() {
      this.$jQueryObj = {};
    }
    _handleEvent() {
      let _this = this
          , _isMouseOn = false;
      //Search button
      this.$jQueryObj.searchBar.find('img').on('mouseover', function() {
        if(!_isMouseOn) {
          _this.$jQueryObj.searchBar.animate({width: "150px"}, 500);
        }
      });
      this.$jQueryObj.searchBar.find('input').on('mouseout', function() {
        _isMouseOn = true;
        setTimeout(function() {
          _isMouseOn = false;
        },500);
        _this.$jQueryObj.searchBar.animate({width: "20px"}, 500);
      });
    }
    _handleSlider() {
      Slide({
        element: "#slide",
        con: "#slide-img",
        page: "#slide-num",
        loop: true,
        autoRun: true,
        speed: 500,
        delayTime: 5000,
        res: true
      });
    }
    init() {
      this.$jQueryObj = { 
        searchBar: $('.search-bar'),
      };
      if($('#slide').length > 0) {
        this._handleSlider();
      }
      this._handleEvent();
    }
  }
  //Main
  let index = new Index();
  index.init();
});

