from django.contrib.gis.geos import LineString
from gpx_converter import Converter
from collections import defaultdict
import gpxpy
import gpxpy.gpx
import pandas
import time
import os

from .models import FileModel
from .models import RouteModel
from .models import UserModel

### Services

def parse_file(file_data):
  #TODO: Make call logic which depends on file extension and call services for each 
  parse_gpx_file(file_data)

def get_file_path(file_name):
  # Make a file path to uploaded file
  file_name = file_name.replace('/data/', '')
  module_dir = os.path.dirname(__file__)
  module_dir = module_dir.replace('api', 'data')
  file_path = os.path.join(module_dir, file_name)

  # Check if gpx file exists and is not empty
  validated = validate_file(file_path, True)
  if validated == 1: return "The file is empty!"
  if validated == 2: return "Error, the file could not be uploaded"
  return validated

def validate_file(file_path, flag):
  try:
    # Check if file is empty or not
    if os.path.getsize(file_path) > 0:
      return file_path
    else:
      return 1
  except OSError as e:
    # File does not exist or is inaccessible
    if flag == True:
      print("Error uploading the file, retrying in 2 seconds")
      time.sleep(2)
      validate_file(file_path, False)
    return 2


def parse_gpx_file(file_data):
  file_name = file_data['file']
  # Getting file path from relative path
  file_path = get_file_path(file_name)

  with open(file_path, 'r', encoding='utf-8') as gpx_file:
    gpx = gpxpy.parse(gpx_file)
  
  # Parsing route data
  # format -> dictionary[track_name][array of point objects]
  file_routes_data = defaultdict(list)
  for track in gpx.tracks:
    for segments in track.segments:
      for points in segments.points:
        file_routes_data[track.name].append({
          "latitude": points.latitude,
          "longitude": points.longitude,
          "elevation": points.elevation,
          "time": points.time
        })

  # Create route from route data
  create_routes(file_routes_data, file_data)


def create_routes(file_routes_data, file_data):
  file = FileModel.objects.get(pk=file_data['id']) 
  for route_name in file_routes_data:
    coordinates = []
    for route_coordinates in file_routes_data[route_name]:
      coordinates.append((route_coordinates['latitude'], route_coordinates['longitude']))
    points_line = LineString(coordinates)
    RouteModel.objects.create(route_name=route_name, file_id=file, points_line=points_line)
  print(RouteModel.objects.all())
