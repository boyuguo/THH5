$(function(){
  //  点击homeID切换下一页
  $('#homeID').on('click',function(){
    $('.container-box').find('.wrap-box').addClass('hide');
    $('.gender-module').removeClass('hide');
  })

  var gender ;
  $('.gender-list').on('click','.gender-item',function(){
    var selectVal = $(this).find('.inp').data('val');
    gender = selectVal;

    console.log(gender,'this is gender');

    $('.container-box').find('.wrap-box').addClass('hide');
    $('.form-module').removeClass('hide');
  })



})
