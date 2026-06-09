# convert_dtos.py
import os
import re

dto_fields = {
    "CategoryDistributionDto": [
        ("String", "name"),
        ("long", "value"),
        ("String", "color")
    ],
    "DashboardStatsDto": [
        ("long", "totalSkus"),
        ("long", "ordersToday"),
        ("BigDecimal", "revenueMtd"),
        ("long", "lowStockItems"),
        ("long", "newSkusThisMonth"),
        ("double", "orderChangePercent"),
        ("double", "revenueChangePercent"),
        ("long", "lowStockChange")
    ],
    "LoginRequest": [
        ("String", "username"),
        ("String", "password")
    ],
    "LoginResponse": [
        ("String", "token"),
        ("String", "username"),
        ("String", "fullName"),
        ("String", "role"),
        ("String", "department")
    ],
    "LowStockAlertDto": [
        ("String", "partName"),
        ("String", "sku"),
        ("String", "category"),
        ("int", "remaining")
    ],
    "PartDto": [
        ("Long", "id"),
        ("String", "sku"),
        ("String", "name"),
        ("String", "description"),
        ("String", "categoryName"),
        ("int", "quantity"),
        ("int", "reorderLevel"),
        ("BigDecimal", "price"),
        ("BigDecimal", "costPrice"),
        ("String", "supplierName"),
        ("LocalDateTime", "createdAt")
    ],
    "RecentOrderDto": [
        ("String", "orderId"),
        ("String", "partDescription"),
        ("int", "quantity"),
        ("BigDecimal", "amount"),
        ("String", "status")
    ],
    "RegisterRequest": [
        ("String", "username"),
        ("String", "email"),
        ("String", "password"),
        ("String", "fullName"),
        ("String", "role"),
        ("String", "department")
    ],
    "RevenueDataPointDto": [
        ("String", "date"),
        ("BigDecimal", "revenue"),
        ("int", "orders")
    ]
}

def generate_dto_class(classname, fields):
    # Determine imports needed
    imports = []
    if any(f[0] == 'BigDecimal' for f in fields):
        imports.append("import java.math.BigDecimal;")
    if any(f[0] == 'LocalDateTime' for f in fields):
        imports.append("import java.time.LocalDateTime;")
    
    # Validation annotations for LoginRequest
    validation_imports = ""
    if classname == "LoginRequest":
        validation_imports = "import jakarta.validation.constraints.NotBlank;\n"
        
    imports_str = '\n'.join(imports)
    if imports_str:
        imports_str += '\n'
        
    # Field declarations
    field_decls = []
    for ftype, fname in fields:
        if classname == "LoginRequest" and fname in ["username", "password"]:
            field_decls.append(f"    @NotBlank\n    private {ftype} {fname};")
        else:
            field_decls.append(f"    private {ftype} {fname};")
            
    fields_str = '\n\n'.join(field_decls)
    
    # Constructors
    default_ctor = f"    public {classname}() {{\n    }}\n"
    
    params = ', '.join([f'{f[0]} {f[1]}' for f in fields])
    assignments = '\n'.join([f'        this.{f[1]} = {f[1]};' for f in fields])
    all_args_ctor = f"    public {classname}({params}) {{\n{assignments}\n    }}\n"
    
    # Getters/Setters
    getters_setters = []
    for ftype, fname in fields:
        cap_name = fname[0].upper() + fname[1:]
        # Getter
        getters_setters.append(f"    public {ftype} get{cap_name}() {{\n        return this.{fname};\n    }}")
        # Setter
        getters_setters.append(f"    public void set{cap_name}({ftype} {fname}) {{\n        this.{fname} = {fname};\n    }}")
    get_set_str = '\n\n'.join(getters_setters)
    
    # Builder
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
    }}'''

    code = f"""package com.gearstock.dto;

{imports_str}{validation_imports}
public class {classname} {{

{fields_str}

{default_ctor}
{all_args_ctor}
{get_set_str}

{builder_class}
}}
"""
    return code

def main():
    dto_dir = "src/main/java/com/gearstock/dto"
    for classname, fields in dto_fields.items():
        filepath = os.path.join(dto_dir, f"{classname}.java")
        code = generate_dto_class(classname, fields)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"Generated standard DTO: {classname}")

if __name__ == '__main__':
    main()
