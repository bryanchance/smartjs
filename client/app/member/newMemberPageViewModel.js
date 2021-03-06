﻿// SmartJs v0.1.0
// (c) Hugh Anderson - https://github.com/hughanderson4/smartjs
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

// the newMemberPageViewModel module binds to the member signup page
// this module returns a static object

define([
    'data/dataContext',
    'jquery',
    'knockout',
    'data/schema'
], function (DataContext, Jquery, Ko, Schema) {

    // bind to UI textbox
    var memberName = Ko.observable(''),
        // validation
        checkingMemberName = Ko.observable(false),
        goodMemberName = Ko.observable(false),
        errorMessages = Ko.observableArray(),

        invalidMemberName = Ko.computed({
            read: function () {
                return errorMessages().length > 0;
            }
        });

    // functionality
    function save() {
        errorMessages.removeAll();
        checkingMemberName(true);
        goodMemberName(false);

        // courtesy to trim it before submitting to validation layer
        var newMemberName = Jquery.trim(memberName()),
            dto = Schema.member.create(newMemberName);

        memberName(newMemberName);

        if (!Schema.member.validate(dto, errorMessages)) {
            checkingMemberName(false);
        }
        else {
            DataContext.saveMember(dto, function (saveResult) {
                checkingMemberName(false);
                if (saveResult) {
                    goodMemberName(true);
                } else {
                    errorMessages.push('That Member name is taken');
                }
            });
        }
    }

    return {
        memberName: memberName,
        checkingMemberName: checkingMemberName,
        goodMemberName: goodMemberName,
        errorMessages: errorMessages,
        invalidMemberName: invalidMemberName,
        save: save
    };
});