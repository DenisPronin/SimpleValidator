/*
* List of conditions
* */
SimpleValidator = (function($, Validator) {
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

        email: function($elem, params){
            var value = Validator.Engine.getValue($elem);
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value);
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