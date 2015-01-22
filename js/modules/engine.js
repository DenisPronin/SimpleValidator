/*
* Engine of validator
* */
SimpleValidator = (function($, Validator) {
    "use strict";

    var fieldId = 0;

    Validator.Engine = {

        validate: function($form) {
            var fields = $form.find('[data-validate]');
            var errors = [];
            fields.each(function() {
                var $field = $(this);
                Validator.Engine.addFieldId($field);
                var _errors = Validator.Engine.validateField($field);
                if(_errors.length > 0) {
                    errors = errors.concat(_errors);
                }
            });

            Validator.MessageApi.clearMessages($form);
            if(errors.length > 0) {
                Validator.MessageApi.showMessages(errors);
                return false;
            }

            return true;
        },

        attach: function($form) {
            var fields = $form.find('[data-validate]');
            fields.each(function() {
                var $field = $(this);
                Validator.Engine.addFieldId($field);
                Validator.Engine.onChangeField($field);
            });
            Validator.Engine.onSubmitForm($form);
        },

        onChangeField: function($field) {
            var eventName = Validator.Engine.getChangeEvent($field);
            $field.off(eventName).on(eventName, function() {
                var _field = $(this);
                var _errors = Validator.Engine.validateField(_field);
                Validator.MessageApi.clearMessage(_field);
                if(_errors.length > 0) {
                    Validator.MessageApi.showMessages(_errors);
                }
            });
        },

        onSubmitForm: function($form) {
            $form.off('submit.sv').on('submit.sv', function(e){
                e.preventDefault();
                var isValid = Validator.validate($form);
                if(isValid) {
                    $form.submit();
                }
            });
        },

        validateField: function($field) {
            var errors = [];
            var resultRules = Validator.Engine.getRules($field);
            var rules = resultRules.rules;
            var isIgnore = false;
            if(resultRules.ignoreRule) {
                isIgnore = Validator.Conditions.ignore($field, resultRules.ignoreRule.params[0]);
            }
            if(!isIgnore && rules) {
                rules.forEach(function(rule) {
                    var result = Validator.Conditions[rule.name]($field, rule.params);
                    if(!result){
                        var msg = Validator.MessageApi.getMessage(rule.name, rule.params);
                        errors.push({
                            field: $field,
                            rule: rule.name,
                            message: msg
                        });
                    }
                });
            }
            return errors;
        },

        getRules: function($field) {
            var attr = $field.attr('data-validate');
            var result = {};
            if(attr) {
                var rules = [];
                var _rules = attr.split(',');
                _rules.forEach(function(ruleAttr) {
                    var ruleParams = ruleAttr.trim().split(/\[|,|\]/);

                    for (var i = 0; i < ruleParams.length; i++) {
                        ruleParams[i] = ruleParams[i].replace(" ", "");
                        // Remove any parsing errors
                        if (ruleParams[i] === '') {
                            ruleParams.splice(i, 1);
                        }
                    }
                    if(ruleParams.length > 0) {
                        var rule = {};
                        rule.name = ruleParams[0];
                        ruleParams.splice(0, 1);
                        rule.params = ruleParams;

                        if(Validator.Conditions[rule.name]) {
                            if(rule.name === 'ignore') {
                                result.ignoreRule = rule;
                            }
                            else {
                                rules.push(rule);
                            }
                        }
                    }
                });
                result.rules = rules;
                return (result.rules.length > 0) ? result : null;
            }

            return null;
        },

        getValue: function($elem) {
            var value;
            switch ($elem.prop("type")) {
                case "radio":
                case "checkbox":
                    value = ($elem.is(':checked')) ? 'checked' : null   ;
                    break;
                default:
                    value = $elem.val();
            }
            return value;
        },

        addFieldId: function($field) {
            fieldId++;
            $field.data('sv-field-id', fieldId);
        },

        getFieldId: function($field) {
            return $field.data('sv-field-id');
        },

        getChangeEvent: function($field){
            var el = document.createElement('div');
            var inputEvent = (!('oninput' in el)) ? 'keyup' : 'input';
            var type  = $field.attr('type');
            var event = ('radio' === type || 'checkbox' === type || 'file' === type || 'SELECT' === $field.get(0).tagName) ? 'change' : inputEvent;
            event += '.sv';
            return event;
        }
    };

    return Validator;
})(jQuery, SimpleValidator);