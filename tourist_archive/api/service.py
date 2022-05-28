from gpx_converter import Converter
from collections import defaultdict
import gpxpy
import gpxpy.gpx
import pandas
import time
import os

from .models import FileModel
from .models import RouteModel

### Services

def parse_file(filename):
  parse_gpx_file(filename)

def get_file_path(file):
  # Make a file path to uploaded file
  file = file.replace('/api/', '')
  module_dir = os.path.dirname(__file__)
  file_path = os.path.join(module_dir, file)
  # Check if gpx file exists and is not empty
  validated = validate_file(file_path, True)
  if validated == 1: return "The file is empty!"
  if validated == 2: return "Error, the file could not be uploaded"
  return validated

def validate_file(file_path, flag):
  try:
    if os.path.getsize(file_path) > 0:
      return file_path
    else:
      # File is empty!
      return 1
  except OSError as e:
    # Does not exist or inaccessible
    if flag == True:
      print("Error uploading the file, retrying in 2 seconds")
      time.sleep(2)
      validate_file(file_path, False)
    return 2


def parse_gpx_file(filename):
  # Getting file path from relative path
  file_path = get_file_path(filename)
  with open(file_path, 'r', encoding='utf-8') as gpx_file:
    gpx = gpxpy.parse(gpx_file)
  
  # Parsing route data
  # format -> dictionary[track_name][array of point objects]
  route_data = defaultdict(list)
  for track in gpx.tracks:
    for segments in track.segments:
      for points in segments.points:
        route_data[track.name].append({
          "latitude": points.latitude,
          "longitude": points.longitude,
          "elevation": points.elevation,
          "time": points.time
        })
  for key in route_data:
    for data in route_data[key]:
      print(key ,data['latitude'], data['longitude'])

  #TODO:create linestring from pointdata
  return route_data

def create_route(filename):
  # Creating route from data
  pass
      