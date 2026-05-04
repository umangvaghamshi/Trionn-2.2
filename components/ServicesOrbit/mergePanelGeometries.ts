import * as THREE from "three";

/**
 * Concatenates non-indexed triangle soups (position + normal) into one draw call.
 * Same vertices/normals as separate meshes — no visual change.
 */
export function mergePanelGeometries(
  geometries: THREE.BufferGeometry[],
): THREE.BufferGeometry | null {
  const valid = geometries.filter(
    (g) => g.attributes.position && g.attributes.normal,
  );
  if (!valid.length) return null;
  if (valid.length === 1) return valid[0]!;

  let floatCount = 0;
  for (const g of valid) {
    floatCount += (g.attributes.position as THREE.BufferAttribute).count * 3;
  }
  const pos = new Float32Array(floatCount);
  const norm = new Float32Array(floatCount);
  let offset = 0;
  for (const g of valid) {
    const pa = g.attributes.position.array as Float32Array;
    const na = (g.attributes.normal as THREE.BufferAttribute)
      .array as Float32Array;
    pos.set(pa, offset);
    norm.set(na, offset);
    offset += pa.length;
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(norm, 3));
  return merged;
}
