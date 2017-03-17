"use strict";

var Photo = {
  albumid: '',
  ulNum: 0,
  photoNum: 0,
  timer: null,
  init: function() {
    this._setConfig();
    this._setDom();
    // this._bindEvent();
    //首次加载
    this._getPhotosDate();
  },
  _setConfig: function() {
    this.albumid = $('#albumId').val();
  },
  _setDom: function() {
    // 设置高度
    $('.album').css('min-height', $('body').height() - 295);
  },
  _bindEvent: function() {
    var _this = this;
    //Search button
    var _isMouseOn = false;
    $('.search-bar').find('img').on('mouseover', function() {
      if(!_isMouseOn) {
        $('.search-bar').animate({width: "150px"}, 500);
      }
    });
    $('.search-bar').find('input').on('mouseout', function() {
      _isMouseOn = true;
      setTimeout(function() {
        _isMouseOn = false;
      },500);
      $('.search-bar').animate({width: "20px"}, 500);
    });
    // 下一页/上一页
    $('.switch-btn').on('click', function() {
      // 清除定时器
      clearTimeout(_this.timer);

      var type = $(this).attr('id')
        , cUl = $('.album-photo-list.current')
        , nUl = null
        , cIndex = cUl.index()
        , nIndex = 0
      ;
      if('left' == type) {
        if(0 == cIndex) {
          nIndex = _this.ulNum - 1;
        } else {
          nIndex = cIndex - 1;
        }
      } else {
        if((_this.ulNum - 1) == cIndex) {
          nIndex = 0;
        } else {
          nIndex = cIndex + 1;
        }
      }
      nUl = $('.album-photo-list').eq(nIndex);
      $('.album-photo-list').eq(cIndex).addClass('out').removeClass('current');
      $('.album-photo-list').eq(nIndex).addClass('current');
      setTimeout(function() {
        $('.album-photo-list').eq(cIndex).css('display','none').removeClass('out');
        setTimeout(function() {
          $('.album-photo-list').eq(cIndex).css('display','block');
          // 设定自动切换
          _this.timer = setTimeout(function() {
            $('#right').trigger("click");
          }, 3000);
        }, 1000);
      }, 1000);
    });
    // 关闭按钮
    $('.close-btn').on('click', function() {
      $('.bigimg-content').css('display', 'none');
      $('#bigImgList').find('li').removeClass('show');
      $('body').css({'height': 'auto', 'overflow': 'scroll'});
      // 设定自动切换
      _this.timer = setTimeout(function() {
        $('#right').trigger("click");
      }, 3000);
    });
    // 浏览大图
    $('.photo-item').on('click', function() {
      clearTimeout(_this.timer);
      var index = parseInt($(this).attr('data-index'));
      $('.bigimg-content').css('display', 'block');
      var h = $('.bigimg-content').height();
      $('body').css({'height': h, 'overflow': 'hidden'});
      $('#bigImgList li').eq(index).addClass('show');
      if(index == 0) {
        $('.left-btn').addClass('disabled');
      } else if(index == (_this.photoNum-1)) {
        $('.right-btn').addClass('disabled');
      }
    });
    // 翻页
    $('.arrow-btn').on('click', function() {
      if(!$(this).hasClass('disabled')) {
        var nDom = $('#bigImgList .show');
        var cIndex = parseInt(nDom.index());
        var nIndex = cIndex + ($(this).attr('id') == 'left' ? -1 : 1);
        console.log(nIndex)
        nDom.removeClass('show');
        $('#bigImgList li').eq(nIndex).addClass('show');
        if(nIndex == 0) {
          $('.left-btn').addClass('disabled');
        } else if(nIndex == (_this.photoNum-1)) {
          $('.right-btn').addClass('disabled');
        } else {
          $('.arrow-btn').removeClass('disabled');
        }
      }
    });
  },
  _getPhotosDate: function(n) {
    var _this = this;
    $.ajax({
      url: '/hb/photobyalbum?id='+_this.albumid,
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        var listNum = Math.ceil(result.result.length/28)
          , tmpAry = []
          , _html = ''
          , _bigHtml = ''
        ;
        _this.ulNum = listNum;
        for (var i = 0; i < listNum; i++) {
          tmpAry = result.result.slice(i*28, (i+1)*28);
          _html += '<ul class="album-photo-list '+ (i==0 ? 'current' : '') +'" id="list_'+(i+1)+'">'
          for (var j = 0; j < tmpAry.length; j++) {
            if(0 == j%7) {
              _html += '<li class="clearfix">';
            }
            _html += '<div class="photo-item" data-index="'+(i*28+j)+'"><img src="'+tmpAry[j].url+'?imageView2/2/w/200" alt=""><div class="album-photo-info">'+tmpAry[j].name+'</div></div>'
            if(6 == j%7) {
              _html += '</li>';
            }
            // 设置大图
            _bigHtml += '<li><img src="'+tmpAry[j].url+'" alt=""><p class="bigimg-title">'+tmpAry[j].name+'</p></li>'
          };
          _html += '</ul>';
        };
        // 添加
        $('#albumContent').append(_html);
        $('#bigImgList').append(_bigHtml);
        // 绑定事件
        _this._bindEvent();

        setTimeout(function() {
          $('.content-loading').css('display', 'none');
          $('.album-left, .album-right').css('display', 'block');

          // 自动切换
          _this.timer = setInterval(function() {
            $('#right').trigger("click");
          }, 3000);

        }, 2000);
        
      }
    });
  }
}

$(function() {
  // 初始化
  Photo.init();
});