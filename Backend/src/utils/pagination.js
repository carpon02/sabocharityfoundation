export default class Pagination {
  constructor(page = 1, limit = 10, total = 0) {
    this.page = parseInt(page);
    this.limit = parseInt(limit);
    this.total = parseInt(total);
    this.pages = Math.ceil(this.total / this.limit);
    this.hasNext = this.page < this.pages;
    this.hasPrev = this.page > 1;
  }

  static paginate(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
  }

  toJSON() {
    return {
      page: this.page,
      limit: this.limit,
      total: this.total,
      pages: this.pages,
      hasNext: this.hasNext,
      hasPrev: this.hasPrev,
    };
  }
}
