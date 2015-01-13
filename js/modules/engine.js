/*
* Engine of validator
* */
var SimpleValidator = (function($, Validator) {
    "use strict";

    Validator.Engine = {

        validate: function($form) {
            var fields = $form.find('[data-vbs-validate]');
            var errors = [];
            fields.each(function() {
                var $field = $(this);
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
            });

            if(errors.length > 0) {
                Validator.MessageApi.clearMessages($form);
                Validator.MessageApi.showMessages(errors);
                return false;
            }

            return true;
        },

        getRules: function($field) {
            var attr = $field.attr('data-vbs-validate');
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
                    value = $elem.is(':checked');
                    break;
                default:
                    value = $elem.val();
            }
            return value;
        }

    };

    return Validator;
})(jQuery, SimpleValidator);