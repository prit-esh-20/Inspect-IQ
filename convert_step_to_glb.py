import cadquery as cq
from cadquery import exporters
import os

# Load the STEP file
step_file = "D:/Code Lab/Projects/Mini Projects/Mini Project TE/usb hub.step"
output_dir = "D:/Code Lab/Projects/Mini Projects/Mini Project TE/public/models"
output_file = os.path.join(output_dir, "pcb.glb")

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Load the STEP file
shape = cq.importers.importStep(step_file)

# Export to GLB with explicit type
exporters.export(shape, output_file, exportType="GLB")
print(f"Successfully converted {step_file} to {output_file}")