import os

def print_directory_tree(directory, indent="", prefix=""):
    """Recursively print the directory tree starting from the given directory."""
    # Get list of items in the directory, sorted to ensure consistent output
    items = sorted(os.listdir(directory))
    for index, item in enumerate(items):
        path = os.path.join(directory, item)
        # Determine if this is the last item for proper formatting
        is_last = index == len(items) - 1
        # Print the current item with appropriate prefix
        print(f"{indent}{prefix}{item}")
        if os.path.isdir(path):
            # If it's a directory, recurse with updated indent and prefix
            new_prefix = "└── " if is_last else "├── "
            new_indent = indent + ("    " if is_last else "│   ")
            print_directory_tree(path, new_indent, new_prefix)

if __name__ == "__main__":
    # Specify the root directory of the project using raw string for Windows path
    project_root = r"C:\Users\Swastik\Desktop\Hotel Management System\Backend"
    print(project_root)
    print_directory_tree(project_root, "", "└── ")