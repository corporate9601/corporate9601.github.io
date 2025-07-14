import os
import json
import random
from datetime import datetime
from pathlib import Path

def generate_image_metadata(image_dir="gallery-images", output_file="metadata.json"):
    """
    Generate JSON metadata for images in a directory
    
    Args:
        image_dir (str): Directory containing images
        output_file (str): Output JSON file path
    """
    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff']
    
    # Art categories
    categories = ['painting', 'drawing', 'digital', 'mixed-media', 'sculpture', 'photography']
    
    # Descriptive words for artwork titles
    descriptors = [
        "Serene", "Vibrant", "Mystical", "Ethereal", "Dynamic", 
        "Harmonious", "Bold", "Delicate", "Expressive", "Timeless",
        "Whimsical", "Dreamlike", "Luminous", "Textured", "Evocative"
    ]
    
    # Art styles
    styles = [
        "Landscape", "Portrait", "Abstract", "Surreal", "Impressionist",
        "Contemporary", "Minimalist", "Expressionist", "Cubist", "Realist"
    ]
    
    # Subjects
    subjects = [
        "Nature", "Human Form", "Urban Life", "Emotions", "Memory",
        "Dreams", "Relationships", "Still Life", "Wildlife", "Seascape"
    ]
    
    print(f"Scanning directory: {image_dir}")
    
    # Get all image files in directory
    image_files = []
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                image_files.append(file)
    
    if not image_files:
        print("No images found in the specified directory.")
        return
    
    print(f"Found {len(image_files)} image files")
    
    # Generate metadata for each image
    metadata = []
    for i, filename in enumerate(image_files):
        # Generate a title
        title = f"{random.choice(descriptors)} {random.choice(styles)} {random.choice(subjects)}"
        
        # Generate a description
        description = (
            f"This {random.choice(['captivating', 'thought-provoking', 'beautiful', 'expressive'])} "
            f"{random.choice(categories)} showcases the artist's unique perspective on "
            f"{random.choice(['contemporary issues', 'human experience', 'natural beauty', 'emotional depth'])}. "
            f"Created using {random.choice(['traditional', 'innovative', 'experimental'])} techniques."
        )
        
        # Random category
        category = random.choice(categories)
        
        # Random year between 2018 and current year
        year = random.randint(2018, datetime.now().year)
        
        # Create metadata entry
        metadata.append({
            "filename": filename,
            "title": title,
            "description": description,
            "category": category,
            "year": year,
            "dimensions": f"{random.randint(12, 48)}×{random.randint(12, 36)} in",
            "medium": random.choice(["Oil on canvas", "Acrylic", "Watercolor", "Charcoal", 
                                     "Digital", "Mixed media", "Pastel", "Ink"])
        })
    
    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Successfully generated metadata for {len(metadata)} images")
    print(f"Output saved to: {output_file}")
    
    # Generate HTML snippet for embedding
    html_snippet = '<script id="artwork-data" type="application/json">\n'
    html_snippet += json.dumps(metadata, indent=2)
    html_snippet += '\n</script>'
    
    print("\nHTML snippet for embedding in index.html:")
    print(html_snippet)

if __name__ == "__main__":
    # Create images directory if it doesn't exist
    Path("gallery-images").mkdir(exist_ok=True)
    
    generate_image_metadata()
    
    print("\nNext steps:")
    print("1. Add your images to the 'gallery-images' folder")
    print("2. Copy the generated HTML snippet above into your index.html file")
    print("3. Upload all files to GitHub Pages")