// todos
Todos = new Mongo.Collection('todos');

Todo = Astro.Class({
  name: 'Todo',
  collection: Todos,
  fields: ['listId', 'userId', 'text', 'checkedDays', 'createdAt'],
  methods: {
    // 今日タスクが完了しているか否かを返す
    checked: function() {
      var checkedDays = (this.checkedDays instanceof Array) ? this.checkedDays : [];
      if(checkedDays.indexOf(getDate()) >= 0){
        return true;
      } else {
        return false;
      }
    }
  }
});

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
    check(attributes, {todoId: String, checked: Boolean});

    // 対象の todos がない場合は終了
    var todo = Todos.findOne({_id: attributes.todoId, userId: Meteor.userId()});
    if (todo == null) return false;

    // チェック済の日付のリスト を更新
    var checkedDays;
    if (attributes.checked) {
      checkedDays = (todo.checkedDays instanceof Array) ? todo.checkedDays : [];
      checkedDays.push(getDate());
    } else {
      // 一致する日付を削除
      checkedDays = todo.checkedDays.filter(function(v){
        return v != getDate();
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
  }
});