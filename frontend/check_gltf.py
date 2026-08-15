import struct, json
with open('public/models/pcb_realistic.glb', 'rb') as f:
    data = f.read()
json_data = data[20:20+3304]
gltf = json.loads(json_data)
print('GLTF JSON keys:', list(gltf.keys()))
print('Meshes:', len(gltf.get('meshes', [])))
print('Materials:', len(gltf.get('materials', [])))
print('Textures:', len(gltf.get('textures', [])))
print('Images:', len(gltf.get('images', [])))
for i, img in enumerate(gltf.get('images', [])):
    uri = img.get('uri', '')
    print(f'  Image {i}: uri={uri[:80]}...' if len(uri) > 80 else f'  Image {i}: uri={uri}')
    print(f'    bufferView: {img.get("bufferView")}')
    print(f'    mimeType: {img.get("mimeType")}')
for i, tex in enumerate(gltf.get('textures', [])):
    print(f'Texture {i}: source={tex.get("source")}, sampler={tex.get("sampler")}')
for i, mat in enumerate(gltf.get('materials', [])):
    print(f'Material {i}: name={mat.get("name")}')
    if 'pbrMetallicRoughness' in mat:
        pbr = mat['pbrMetallicRoughness']
        if 'baseColorTexture' in pbr:
            print(f'  baseColorTexture: index={pbr["baseColorTexture"].get("index")}')