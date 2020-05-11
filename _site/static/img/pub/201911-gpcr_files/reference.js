// toggles switched on reference highlighting and updates the cookie appropriately
function myToggle(color) {
  $('.ref_lookup_'+color).toggleClass("ref_lookup");
  var Cookie = $.cookie('iucr_ref_lookup_'+color);
  var imgselect = "."+color+'img';
  if (Cookie == 1) {
    $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/unchecked.png');
    Cookie = 0;
  } else {
    Cookie = 1;
    $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/checkmark_24.png');
  }
  // store cookie
  $.cookie('iucr_ref_lookup_'+color,Cookie,{expires: 365, path: '/'});
}


// checks for reference highlighting switched on
function checkDisplay (color) {
  var Cookie = $.cookie('iucr_ref_lookup_'+color);
  if (Cookie) {
    if (Cookie == 1) {
      var imgselect = "."+color+'img';
      $(imgselect).attr("src",'//journals.iucr.org/logos/buttonlogos/checkmark_24.png');
      $('.ref_lookup_'+color).toggleClass("ref_lookup");
    }
  } else {
    Cookie = 0;
  }
  // store as cookie
  $.cookie('iucr_ref_lookup_'+color,Cookie,{expires: 365, path: '/'});
}


$(document).ready(function(){
		    $('.optionbuttons').css('display','inline');
		    $('.ref_lookup_button_yellow').click(function(){
							   myToggle('yellow');
							   return false;
							 });
		    $('.ref_lookup_button_orange').click(function(){
							   myToggle('orange');
							   return false;
							 });
		    checkDisplay('orange');   
		    checkDisplay('yellow');   
		  });
