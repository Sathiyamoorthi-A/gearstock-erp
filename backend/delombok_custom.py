# delombok_custom.py
import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Handle Slf4j logger
    if '@Slf4j' in content:
        # Find class name
        class_match = re.search(r'public\s+(?:class|enum|interface)\s+(\w+)', content)
        if class_match:
            classname = class_match.group(1)
            # Remove annotation
            content = content.replace('@Slf4j\n', '').replace('@Slf4j\r\n', '')
            # Insert logger
            logger_decl = f'\n    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger({classname}.class);\n'
            # Insert after the class declaration line
            content = re.sub(
                r'(public\s+(?:class|enum|interface)\s+' + classname + r'\s+[^{]*\{)',
                r'\1' + logger_decl,
                content
            )
            # Remove lombok import
            content = content.replace('import lombok.extern.slf4j.Slf4j;\n', '')
            content = content.replace('import lombok.extern.slf4j.Slf4j;\r\n', '')

    # 2. Handle RequiredArgsConstructor
    if '@RequiredArgsConstructor' in content:
        # Remove annotation
        content = content.replace('@RequiredArgsConstructor\n', '').replace('@RequiredArgsConstructor\r\n', '')
        # Remove import
        content = content.replace('import lombok.RequiredArgsConstructor;\n', '')
        content = content.replace('import lombok.RequiredArgsConstructor;\r\n', '')
        
        # Find class name
        class_match = re.search(r'public\s+class\s+(\w+)', content)
        if class_match:
            classname = class_match.group(1)
            # Find final fields
            fields = re.findall(r'private\s+final\s+([\w<>]+)\s+(\w+)\s*;', content)
            if fields:
                # Generate constructor
                params = ', '.join([f'{f[0]} {f[1]}' for f in fields])
                assignments = '\n'.join([f'        this.{f[1]} = {f[1]};' for f in fields])
                ctor = f'\n    public {classname}({params}) {{\n{assignments}\n    }}\n'
                
                # Insert constructor inside class body
                content = re.sub(
                    r'(public\s+class\s+' + classname + r'\s+[^{]*\{)',
                    r'\1' + ctor,
                    content
                )

    # 3. Handle DTOs in com.gearstock.dto (Convert to Java records where appropriate)
    if 'package com.gearstock.dto;' in content:
        # Check if we can convert to record
        class_match = re.search(r'public\s+class\s+(\w+)', content)
        if class_match:
            classname = class_match.group(1)
            # Find all private fields
            fields = re.findall(r'private\s+([\w<>]+)\s+(\w+)\s*;', content)
            if fields:
                # Create a record definition
                # Keep annotations on fields if any (e.g. @NotBlank)
                # But since the fields in the original DTOs are plain private fields, we can convert directly
                # Let's see if there are validation annotations.
                # Let's parse field declarations with their annotations
                raw_fields = re.findall(r'((?:@[^\n]+\s+)*)private\s+([\w<>]+)\s+(\w+)\s*;', content)
                record_params = []
                for annot, ftype, fname in raw_fields:
                    annot_str = annot.strip() + " " if annot.strip() else ""
                    record_params.append(f'{annot_str}{ftype} {fname}')
                
                record_def = f'public record {classname}(\n    ' + ',\n    '.join(record_params) + '\n) {}'
                
                # Replace the class block entirely with the record
                # Get package and imports
                pkg_imports = re.search(r'^(package com\.gearstock\.dto;.*?)public\s+class\s+' + classname, content, re.DOTALL | re.MULTILINE)
                if pkg_imports:
                    header = pkg_imports.group(1)
                    # Clean up lombok imports from header
                    header = re.sub(r'import lombok\..*?;\r?\n', '', header)
                    content = header + record_def + '\n'

    # 4. Handle Entities in com.gearstock.model (Convert to standard Java POJO with builder)
    elif 'package com.gearstock.model;' in content and ('@Entity' in content or '@Table' in content):
        # Remove Lombok annotations
        annotations_to_remove = ['@Getter', '@Setter', '@NoArgsConstructor', '@AllArgsConstructor', '@Builder']
        for annot in annotations_to_remove:
            content = content.replace(annot + '\n', '').replace(annot + '\r\n', '')
            content = content.replace(annot + ' ', '')
        
        # Clean lombok imports
        content = re.sub(r'import lombok\..*?;\r?\n', '', content)
        
        # Find class name
        class_match = re.search(r'public\s+class\s+(\w+)', content)
        if class_match:
            classname = class_match.group(1)
            
            # Find fields (private Type name;)
            fields = re.findall(r'private\s+([\w<>]+)\s+(\w+)\s*(?:=\s*[^;]+)?\s*;', content)
            
            # Generate default constructor
            default_ctor = f'    public {classname}() {{\n    }}\n\n'
            
            # Generate all-args constructor
            params = ', '.join([f'{f[0]} {f[1]}' for f in fields])
            assignments = '\n'.join([f'        this.{f[1]} = {f[1]};' for f in fields])
            all_args_ctor = f'    public {classname}({params}) {{\n{assignments}\n    }}\n\n'
            
            # Generate getters/setters
            getters_setters = []
            for ftype, fname in fields:
                cap_name = fname[0].upper() + fname[1:]
                # Getter
                if ftype == 'boolean':
                    getters_setters.append(f'    public boolean is{cap_name}() {{\n        return this.{fname};\n    }}')
                else:
                    getters_setters.append(f'    public {ftype} get{cap_name}() {{\n        return this.{fname};\n    }}')
                # Setter
                getters_setters.append(f'    public void set{cap_name}({ftype} {fname}) {{\n        this.{fname} = {fname};\n    }}')
            
            get_set_str = '\n\n'.join(getters_setters) + '\n\n'
            
            # Generate Builder
            builder_fields = '\n'.join([f'        private {f[0]} {f[1]};' for f in fields])
            builder_methods = []
            for ftype, fname in fields:
                builder_methods.append(f'        public {classname}Builder {fname}({ftype} {fname}) {{\n            this.{fname} = {fname};\n            return this;\n        }}')
            
            builder_methods_str = '\n\n'.join(builder_methods)
            build_assignments = ', '.join([f'this.{f[1]}' for f in fields])
            
            builder_class = f'''    public static {classname}Builder builder() {{
        return new {classname}Builder();
    }}

    public static class {classname}Builder {{
{builder_fields}

{builder_methods_str}

        public {classname} build() {{
            return new {classname}({build_assignments});
        }}
    }}
'''
            
            # Insert constructors, getters/setters, and builder inside the class body
            # Let's insert them at the end of the class, just before the closing brace
            # Find the last closing brace
            content = content.strip()
            if content.endswith('}'):
                content = content[:-1] + '\n' + default_ctor + all_args_ctor + get_set_str + builder_class + '}\n'

    # Write changes if any
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed: {filepath}")

def main():
    root_dir = "src/main/java/com/gearstock"
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.java'):
                process_file(os.path.join(dirpath, filename))

if __name__ == '__main__':
    main()
