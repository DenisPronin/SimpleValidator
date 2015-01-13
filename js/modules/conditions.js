/*
* List of conditions
* */
var SimpleValidator = (function($, Validator) {
    "use strict";

    Validator.Conditions = {
        required: function($elem) {
            var value = Validator.Engine.getValue($elem);
            return !!(value !== null && value !== '');
        },

        minSize: function($elem, params) {
            var size = parseInt(params[0]);
            var value = Validator.Engine.getValue($elem);
            var length = value.length || 0;
            return (length >= size);
        },

        maxSize: function($elem, params) {
            var size = parseInt(params[0]);
            var value = Validator.Engine.getValue($elem);
            var length = value.length || 0;
            return (length <= size);
        },

        visible: function($elem) {
            return $elem.is(':visible');
        },

        ignore: function($elem, type) {
            if(type === 'invisible') {
                var isElemVisible = Validator.Conditions.visible($elem);
                return !isElemVisible;
            }
        }

    };

    return Validator;
})(jQuery, SimpleValidator);