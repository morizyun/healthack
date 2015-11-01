var EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  checked: ReactivePromise(function (todo) {
    return Meteor.callPromise("todoChecked", {todoId: todo._id, checkedAt: getDate()});
  }, true),

  checkedClass: ReactivePromise(function (todo) {
    return Meteor.callPromise("todoCheckedStr", {todoId: todo._id, checkedAt: getDate()});
  }, ''),

  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  }
});

Template.todosItem.events({
  'change [type=checkbox]': function(event) {
    var checked = $(event.target).is(':checked');
    Meteor.call('todoCheckUpdate', {todoId: this._id, checked: checked, checkedAt: getDate()});
  },

  'focus input[type=text]': function(event) {
    Session.set(EDITING_KEY, this._id);
  },

  'blur input[type=text]': function(event) {
    if (Session.equals(EDITING_KEY, this._id))
      Session.set(EDITING_KEY, null);
  },

  'keydown input[type=text]': function(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },

  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once
  // every 300ms)
  'keyup input[type=text]': _.throttle(function(event) {
    Meteor.call('todoUpdate', {todoId: this._id, text: event.target.value})
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item': function() {
    Meteor.call('todoDelete', this._id);
  }
});