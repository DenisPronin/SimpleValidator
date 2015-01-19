/*
* Engine of validator
* */
SimpleValidator = (function($, Validator) {
    "use strict";

    Validator.Engine = {

        validate: function($form) {
            var fields = $form.find('[data-validate]');
            var errors = [];
            fields.each(function() {
                var $field = $(this);
                var error = Validator.Engine.validateField($field, errors);
                if(error) {
                    errors.push(error);
                }
            });

            Validator.MessageApi.clearMessages($form);
            if(errors.length > 0) {
                Validator.MessageApi.showMessages(errors);
                return false;
            }

            return true;
        },

        validateField: function($field) {
            var error = null;
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
                        error = {
                            field: $field,
                            rule: rule.name,
                            message: msg
                        };
                    }
                });
            }
            return error;
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
        }

    };

    return Validator;
})(jQuery, SimpleValidator);