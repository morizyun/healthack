// todos
Todos = new Mongo.Collection('todos');

Meteor.methods({
  todoInsert: function(attributes){
    check(attributes, {listId: String, text: String});

    Todos.insert({
      listId: attributes.listId,
      userId: Meteor.userId(),
      text: attributes.text,
      checkedDays: [],
      createdAt: new Date()
    });
  },
  todoUpdate: function(attributes) {
    check(attributes, {todoId: String, text: String});

    // 対象の todos がない場合は終了
    var todo = Todos.findOne({_id: attributes.todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    Todos.update(attributes.todoId, {$set: {text: attributes.text}});
  },
  todoCheckUpdate: function(attributes) {
    check(attributes, {todoId: String, checked: Boolean, checkedAt: String});

    // 対象の todos がない場合は終了
    var todo = Todos.findOne({_id: attributes.todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    // チェック済の日付のリスト を更新
    var checkedDays;
    if (attributes.checked) {
      checkedDays = (todo.checkedDays instanceof Array) ? todo.checkedDays : [];
      checkedDays.push(attributes.checkedAt);
    } else {
      // 一致する日付を削除
      checkedDays = todo.checkedDays.filter(function(v){
        return v != attributes.checkedAt;
      });
    }

    Todos.update(attributes.todoId, {$set: {checkedDays: checkedDays}});
  },
  todoDelete: function(todoId) {
    check(todoId, String);

    // 対象の todos がない場合は終了
    var todo = Todos.findOne({_id: todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    Todos.remove(todoId);
  },
  todoChecked: function(attributes) {
    check(attributes, {todoId: String, checkedAt: String});

    var todo = Todos.findOne({_id: attributes.todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    var checkedDays = (todo.checkedDays instanceof Array) ? todo.checkedDays : [];

    if(checkedDays.indexOf(attributes.checkedAt) >= 0){
      return true;
    } else {
      return false;
    }
  },
  todoCheckedStr: function(attributes) {
    check(attributes, {todoId: String, checkedAt: String});

    var todo = Todos.findOne({_id: attributes.todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    var checkedDays = (todo.checkedDays instanceof Array) ? todo.checkedDays : [];

    if(checkedDays.indexOf(attributes.checkedAt) >= 0){
      return 'checked';
    } else {
      return '';
    }
  }
});