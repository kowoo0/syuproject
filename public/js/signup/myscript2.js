function atrim(str){
  return str.replace(/\s/g,'');
}
function blankcheck(el,msg){
 if(el.value==""){
  alert(msg+"를(을) 입력해주세요.");
  el.focus();
  return true;
 }
 if(el.value.length != atrim(el.value).length){
  alert(msg+"에는 공백을 허용하지 않습니다.");
  el.focus();
  return true;
 }
}
function doSubmit() {

 console.log("doSubmit");

 if(blankcheck(joinfrm.m_id,'아이디') || joinfrm.id_ch.value == false) {
  return;
 }

 if(blankcheck(joinfrm.m_pass,'비밀번호') || joinfrm.pass_ch.value == false) {
  return;
 }

 if(blankcheck(joinfrm.m_pass_ch,'비밀번호'))
  return;

 if(blankcheck(joinfrm.m_name,'이름'))
  return;

 if(blankcheck(joinfrm.m_date,'날자'))
  return;

 if(blankcheck(joinfrm.m_tel1,'전화'))
  return;
 if(blankcheck(joinfrm.m_tel2,'전화'))
  return;
 if(blankcheck(joinfrm.m_tel3,'전화'))
  return;
 joinfrm.m_tel.value = joinfrm.m_tel1.value+"-"+joinfrm.m_tel2.value+"-"+joinfrm.m_tel3.value;
 if(blankcheck(joinfrm.m_gender,'성별'))
  return;

 if(blankcheck(joinfrm.m_email,'이메일' || joinfrm.email_ch.value == false))
  return;
 joinfrm.submit();
}
$(document).ready(function() {
 var check_Eng= /[a-z]|[A-Z]/;
 var check_Num= /[0-9]/;
 var check_Num_Eng= /[0-9]|[a-z]|[A-Z]/;
 var check_kor = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i;
 var check_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
 $("#m_id").change(function(){
  joinfrm.id_ch.value = false; //id_ch 히든값 초기화 후 검사 시작
  console.log('1. '+joinfrm.id_ch.value);
  // alert('id값 변경');
  var id = joinfrm.m_id.value;
  var id_flag = false;
  if(id.match(check_Num_Eng) == null || id.match(check_Eng) == null){
  /*if(!check_kor.test(id)){*/
   $("#info_id1").css("color","red");
   // alert('영문 또는 영문,숫자 조합을 사용하여야 합니다.');
   id_flag = true;
  }else{$("#info_id1").css("color","blue");}

  if(id.length<5 || id.length >13){
   $("#info_id2").css("color","red");
   id_flag = true;
  }else{$("#info_id2").css("color","blue");}
  if(id_flag){
   joinfrm.m_id.focus();
   return;
  }
  joinfrm.id_ch.value = true;
  console.log('2. '+joinfrm.id_ch.value);
 });

 $("#m_pass").change(function(){
  joinfrm.pass_ch.value = false;
  // joinfrm.m_pass_ch.value = ""; //비밀번호 변경시 비밀번호 확인 칸 초기화
  var pass = joinfrm.m_pass.value;
  // alert("포커스 아웃  " + pass);
  var pass_flag = false;
  if(pass.match(check_Num_Eng) == null || pass.match(check_Num) == null || pass.match(check_Eng) == null){
   // alert("패스워드 잘못됨");
   $("#info_pass1").css("color","red");
   pass_flag = true;
  }else{$("#info_pass1").css("color","blue");}
  if(pass.length<8){
   $("#info_pass2").css("color","red");
   pass_flag = true;
  }else{$("#info_pass2").css("color","blue");}
  if(pass_flag){
   joinfrm.m_pass.focus();
   return;
  }
  joinfrm.pass_ch.value = true;
  console.log(pass);

 });

 $("#m_pass_ch").change(function() {
   alert("ㅎㅇ");
  joinfrm.pass_ch.value = false;
  if(joinfrm.m_pass_ch.value != joinfrm.m_pass.value){
   alert("ㅎㅇ");
   $("#pass_ch_notice").css("display","block");
   joinfrm.m_pass_ch.focus();
   return;
  }
  $("#pass_ch_notice").css("display","none");
  joinfrm.pass_ch.value = true;
 });

 $("#m_email").change(function(){
  joinfrm.email_ch.value = false;
  if(!joinfrm.m_email.value.match(check_email)){
   $("#email_notice").css("display","block");
   joinfrm.m_email.focus();
   return;
  }
  $("#email_notice").css("display","none");
  joinfrm.email_ch.value = true;
 });
});
