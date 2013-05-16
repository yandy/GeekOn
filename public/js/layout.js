$(document).ready(function(){
  $(".email").blur(function(){
    var email = $(".email").val();
    var emailReg = /\w+@\w+.\w+/;
    $.post("#",{"url": email},function(data){
      alert(date);
    });
    if((!email.match(emailReg))&&(email.length != 0)){
      $(".email-error").html("邮箱地址不合法");
      $(".email-error").css("display","inline");
    }else if(email.length === 0){
      $(".email-error").html("请输入邮箱地址");
      $(".email-error").css("display","inline");
    }else
      $(".email-error").css("display","none");
  });
  $(".username").blur(function(){
    var username = $(".username").val();
    if((username.length < 6)&&(username.length != 0)){
      $(".username-error").html("用户名长度至少为6");
      $(".username-error").css("display","inline");
    }
      else if(username.length === 0){
        $(".username-error").html("请输入用户名");
        $(".username-error").css("display","inline");
      }
    else{
      $(".username-error").css("display","none");
    }
  });
  $(".password").blur(function(){
    var password = $(".password").val();
    var password_confirmation = $(".password_confirmation").val();
    if((password.length < 6)&&(password.length != 0)){
      $(".password-error").html("密码长度至少为6");
      $(".password-error").css("display","inline");
    }else if(password.length === 0){
      $(".password-error").html("请输入密码");
      $(".password-error").css("display","inline");
    }
    else
      $(".password-error").css("display","none");
    if(password != password_confirmation){
      $(".password_confirmation-error").html("两次输入密码不同");
      $(".password_confirmation-error").css("display","inline");
    }
    else
      $(".password_confirmation-error").css("display","none");
  });
  $(".password_confirmation").blur(function(){
    var password_confirmation = $(".password_confirmation").val();
    var password = $(".password").val();
    if(password != password_confirmation){
      $(".password_confirmation-error").html("两次输入密码不同");
      $(".password_confirmation-error").css("display","inline");
    }
    else
      $(".password_confirmation-error").css("display","none");
  });
  $(".info-cap").click(function(){
    $(".row-fluid.info").slideToggle(function(){
      if($(".info-cap i").hasClass("icon-chevron-down")){
        $(".info-cap i").removeClass("icon-chevron-down");
        $(".info-cap i").addClass("icon-chevron-up");
      }else{
        $(".info-cap i").removeClass("icon-chevron-up");
        $(".info-cap i").addClass("icon-chevron-down");
      }
    });
  });
  $(".about-cap").click(function(){
    $(".row-fluid.about").slideToggle(function(){
      if($(".about-cap i").hasClass("icon-chevron-down")){
        $(".about-cap i").removeClass("icon-chevron-down");
        $(".about-cap i").addClass("icon-chevron-up");
      }else{
        $(".about-cap i").removeClass("icon-chevron-up");
        $(".about-cap i").addClass("icon-chevron-down");
      }
    });
  });
  $(".background-cap").click(function(){
    $(".row-fluid.background").slideToggle(function(){
      if($(".background-cap i").hasClass("icon-chevron-down")){
        $(".background-cap i").removeClass("icon-chevron-down");
        $(".background-cap i").addClass("icon-chevron-up");
      }else{
        $(".background-cap i").removeClass("icon-chevron-up");
        $(".background-cap i").addClass("icon-chevron-down");
      }
    });
  });
  $(".step-cap").click(function(){
    $(".row-fluid.step").slideToggle(function(){
      if($(".step-cap i").hasClass("icon-chevron-down")){
        $(".step-cap i").removeClass("icon-chevron-down");
        $(".step-cap i").addClass("icon-chevron-up");
      }else{
        $(".step-cap i").removeClass("icon-chevron-up");
        $(".step-cap i").addClass("icon-chevron-down");
      }
    });
  });
  $(".prize-cap").click(function(){
    $(".row-fluid.prize").slideToggle(function(){
      if($(".prize-cap i").hasClass("icon-chevron-down")){
        $(".prize-cap i").removeClass("icon-chevron-down");
        $(".prize-cap i").addClass("icon-chevron-up");
      }else{
        $(".prize-cap i").removeClass("icon-chevron-up");
        $(".prize-cap i").addClass("icon-chevron-down");
      }
    });
  });
});
