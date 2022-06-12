from django.contrib.gis.geos import LineString

from ..models import FileModel
from ..models import RouteModel

### Services

def create_routes(routes_data, file_data):
  file = FileModel.objects.get(pk=file_data['id'])
  for route_name in routes_data:
    #TODO: find a better way to get elevation
    elevation_min = 100000;
    elevation_max = -100000;
    coordinates = []
    for route_coordinates in routes_data[route_name]:
      coordinates.append((route_coordinates['longitude'], route_coordinates['latitude']))
      if(route_coordinates['elevation'] != None):
        elevation_min = min(elevation_min, route_coordinates['elevation'])
        elevation_max = max(elevation_max, route_coordinates['elevation'])

    route_line_string = LineString(coordinates)
    if elevation_max == -100000: elevation_max=None
    if elevation_min == 100000: elevation_min=None
    RouteModel.objects.create(
      route_name=route_name,
      file=file,
      route_line_string=route_line_string,
      route_points_count=len(routes_data[route_name]),
      elevation_min=elevation_min,
      elevation_max=elevation_max,
      started_at=routes_data[route_name][0]['time'],
      ended_at=routes_data[route_name][-1]['time']
      )
