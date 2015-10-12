var ERRORS_KEY = 'homeErrors';

Template.home.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.home.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.home.events({
  'submit': function(event, template) {
    event.preventDefault();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();

    var errors = {};

    if (! email) {
      errors.email = 'メールアドレスは必須です';
    }

    if (! password) {
      errors.password = 'パスワードは必須です';
    }

    if (confirm !== password) {
      errors.confirm = 'パスワードとパスワード(確認用)が異なります';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email: email,
      password: password
    }, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      Router.go('home');
    });
  }
});
