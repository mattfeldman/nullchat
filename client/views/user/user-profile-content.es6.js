Template.userProfileContent.events({
    'click .save.button'(event, template) {
        template.$('form').submit();
    }
});
AutoForm.hooks({
    userProfileForm: {
        onSuccess(formType, result) {
            $('.ui.modal').modal('hide');
            sAlert.success("Profile updated.");
        }
    }
});