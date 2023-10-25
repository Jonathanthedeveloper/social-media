/**
 * A class representing an API filter.
 */
/**
 * A utility class for filtering, sorting, limiting, and paginating API queries.
 */
class ApiFilter {

    /**
     * Create an API filter.
     * @param {Object} query - The query object.
     * @param {Object} queryObj - The query object.
     */
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }

    /**
     * Filter the query.
     * @param {Object} options - The options object.
     * @param {Boolean} options.singleDoc - Whether to use findOne method or not.
     * @returns {ApiFilter} - The filtered query object.
     */
    filter({singleDoc = false}) {
        const queryObj = { ...this.queryObj };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        if (singleDoc) {
            this.query = this.query.findOne(JSON.parse(queryStr));
        } else {
            this.query = this.query.find(JSON.parse(queryStr));
        }

        return this;
    }

    /**
     * Sort the query.
     * @returns {ApiFilter} - The sorted query object.
     */
    sort() {
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    /**
     * Limit the fields in the query.
     * @returns {ApiFilter} - The limited query object.
     */
    limitFields() {
        if (this.queryObj.fields) {
            const fields = this.queryObj.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    /**
     * Paginate the query.
     * @returns {ApiFilter} - The paginated query object.
     */
    paginate() {
        const page = this.queryObj.page * 1 || 1;
        const limit = this.queryObj.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFilter;
