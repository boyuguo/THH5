$(function(){
  //  点击homeID切换下一页
  $('#homeID').on('click',function(){
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.gender-module').removeClass('hide');
  })

 //     性别        日历类型        时间        地区
  var gender='',calendarType='',dataVal='',localVal='';
  // 选择性别切换下一页
  $('.gender-list').on('click','.gender-item',function(){
    var selectVal = $(this).find('.inp').data('val');
    gender = selectVal;
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.form-module').removeClass('hide');
  })

  // 调时间插件
  var calendardatetime = new lCalendar();
			calendardatetime.init({
				'trigger': '#dataVal',
				'type': 'datetime'
			});

// 点击切换日历类型
  $('.calendar-box').on('click','.btn',function(){
    $(this).siblings().removeClass('btn-active');
    $(this).addClass('btn-active');
    var curCalendar = $(this).data('calendar-type');
    calendarType = curCalendar;
  })
// 地址插件
  var $target = $('#localVal');
      $target.citySelect();
      $target.on('click', function (event) {
          event.stopPropagation();
          $target.citySelect('open');
      });
      $target.on('done.ydui.cityselect', function (ret) {
          $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
      });

  // 点击提交按钮
  $('#submitBtn').on('click',function(){
    var dataVal = $('#dataVal').val(),
        localVal = $('#localVal').val();
    console.log(gender,calendarType,dataVal,localVal,'this is val');
  })


})
