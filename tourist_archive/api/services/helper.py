import os, time

#!!! Do not move function, evaluating path depends on current path !!!
def get_file_path(file_name):
  # Make a file path to uploaded file
  file_name = file_name.replace('/data/', '')

  module_dir = os.path.dirname(__file__)
  module_dir = module_dir.replace('api/services', 'data')
  file_path = os.path.join(module_dir, file_name)

  # Check if file exists and is not empty
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