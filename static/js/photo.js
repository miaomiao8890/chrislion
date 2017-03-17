"use strict";

var Photo = {
	requestNum: 0,
  photoNum: 0,
  myScroll: true,
  init: function() {
  	this._setConfig();
  	this._setDom();
  	this._bindEvent();
    //首次加载
    this._getPhotosDate();
    this._getAlbumsDate();
  },
  _setConfig: function() {
  	
  },
  _setDom: function() {
  	// 设置高度
    $('.picture').css('min-height', $('body').height() - 295);
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
    // nav
  	$('.main-photo-nav span').on('click', function() {
      if(!$(this).hasClass('current')) {
        $('.main-photo-nav span').siblings('span').removeClass('current');
        $(this).addClass('current');
        $('.picture-content').css('display', 'none');
        var id = $(this).attr('id').split('_')[1];
        $('#content_'+id).css('display', 'block');
      }
    });
    // 关闭按钮
    $('.close-btn').on('click', function() {
      $('.bigimg-content').css('display', 'none');
      $('#bigImgList').find('li').removeClass('show');
      $('body').css({'height': 'auto', 'overflow': 'scroll'});
    });
    // 浏览大图
    $('.photo-item').on('click', '.photo-box', function() {
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
        }
        else if(nIndex == (_this.photoNum-1)) {
          $('.right-btn').addClass('disabled');
        }
        // 提前加载
        else if(nIndex == (_this.photoNum-3)) {
          _this.myScroll = false;
          _this._getMorePhotos();
        }
        else {
          $('.arrow-btn').removeClass('disabled');
        }

      }
    });
    // 下拉加载
    $(window).scroll(function(){
      if(!_this.myScroll) return;
      var scrollTop = $(this).scrollTop();
      var scrollHeight = $(document).height();
      var windowHeight = $(this).height();
      if (scrollTop + windowHeight >= (scrollHeight - 5)) {
        _this.myScroll = false;
        _this._getMorePhotos();
      }
    });
    // document.addEventListener('scroll', function(e) {
    //   if(document.body.scrollTop >= document.body.clientHeight - document.documentElement.clientHeight) {
    //     if($('body').hasClass('loading')) return;
    //     if(document.body.scrollTop > 0) {
    //       $('body').addClass('loading');
    //       _this._getMorePhotos();
    //     }
    //   }
    // }, false);
  },
  _getPhotosDate: function(n) {
    var _this = this;
    $.ajax({
      url: '/hb/photos?n='+_this.requestNum,
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        console.log(result)
        _this.requestNum++;
        _this.photoNum = result.result.length+_this.photoNum;
        var _html = ''
          , _bigHtml = ''
        ;
        for(var i = 0; i < result.result.length; i++) {
          _html = '<div class="photo-box" data-index="'+i+'"><div class="photo-img"><img src="'+result.result[i].url+'?imageView2/2/w/300" alt=""></div><div class="photo-title">'+result.result[i].name+'</div></div>'
          if(0 == i%3) {
            $('#photoLeft').append(_html);
          } else if(1 == i%3) {
            $('#photoCenter').append(_html);
          } else {
            $('#photoRight').append(_html);
          }
          _bigHtml += '<li><img src="'+result.result[i].url+'" alt=""><p class="bigimg-title">'+result.result[i].name+'</p></li>'
        }
        $('.content-loading').css('display', 'none');
        $('#content_photo').css('display', 'block');
        $('#bigImgList').append(_bigHtml);
      }
    });
  },
  _getAlbumsDate: function(n) {
    var _this = this;
    $.ajax({
      url: '/hb/albums',
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        console.log(result)
        var _html = '';
        for(var i = 0; i < result.result.length; i++) {
          _html += '<li><a href="/albums/'+result.result[i]._id+'"><div class="album-img"><img src="'+ result.result[i].previewimg +'?imageView2/2/w/300" alt=""><i class="album-num">'+ result.result[i].photos.length +'</i></div><div class="album-title">'+ result.result[i].name +'</div></a></li>'
        }
        $('#albumList').append(_html);
      }
    });
  },
  _getMorePhotos: function(cb) {
    var _this = this;
    $('.content-loading').css('display', 'block');
    $.ajax({
      url: '/hb/photos?n='+_this.requestNum,
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        console.log(result)
        _this.requestNum++;
        _this.photoNum = result.result.length+_this.photoNum;
        var _html = ''
          , _bigHtml = ''
        ;
        for(var i = 0; i < result.result.length; i++) {
          _html = '<div class="photo-box" data-index="'+(i+(_this.requestNum-1)*15)+'"><div class="photo-img"><img src="'+result.result[i].url+'?imageView2/2/w/300" alt=""></div><div class="photo-title">'+result.result[i].name+'</div></div>'
          if(0 == i%3) {
            $('#photoLeft').append(_html);
          } else if(1 == i%3) {
            $('#photoCenter').append(_html);
          } else {
            $('#photoRight').append(_html);
          }
          _bigHtml += '<li><img src="'+result.result[i].url+'" alt=""><p class="bigimg-title">'+result.result[i].name+'</p></li>'
        }
        $('#bigImgList').append(_bigHtml);
        $('.content-loading').css('display', 'none');
        _this.myScroll = true;
        
      }
    });
  }
}

$(function() {
  // 初始化
  Photo.init();
});