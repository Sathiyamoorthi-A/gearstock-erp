# fix_final_issues.py
import os
import re

def fix_user():
    filepath = "src/main/java/com/gearstock/model/User.java"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicates of isEnabled()
    # It generated:
    # public boolean isEnabled() {
    #     return this.enabled;
    # }
    # which conflicts with:
    # @Override
    # public boolean isEnabled() {
    #     return enabled;
    # }
    
    # Remove the generated getter
    content = content.replace("""    public boolean isEnabled() {
        return this.enabled;
    }""", "")
    
    # Remove any @Builder.Default or Builder.Default
    content = re.sub(r'@?Builder\.Default\r?\n', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed User.java")

def clean_builder_default(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    # Remove any @Builder.Default or Builder.Default
    content = re.sub(r'@?Builder\.Default\r?\n', '', content)
    # Also handle space separated
    content = re.sub(r'@?Builder\.Default\s+', '', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned Builder.Default in: {filepath}")

def main():
    fix_user()
    
    # Clean Builder.Default from all model files
    model_dir = "src/main/java/com/gearstock/model"
    for filename in os.listdir(model_dir):
        if filename.endswith(".java"):
            clean_builder_default(os.path.join(model_dir, filename))

if __name__ == '__main__':
    main()
