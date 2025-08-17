#!/usr/bin/env python3
import os
import re
import argparse

def fix_underlines(directory, length=75):
    """
    Fix all RST files in directory to have consistent underlining of specified length
    """
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.rst'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Store original content to check if changes were made
                original_content = content
                
                # Fix level 1 headings (====)
                content = re.sub(r'(.*)\n=+\n', r'\1\n' + '=' * length + '\n', content)
                
                # Fix level 2 headings (----)
                content = re.sub(r'(.*)\n-+\n', r'\1\n' + '-' * length + '\n', content)
                
                # Only write if changes were made
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed: {filepath}")
                    count += 1
                    
    print(f"Completed: {count} files modified")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fix RST header underlining to consistent length')
    parser.add_argument('directory', help='Directory containing RST files to process')
    parser.add_argument('--length', '-l', type=int, default=50, 
                        help='Length of underlining (default: 50)')
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.directory):
        print(f"Error: {args.directory} is not a valid directory")
        exit(1)
        
    fix_underlines(args.directory, args.length)