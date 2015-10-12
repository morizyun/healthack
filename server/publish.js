Meteor.publish('Lists', function() {
  if (this.userId) {
    // Get user_id
    var user_id = this.userId;

    // Create Default Collections for New User
    if (UserProperties.find({userId: this.userId}).count() === 0) {
      var data = [
        {name: "サプリメント",
          items: []
        },
        {name: "食事",
          items: [
            "朝食",
            "昼食",
            "夕食"
          ]
        },
        {name: "運動",
          items: []
        }
      ];

      var timestamp = (new Date()).getTime();

      // Create List
      _.each(data, function(list) {
        var list_id = Lists.insert({
          userId: user_id,
          name: list.name,
          incompleteCount: list.items.length
        });

        // Create Todos
        _.each(list.items, function(text) {
          Todos.insert({
            listId: list_id,
            text: text,
            createdAt: new Date(timestamp)
          });
          timestamp += 1; // ensure unique timestamp.
        });
      });

      // UserProperties
      UserProperties.insert({
        userId: user_id,
        bootstrapData: true
      })
    }

    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});
