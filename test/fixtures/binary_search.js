function binarySearch(needle, haystack, case_insensitive) {
	if (typeof(haystack) === 'undefined' || !haystack.length) return -1;
	
	var high = haystack.length - 1;
	var low = 0;
	case_insensitive = (typeof(case_insensitive) === 'undefined' || case_insensitive) ? true:false;
	needle = (case_insensitive) ? needle.toLowerCase():needle;
	
	while (low <= high) {
		mid = parseInt((low + high) / 2)
		element = (case_insensitive) ? haystack[mid].toLowerCase():haystack[mid];
		if (element > needle) {
			high = mid - 1;
		} else if (element < needle) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	
	return -1;
};
