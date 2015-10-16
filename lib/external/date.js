// 今日の日付を yyyymmdd 形式で取得
getDate = function() {
  var now = new Date();
  var year = now.getFullYear();
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var date = ("0" + (now.getDate() + 1)).slice(-2);

  return year + month + date;
}