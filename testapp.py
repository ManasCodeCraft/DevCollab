import os
import re

def remove_string_from_file(file_path, string_to_remove):
    # Read the contents of the file
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Remove the string from the content
    updated_content = re.sub(string_to_remove, '', content)
    
    # Write the updated content back to the file
    with open(file_path, 'w') as file:
        file.write(updated_content)

def recursively_remove_string(directory, string_to_remove):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')  # Exclude node_modules directory from traversal
        for file in files:
            if(file.endswith('.js')):
                file_path = os.path.join(root, file)
                remove_string_from_file(file_path, string_to_remove)

if __name__ == "__main__":
    directory_to_search = os.path.dirname(__file__)
    string_to_remove = "http://localhost:7000"
    recursively_remove_string(directory_to_search, string_to_remove)
