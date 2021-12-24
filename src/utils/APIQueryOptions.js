class APIQueryOptions {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //create copy of query object
    const queryObj = { ...this.queryString };

    //create an array of excluded fields. These fields are keywords for other methods.
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Adding >= > <= <
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //Create fuzzy seach on name field using RegEx
    const parsedStr = JSON.parse(queryStr);

    const searchObj = {
      ...parsedStr,
      name: new RegExp(parsedStr.name, 'i'),
    };

    this.query.find(searchObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //sort takes in a string with no commas. So get rid of commas when there are multiple sort parameters
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      //If sort is not passed in, sort by most recent
      this.query.sort('-createdAt');
    }
    return this;
  }

  projection() {
    if (this.queryString.fields) {
      //Select accepts the syntax query.select(['name', 'createdAt']) or query.select('name createdAt')

      this.query.select(`${this.queryString.fields}`.split(','));
    } else {
      // If no fields are specified remove the __v from results. It isn't necessary for client but is necessary for mongodb behind the scenes
      this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    //Page requsted by user in querySting
    const page = this.queryString.page * 1 || 1;
    //Limit of results per page requested by user in queryString
    const limit = this.queryString.limit * 1 || 25;
    //Skip calcucated based on page requested and limit specified
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIQueryOptions;
