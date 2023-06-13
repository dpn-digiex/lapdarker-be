export const mongooseTypeData = {
    multipleMongooseToObject: (mongooses) => mongooses.map(mongoose => mongoose.toObject()),
    mongooseToObject: (mongoose) => mongoose ? mongoose.toObject() : mongoose,
    checkType : (value) => Object.prototype.toString.call(value).slice(8,-1).toLowerCase() || ''
};