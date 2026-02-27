from PIL import Image
import os

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if the pixel is near-white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            # Convert to fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print("Logo processed successfully.")

if __name__ == "__main__":
    process_logo("logo.png", "logo.png")
