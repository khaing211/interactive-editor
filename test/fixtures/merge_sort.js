merge_sort = function(list) {
  var i, j, left, middle, right, _ref;
  if (list.length === 1) return list;
  left = [];
  right = [];
  middle = list.length / 2;
  for (i = 0; 0 <= middle ? i < middle : i > middle; 0 <= middle ? i++ : i--) {
    left.push(list[i]);
  }
  for (j = middle, _ref = list.length; middle <= _ref ? j <= _ref : j >= _ref; middle <= _ref ? j++ : j--) {
    right.push(list[j]);
  }
  left = merge_sort(left);
  right = merge_sort(right);
  return merge(left, right);
};

merge = function(left, right) {
  var result;
  result = [];
  while (left.length > 0 || right.length > 0) {
    if (left.length > 0 && right.length > 0) {
      if (left[0] <= right[0]) {
        result.push(left[0]);
        left = left.slice(1, left.length + 1 || 9e9);
      } else {
        result.push(right[0]);
        right = right.slice(1, right.length + 1 || 9e9);
      }
    } else if (left.length > 0) {
      result.push(left[0]);
      left = left.slice(1, left.length + 1 || 9e9);
    } else if (right.length > 0) {
      result.push(right[0]);
      right = right.slice(1, right.length + 1 || 9e9);
    }
  }
  return result;
};

