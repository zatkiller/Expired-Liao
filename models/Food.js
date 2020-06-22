class Food {
	// constructor(id, title, expiry, date, quantity) {
	// 	this.id = id;
	// 	this.title = title;
	// 	this.expiry = expiry;
	// 	this.date = date;
	// 	this.quantity = quantity;
	// }
	constructor(id, ownerId, title, date, quantity) {
		this.id = id;
		this.ownerId = ownerId;

		this.title = title;
		this.date = date;
		this.quantity = quantity;
	}
}

export default Food;
