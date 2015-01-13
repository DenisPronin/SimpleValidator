/*
* SimpleValidator was created for geeks. Ohoho!
* Use Case:
* 1) add attribute data-validate to form field.
* Format: data-validate="sentence1,sentence2[param1,param2],ignore[sentense]"
* Example: data-validate="required,ignore[invisible]"
* 2) Now you can calling validator:
* SimpleValidator.validate(form)
* */
var SimpleValidator = (function($) {
    "use strict";

    var Validator = {
        validate: function(form){
            return Validator.Engine.validate($(form));
        }

    };

    return Validator;
})(jQuery);