import os

from .parse_csv import parse_csv_file
from .parse_kml import parse_kml_file
from .parse_gpx import parse_gpx_file

#Parse files based on file type
def parse_file(file_data):
  file_ext = os.path.splitext(file_data['file'])[-1]
  if file_ext == ".gpx": return parse_gpx_file(file_data)
  elif file_ext == ".kml": return parse_kml_file(file_data)
  elif file_ext == ".csv": return parse_csv_file(file_data)
  else: return 400