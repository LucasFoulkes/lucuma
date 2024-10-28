const LocationSchema = {
    type: {
        type: String,
        enum: [
            'Point',
            'LineString',
            'Polygon',
            'MultiPoint',
            'MultiLineString',
            'MultiPolygon',
            'GeometryCollection'
        ],
        required: true
    },
    coordinates: {
        type: Array,
        required: function () {
            return this.type !== 'GeometryCollection';
        }
    },
    geometries: {
        type: Array,
        required: function () {
            return this.type === 'GeometryCollection';
        }
    }
};

module.exports = LocationSchema;
