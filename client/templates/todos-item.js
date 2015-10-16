var EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  checked: function() {
    return this.checked();
  },
  checkedClass: function() {
    return this.checked() && 'checked';
  },
  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  }
});

Template.todosItem.events({
  'change [type=checkbox]': function(event) {
    var checked = $(event.target).is(':checked');

    // todos を取得
    var todo = Todos.find({ _id: this.id });

    // 変更済の日付 を更新
    var checkedDays;
    if (checked) {
      checkedDays = (todo.checkedDays instanceof Array) ? todo.checkedDays : [];
      checkedDays.push(getDate());
    } else {
      // 一致する日付を削除
      checkedDays = checkedDays.filter(function(v){
        return v != getDate();
      });
    }

    Todos.update(this._id, {$set: {checkedDays: checkedDays}});
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
    Todos.update(this._id, {$set: {text: event.target.value}});
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item': function() {
    Todos.remove(this._id);
  }
});