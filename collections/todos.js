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
