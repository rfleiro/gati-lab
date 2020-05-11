/* This is a replacement for inputmask-1.1.js - only keeping the same name for IUCr legacy/compatibility reasons. 
 * This fixes a problem with the original library - the label would appear on top of the input box which causes problems with 
 * selecting text within the input box and pasting via middle mouse button...
 * Simplest solution (compatible with current source HTML) is to apply the label as a placeholder attribute on the input box.
 * However, IE<10 doesnt support the placeholder attribute so resorting to browser sniffing to emulate the desired behaviour 
 * (although the background colours will be different)

 */

(function($){
	$.fn.inputmask = function() {
		return this.each(function() {
            
            var div = document.createElement("div");
            div.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
            var oldIE = (div.getElementsByTagName("i").length == 1); // still necessary unfortunately
            
            var label = $(this).find('label');
			var input = $(this).find('input:text, textarea');
            input.attr('placeholder', label.text());
            label.css({opacity: '0', visibility: 'hidden'});
            if (!oldIE) {
                $(input).focus(function() {
                    if ($(this).val() > '') {
                        $(this).select(); // explicitly selects entire contents but only on focus (e.g. first click)
                }
                });
            }
            else { /*
                IE<10 doesnt support placeholder attribute, so use layers (input over label) 
                and switch transparency of input to reveal/hide label
                */
                label.css({opacity: '1', visibility: 'visible'});
                input.css({position:"relative"}); 
                if (input.val() > '') {
                    input.css({background:'rgb(255,255,255)'});
                }
                else {
                    input.css({background:'rgba(255,255,255,0.2)'});
                }
			
                $(input).focus(function() {
                    if ($(this).val() > '') {
                        $(this).css({background:'rgb(255,255,255)'});
                        $(this).select(); 
                    }
                    else {
                        label.css({opacity: '1', visibility: 'visible'}); // in case switched off in iucrscripts.js!
                    }
                }).blur(function() {
                    if ($(this).val() == '') {
                        $(this).css({background:'rgba(255,255,255,0.2)'});
                    }
                    else {
                        $(this).css({background:'rgb(255,255,255)'});
                    }
                });
            
            
                $(input).on('propertychange input', function (e) {
                    var valueChanged = false;
                    if (e.type=='propertychange') {
                        valueChanged = e.originalEvent.propertyName=='value'; // IE <10
                    } else {
                        valueChanged = true;
                    }
                    if (valueChanged) {
                        if ($(this).val() > '') {
                            $(this).css({background:'rgb(255,255,255)'});
                        }
                        else {
                            $(this).css({background:'rgba(255,255,255,0.2)'});
                        }
                    }
                });
            }
            
		});
	}
})(jQuery);