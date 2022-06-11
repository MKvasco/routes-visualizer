from django.contrib.gis.geos import LineString

from ..models import FileModel
from ..models import RouteModel

### Services

def create_routes(file_routes_data, file_data):
  file = FileModel.objects.get(pk=file_data['id'])
  for route_name in file_routes_data:
    coordinates = []
    for route_coordinates in file_routes_data[route_name]:
      coordinates.append((route_coordinates['longitude'], route_coordinates['latitude']))
    points_line = LineString(coordinates)
    RouteModel.objects.create(route_name=route_name, file=file, points_line=points_line)
