import os

def print_tree(start_path='.', prefix=''):
    items = sorted(os.listdir(start_path))
    pointers = ['├── '] * (len(items) - 1) + ['└── ']
    
    for pointer, item in zip(pointers, items):
        path = os.path.join(start_path, item)
        print(prefix + pointer + item)
        if os.path.isdir(path):
            extension = '│   ' if pointer == '├── ' else '    '
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    print("📁 Project Structure:\n")
    print_tree(".")
