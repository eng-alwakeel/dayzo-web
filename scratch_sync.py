import os
import json
import base64

def get_files(root_dir, exclude_files=['test.txt'], exclude_dirs=['.git', '.agents']):
    file_list = []
    for root, dirs, files in os.walk(root_dir):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file in exclude_files:
                continue
            
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, root_dir)
            
            try:
                # Skip binary files for now or handle appropriately
                # For this project, mostly text/source files
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    file_list.append({
                        "path": rel_path,
                        "content": content
                    })
            except (UnicodeDecodeError, PermissionError):
                # If it's binary or inaccessible, skip for this sync
                # Images should ideally be pushed too, but large binary push via JSON is tricky
                pass
    return file_list

files = get_files('.')
# Split into chunks of 100 files to avoid massive payloads, 
# but user wants single commit. mcp_github_push_files handles multiple files in one commit.
# I'll output the JSON to a file first to see size.
with open('project_files.json', 'w', encoding='utf-8') as f:
    json.dump(files, f)
