/*
* List of messages
* */
SimpleValidator = (function($, Validator) {
    "use strict";

    Validator.MessageApi = {

        clearMessages: function($form) {
            $form.find('.sv-msg').remove();
        },

        showMessages: function(errors) {
            errors.forEach(function(error) {
                var $field = error.field;
                var msg = Validator.MessageApi.createMessage(error.message);
                $field.after(msg);
            });
        },

        createMessage: function(message) {
            return '<div class="sv-msg sv-msg-alert">' + message + '</div>';
        },

        getMessage: function(rule, params) {
            var message = (Validator.Messages[rule]) ? Validator.Messages[rule] : '';
            for (var i = 0; i < params.length; i++) {
                var rex = new RegExp("{{\\s*" + "param" + (i + 1) + "\\s*}}", "gi");
                message = message.replace(rex, params[i]);
            }
            if(message) {
                message = '* ' + message;
            }
            return message;
        }

    };

    Validator.Messages = {
        required: 'This field is required',
        minSize: '{{ param1 }} characters required',
        maxSize: '{{ param1 }} characters allowed'
    };

    return Validator;
})(jQuery, SimpleValidator);