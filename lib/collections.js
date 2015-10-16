Lists = new Mongo.Collection('lists');

List = Astro.Class({
  name: 'List',
  collection: Lists,
  fields: ['userId', 'name'],
  methods: {
    incompleteTodoCount: function() {
      var todos = Todos.find({listId: this._id});

      // チェック済の Todos をカウント
      var checkedToday = [];
      todos.forEach(function(todo){
        var checkedDays = todo.checkedDays instanceof Array ? todo.checkedDays : [];
        checkedDays.forEach(function(day){
          if (day == getDate()) checkedToday.push(todo._id);
        });
      });

      // 未完了の件数を返す
      return todos.count() - checkedToday.length;
    }
  }
});

// Calculate a default name for a list in the form of 'List A'
Lists.defaultName = function() {
  var nextLetter = 'A', nextName = 'リスト ' + nextLetter;
  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'リスト ' + nextLetter;
  }

  return nextName;
};

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

// ユーザーの属性情報
UserProperties = new Mongo.Collection('user_properties')