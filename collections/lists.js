// Lists
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

Meteor.methods({
  listInsert: function() {
    var list = {name: Lists.defaultName(), userId: Meteor.user()._id}
    list._id = Lists.insert(list);
    return list;
  },
  listUpdate: function(attributes) {
    check(attributes, {listId: String, name: String});

    // 対象の list がない場合は処理終了
    var list = List.findOne({_id: attributes.listId, userId: Meteor.userId()});
    if (list == null) return false;

    Lists.update(attributes.listId, {$set: {name: attributes.name}});
  },
  listDelete: function(listId) {
    check(listId, String);

    // 対象の list がない場合は処理終了
    var list = List.findOne({_id: listId, userId: Meteor.userId()});
    if (list == null) return false;

    Todos.find({listId: listId, userId: Meteor.userId()}).forEach(function(todo) {
      Todos.remove(todo._id);
    });
    Lists.remove(listId);
  }
});