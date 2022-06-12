from collections import defaultdict
import csv

from ..service import create_routes
from ..helper import get_file_path

def parse_csv_file(file_data):
  file_path = get_file_path(file_data['file'])
  file = open(file_path)
  csvreader = csv.reader(file)

  # csv header, we will validate and get data based on names in it
  header = []
  header = next(csvreader)
  for i in range(len(header)):
    header[i] = header[i].lower()

  # Validation of required columns
  try:
    route_name_index = header.index("name")
    route_latitude_index = header.index("latitude")
    route_longitude_index = header.index("longitude")
  except:
    return 400

  # Optional parameters
  route_time_index = None
  route_elevation_index = None
  for column in header:
    if (column == "time"): route_time_index = header.index("time")
    if (column == "elevation"): route_elevation_index = header.index("elevation")

  # Sorting rows to tracks
  routes_data = defaultdict(list)

  for row in csvreader:
    # Validations
    if len(row) != len(header): return 400

    tmpLat = row[route_latitude_index]
    if tmpLat[0] == '-' or tmpLat[0] == '+':
      tmpLat = ""
      for index, c in enumerate(row[route_latitude_index]):
        if index != 0 : tmpLat += c
    if tmpLat.replace('.','',1).isdigit() == False: return 400

    tmpLon = row[route_longitude_index]
    if tmpLon[0] == '-' or tmpLon[0] == '+':
      tmpLon = ""
      for index, c in enumerate(row[route_longitude_index]):
        if index != 0: tmpLon += c
    if tmpLon.replace('.','',1).isdigit() == False: return 400

    # Optional parameters
    elevation = None
    if route_elevation_index is not None:
      # TODO: make validations as above in latitudes and longitudes
      if row[route_elevation_index].replace('.','','-',1).isdigit() == False: return 400
      elevation = row[route_elevation_index]
      elevation = float(elevation)

    time = None
    # TODO: validate datetime string
    if route_time_index is not None: time = row[route_time_index]

    routes_data[row[route_name_index]].append({
      "latitude": float(row[route_latitude_index]),
      "longitude": float(row[route_longitude_index]),
      "elevation": elevation,
      "time": time,
    })

  # Create route form route data
  create_routes(routes_data, file_data)

  return 200
