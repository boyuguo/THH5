/*
性别:  0-女  1-男
日历类型: 0-公历 1-农历
时间: 2018/09/10 10:20
结果页状态: 0-保护 1-大腿
 */

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}

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

var $progress = $('.progressbar span'),
    prg = 0;
    timer = 0;
progress(80, 10);
window.onload = () => {
  progress(100, 10, () => {
    $('.end span').addClass('loading-end');
    $('#homeID').removeClass('none');
  })
}

$( function () {
  // 移动端不支持音频/视频的自动播放
  // see https://stackoverflow.com/questions/13266474/autoplay-audio-on-mobile-safari
  // window.addEventListener('touchstart', function () {
  //  document.getElementById('music').play();
  // })

  //  点击homeID切换下一页
  $('#homeID').on('click', function () {
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.gender-module').removeClass('hide');
  })

 //     性别        日历类型        时间        地区
  var gender = '',calendarType = 1,dataVal = '',localVal = '',result_json = {};
  // 选择性别切换下一页
  $('.gender-list').on('click', '.gender-item', function () {
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
    $('.end span').removeClass('loading-end');
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

      console.log(dataVal,'this is dataVal');

      if ( dataVal.length == 16 && dataVal.indexOf('时间不确定') > -1 ) {
        dataVal = dataVal.replace('时间不确定','12时0分');
      } else if ( dataVal.length > 16 && dataVal.slice(-1) == '分' ) {
        dataVal = dataVal.replace('时不确定','12时');
      } else if ( dataVal.length > 16 && dataVal.slice(-1) == '定' ) {
        dataVal = dataVal.replace('分不确定','0分');
      }


      var strs = ["/","/"," ",":",""];
      dataVal = dataVal.replace(/\D/g,function(){return strs.shift()});


      var data = {
        sex: gender,
        data_type: calendarType,
        date: dataVal,
        addr: localVal,
        code: getQueryStringValue('code'),
      };


      $.ajax({
        url : 'http://47.105.190.143:8081/api/guard',
        data: data,
        dataType: 'JSON',
        type: 'post',
        beforeSend: function () {
            $('.container-box').find('.wrap-box').addClass('hide');
            $('.loading-module').removeClass('hide');
            // 设置 进度条到60%
            prg = 10;
            progress(94, 20);
            console.log('this is beforeSend');
        },
        success: (dt) => {
          // 进度条加载完成
          progress(100, 5, () => {
            $('.end span').addClass('loading-end');
            $('#homeID').removeClass('none');

            if ( dt.code == 0 ) {
              $('.container-box').find('.wrap-box').addClass('hide');
              $('.result-module').removeClass('hide');
              result_json = dt;
            }

            console.log(dt,'this is dt');
            resultDataProcessing();
          })

        }
      })
      .always(() => {
        document.getElementById('submitBtn').disabled = false;
      })
    }
  })


  //第五个页面数据处理
  function resultDataProcessing () {
    // 测试结果描述
    var resultData = result_json.data,
        analysisType = '',
        arr2018 = [],
        arr2019 = [],
        resultBottomHtml = '<ul class="result-description-list">';
        console.log(resultData,' this is resultData');
    for ( let i in resultData ) {
      if ( i == 'marriage' ){
        analysisType = '爱情';
      } else if ( i == 'wealth' ) {
        analysisType = '财运';
      } else if ( i == 'cause' ) {
        analysisType = '事业';
      }
      var cur = resultData[i];
      console.log(resultData, cur, i,' this is resultData');
      if (i !== 'wealth_status' && i !== 'user_image' ) {
        arr2018.push( resultData[i].nianjixiongzhi[0]+5 );
        arr2019.push( resultData[i].nianjixiongzhi[1]+5 );

        resultBottomHtml += '<li class="result-description-item">'
                         + '<h3>'+ analysisType +'</h3>'
                         + '<p><span>'+ cur.nianjieshi[1] +'</span></p>'
                         + '</li>'
      }
    }
    resultBottomHtml += '</ul><div class="company-info"><p class="text"><b>天合·易策局开发</b><span>更多惊喜请关注公众号: 易策局</span></p></div><div class="result-share-box"><img src="../image/result_share.png" /><p>长按保存图片</p> </div>' ;
    $('.result-bottom').html(resultBottomHtml);


    // 测试结果的状态
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

        if( status == 1 ){
          snowClass = '';
        }else if( status == 0 ){
          snowClass = 'none';
        }
    var user_image = result_json.data.user_image || '../image/logo.png';

    resultTopHtml = '<div class="snow-animation-container '+snowClass+' "></div>'
                  + '<div class="result-top-content">'
                  + '<div class="title-box">'
                  + '<img src=' + user_image + ' alt="" class="user-icon">'
                  + '<p class="title">'
                  + '<b>'+ titleVal +'</b>'
                  + '<span>'+ textVal +'</span>'
                  + '</p>'
                  + '</div>'
                  + '<div class="chartsContCanvas" id="chartsContCanvas"></div>'
                  + '</div>'
    $('.result-top').html(resultTopHtml).addClass(resultTopClass);


    // 雷达图数据处理
    console.log(arr2018,arr2019);

    var myChart = echarts.init(document.getElementById('chartsContCanvas'));
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };
    var optionData = [
    	{
    		value: arr2018,
    		name: '2018',
    		itemStyle: {
                    normal: {
                        color: '#458CFF'
                    }
                },
    	},
      {
    		value: arr2019,
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
            icon: 'circle',
            bottom: 0,
            data: ['2018', '2019'],
            itemGap: 10,
            textStyle: {
                color: '#111',
                fontSize: 12
            }
        },
        radar: {
            indicator: [
                {name: '爱情', max: 9},
                {name: '财运', max: 9},
                {name: '事业', max: 9}
            ],
            shape: 'circle',
            radius: '65%',
            splitNumber: 9,
            name: {
                textStyle: {
                    color: '#111'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: '#fff'
                }
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
                        opacity: 0.8
                    }
                }

        	}

        ]
    };

    myChart.setOption(option);
  }



})
