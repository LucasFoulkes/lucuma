# lucuma
1. use an array of coordinates for the location
2. use a radius and isCircle property to determine if the location is a circle

or use geojson for the location

benefits of using an array of coordinates:
- easier to understand
- easier to validate
- more flexible
- can be used to create a circle
- can be used to create a polygon

benefits of using geojson:
- more flexible
- can be used to create a circle
- can be used to create a polygon
- more readable
- more consistent

example of using an array of coordinates:
```json
{
    "type": "Polygon",
    "coordinates": [
        [125.6, 10.1],
        [125.7, 10.2],
        [125.8, 10.3],
        [125.6, 10.1]  // Close the polygon by repeating first point
    ]
}
```
circle example:
```json
{
    "type": "Point",
    "coordinates": [125.6, 10.1],
    "radius": 1000
}
```

example of using geojson:
```json
{
    "type": "Polygon",
    "coordinates": [
        [125.6, 10.1],
        [125.7, 10.2],
        [125.8, 10.3],
        [125.6, 10.1]  // Close the polygon by repeating first point
    ]
}
```
example of a circle:
```json
{
    "type": "Point",
    "coordinates": [125.6, 10.1],
    "radius": 1000
}
```