/*
性别:  0-女  1-男
日历类型: 0-公历 1-农历
时间: 2018/09/10 10:20
结果页状态: 0-保护 1-大腿
 */
// 进度条功能
// 进度条方法
function progress (dist, delay, callback) {
  window.clearInterval(timer)
  timer = window.setInterval(() => {
    if (prg >= dist) {
      window.clearInterval(timer)
      prg = dist
      callback && callback()
    } else {
      prg++
    }
    $progress.css({"width": prg + "%"})
  }, delay)
}

var $progress = $('.progressbar span')
var prg = 0
var timer = 0
progress(80, 10)
window.onload = () => {
  progress(100, 10, () => {
    $('.end span').addClass('loading-end');
    $('#homeID').removeClass('none');
  })
}

$(function(){
  // 移动端不支持音频/视频的自动播放
  // see https://stackoverflow.com/questions/13266474/autoplay-audio-on-mobile-safari
  window.addEventListener('touchstart', function () {
  //  document.getElementById('music').play();
  })

  //  点击homeID切换下一页
  $('#homeID').on('click',function(){
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.gender-module').removeClass('hide');
  })

 //     性别        日历类型        时间        地区
  var gender = '',calendarType = 1,dataVal = '',localVal = '',result_json = {};
  // 选择性别切换下一页
  $('.gender-list').on('click','.gender-item',function(){
    var selectVal = $(this).find('.inp').data('val');
    gender = selectVal;
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.form-module').removeClass('hide');
  })

  // 时间插件
  var calendardatetime = new lCalendar();
      calendardatetime.init({
        'trigger': '#dataVal',
        'type': 'datetime'
      });
  // function setTimeEvent(){
  //
  // }
  // setTimeEvent();

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
  $('#submitBtn').on('click', function () {
    var dataVal = $('#dataVal').val()
    var localVal = $('#localVal').val();
    $('#date-err').removeClass('show-err');
    $('#local-err').removeClass('show-err');

    if ( dataVal == '' && localVal == '' ) {
      $('#date-err').addClass('show-err');
      $('#local-err').addClass('show-err');
    } else if ( localVal == '' ) {
      $('#local-err').addClass('show-err');
    } else if( dataVal == '' ) {
      $('#date-err').addClass('show-err');
    }

    if (
      typeof dataVal === 'string' && dataVal !== '' &&
      typeof localVal === 'string' && localVal !== ''
    ) {
      document.getElementById('submitBtn').disabled = true;

      var strs = ["/","/"," ",":",""];
      dataVal = dataVal.replace(/\D/g,function(){return strs.shift()});

      var data = {
        sex: gender,
        data_type: calendarType,
        date: dataVal,
        addr: localVal
      };

      $.ajax({
        url : '/tianhe/public/index.php/api/guard',
        data: data,
        dataType: 'JSON',
        type: 'post',
        beforeSend: function(){
            $('.container-box').find('.wrap-box').addClass('hide');
            $('.loading-module').removeClass('hide');
            // 设置 进度条到60%
            prg = 20;
            progress(50, 5);
            console.log('this is beforeSend');
        },
        complete: function(){
          // 设置 进度条到80%
          progress(80, 5)
          console.log('this is complete');
        },
        success: (dt) => {
          if ( dt.code == 0 ) {
            $('.container-box').find('.wrap-box').addClass('hide');
            $('.result-module').removeClass('hide');
            result_json = dt;
          }
          // 进度条加载完成
          progress(100, 5, () => {
            $('.end span').addClass('loading-end');
            $('#homeID').removeClass('none');
          })
          console.log(dt,'this is dt');
          resultDataProcessing();
        }
      })
      .always(() => {
        document.getElementById('submitBtn').disabled = false;
      })
    }
  })


  //第五个页面数据处理
  function resultDataProcessing(){

    var resultData = result_json.data,
        analysisType = '',
        resultBottomHtml = '<ul class="result-description-list">';
    for ( var i in resultData ) {
      if ( i == 'marriage' ){
        analysisType = '爱情';
      } else if ( i == 'wealth' ) {
        analysisType = '财运';
      } else if ( i == 'cause' ) {
        analysisType = '事业';
      }
      var cur = resultData[i];
      console.log(cur,' this is cur');
      if (i !== 'wealth_status' ) {
        resultBottomHtml += '<li class="result-description-item">'
                         + '<h3>'+ analysisType +'</h3>'
                         + '<p>'+ cur.nianjieshi[1] +'</p>'
                         + '</li>'
      }
    }

    resultBottomHtml += '</ul>' ;

    $('.result-bottom').html(resultBottomHtml);

    var status = result_json.data.wealth_status;
    var titleVal = status == 1 ? '2019,我是“大腿”' : '2019，我求“保护”',
        textVal = status == 1 ? '炫富不是我的错，我是大腿谁抱我？' : '可怜兮兮又一年，我很受伤谁护我？',
        resultTopClass = '', // 结果页背景图的状态类
        snowClass = '';  // 是否下money
        if( status == 1 && gender == 1 ){
          resultTopClass = 'boyBg';    // 抱大腿男
        }else if(  status == 0 && gender == 1  ){
          resultTopClass = 'boyBgErr'; // 受保护男
        }else if(  status == 0 && gender == 0  ){
          resultTopClass = 'girlBgErr'; // 受保护女
        }

        if( result_json.data.wealthStatus == 1 ){
          snowClass = '';
        }else if( result_json.data.wealthStatus == 0 ){
          snowClass = 'none';
        }


    resultTopHtml = '<div class="snow-animation-container '+snowClass+' "></div>'
                  + '<div class="result-top-content">'
                  + '<div class="title-box">'
                  + '<img src="../image/girl.png" alt="" class="user-icon">'
                  + '<p class="title">'
                  + '<b>'+ titleVal +'</b>'
                  + '<span>'+ textVal +'</span>'
                  + '</p>'
                  + '</div>'
                  + '<div class="chartsContCanvas" id="chartsContCanvas"></div>'
                  + '</div>'




                  $('.result-top').html(resultTopHtml).addClass(resultTopClass);

    var myChart = echarts.init(document.getElementById('chartsContCanvas'));
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };
    var optionData = [
    	{
    		value: [2,2,2],
    		name: '2018',
    		itemStyle: {
                    normal: {
                        color: '#0763F8'
                    }
                },
    	},
    	{
    		value: [9,9,9],
    		name: '2019',
    		itemStyle: {
                    normal: {
                        color: '#8269EA'
                    }
                },
    	}
    ];

    var option = {
        legend: {
            bottom: 5,
            data: ['2018', '2018'],
            itemGap: 20,
            textStyle: {
                color: '#111',
                fontSize: 14
            }
        },
        radar: {
            indicator: [
                {name: '爱情', max: 9},
                {name: '财运', max: 9},
                {name: '事业', max: 9}
            ],
            shape: 'circle',
            splitNumber: 9,
            name: {
                textStyle: {
                    color: '#111'
                }
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.2)',
                        'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)',
                        'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        series: [
        	{
                type: 'radar',
                lineStyle: lineStyle,
                data: optionData,
                symbol: 'none',
                areaStyle: {
                    normal: {
                        opacity: 0.9
                    }
                }

        	}

        ]
    };

    myChart.setOption(option);
  }
})
