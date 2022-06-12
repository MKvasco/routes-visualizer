from gpx_converter import Converter
from collections import defaultdict
import gpxpy
import gpxpy.gpx

from ..service import create_routes
from ..helper import get_file_path


def parse_gpx_file(file_data):
  file_path = get_file_path(file_data['file'])
  # TODO: validate file if it is in correct form -> if not return int 400
  with open(file_path, 'r', encoding='utf-8') as gpx_file:
    gpx = gpxpy.parse(gpx_file)
  
  # Validate if file has tracks
  if gpx.tracks is None: return 400
  if len(gpx.tracks) == 0: return 400


  # Parsing route data 
  routes_data = defaultdict(list)

  for track in gpx.tracks:
    for segments in track.segments:
      for points in segments.points:
        routes_data[track.name].append({
          "latitude": points.latitude,
          "longitude": points.longitude,
          "elevation": points.elevation,
          "time": points.time
        })
  # Create route from route data
  create_routes(routes_data, file_data)
  return 200