import { convertCircuitJsonToGltf } from "circuit-json-to-gltf";
import fs from "fs";

// Minimal PCB circuit JSON - just board and components
const circuitJson = [
  {
    type: "pcb_board",
    pcb_board_id: "board1",
    center: { x: 0, y: 0 },
    width: 68.6,
    height: 53.4,
    thickness: 1.6,
  },

  // Simple components (no pins needed for basic generation)
  ...Array.from({ length: 14 }, (_, i) => ({
    type: "pcb_component",
    pcb_component_id: `header_digital_${i}`,
    layer: "top",
    footprint: "pinheader_1x1",
    center: { x: 30, y: 20 - i * 2.54 },
    rotation: 0,
    source_component_id: `digital_${i}`,
    bbox: { x: 29, y: 19.5 - i * 2.54, width: 2, height: 2 },
  })),

  ...Array.from({ length: 6 }, (_, i) => ({
    type: "pcb_component",
    pcb_component_id: `header_analog_${i}`,
    layer: "top",
    footprint: "pinheader_1x1",
    center: { x: 25, y: -20 - i * 2.54 },
    rotation: 0,
    source_component_id: `analog_${i}`,
    bbox: { x: 24, y: -20.5 - i * 2.54, width: 2, height: 2 },
  })),

  ...["vin", "gnd", "5v", "3v3", "reset"].map((name, i) => ({
    type: "pcb_component",
    pcb_component_id: `header_power_${name}`,
    layer: "top",
    footprint: "pinheader_1x1",
    center: { x: -30, y: -20 + i * 2.54 },
    rotation: 0,
    source_component_id: `power_${name}`,
    bbox: { x: -31, y: -20.5 + i * 2.54, width: 2, height: 2 },
  })),

  ...Array.from({ length: 6 }, (_, i) => ({
    type: "pcb_component",
    pcb_component_id: `header_icsp_${i}`,
    layer: "top",
    footprint: "pinheader_1x1",
    center: { x: 20 + (i % 2) * 2.54, y: 22 - Math.floor(i / 2) * 2.54 },
    rotation: 0,
    source_component_id: `icsp_${i}`,
    bbox: { x: 19.5 + (i % 2) * 2.54, y: 21.5 - Math.floor(i / 2) * 2.54, width: 2, height: 2 },
  })),

  // SMD components
  {
    type: "pcb_component",
    pcb_component_id: "usb_connector",
    layer: "top",
    footprint: "usb_a_smd",
    center: { x: -30, y: 0 },
    rotation: 90,
    source_component_id: "usb",
    bbox: { x: -32, y: -1, width: 12, height: 8 },
  },

  {
    type: "pcb_component",
    pcb_component_id: "power_jack",
    layer: "top",
    footprint: "dc_jack",
    center: { x: -30, y: -15 },
    rotation: 0,
    source_component_id: "dc_jack",
    bbox: { x: -33, y: -19, width: 10, height: 8 },
  },

  // Main MCU
  {
    type: "pcb_component",
    pcb_component_id: "mcu_atmega328p",
    layer: "top",
    footprint: "tqfp_32_7x7_p0.8mm",
    center: { x: -5, y: 5 },
    rotation: 0,
    source_component_id: "atmega328p",
    bbox: { x: -8.5, y: 2, width: 7, height: 7 },
  },

  // USB MCU
  {
    type: "pcb_component",
    pcb_component_id: "mcu_atmega16u2",
    layer: "top",
    footprint: "tqfp_32_7x7_p0.8mm",
    center: { x: -18, y: 0 },
    rotation: 0,
    source_component_id: "atmega16u2",
    bbox: { x: -21.5, y: -3, width: 7, height: 7 },
  },

  // Voltage regulator
  {
    type: "pcb_component",
    pcb_component_id: "voltage_regulator",
    layer: "top",
    footprint: "to220_3pin",
    center: { x: -22, y: -15 },
    rotation: 90,
    source_component_id: "ncp1117",
    bbox: { x: -24, y: -19, width: 10, height: 6 },
  },

  // Crystals
  {
    type: "pcb_component",
    pcb_component_id: "crystal_16mhz",
    layer: "top",
    footprint: "crystal_hc49_smd",
    center: { x: 5, y: 5 },
    rotation: 0,
    source_component_id: "xtal_16mhz",
    bbox: { x: 3.5, y: 3.5, width: 5, height: 3 },
  },

  {
    type: "pcb_component",
    pcb_component_id: "crystal_usb",
    layer: "top",
    footprint: "crystal_hc49_smd",
    center: { x: -18, y: -8 },
    rotation: 0,
    source_component_id: "xtal_usb",
    bbox: { x: -19.5, y: -9.5, width: 5, height: 3 },
  },

  // Reset button
  {
    type: "pcb_component",
    pcb_component_id: "reset_button",
    layer: "top",
    footprint: "tactile_switch_6x6",
    center: { x: -25, y: 22 },
    rotation: 0,
    source_component_id: "btn_reset",
    bbox: { x: -26, y: 21, width: 4, height: 4 },
  },

  // LEDs
  ...[
    { id: "led_power", x: -20, y: -18, comp: "led_pwr" },
    { id: "led_l", x: 2, y: 8, comp: "led_l" },
    { id: "led_tx", x: -15, y: 8, comp: "led_tx" },
    { id: "led_rx", x: -15, y: 9.5, comp: "led_rx" },
  ].map((led) => ({
    type: "pcb_component",
    pcb_component_id: led.id,
    layer: "top",
    footprint: "led_0603",
    center: { x: led.x, y: led.y },
    rotation: 0,
    source_component_id: led.comp,
    bbox: { x: led.x - 0.8, y: led.y - 0.4, width: 1.6, height: 0.8 },
  })),

  // Decoupling capacitors
  ...Array.from({ length: 8 }, (_, i) => ({
    type: "pcb_component",
    pcb_component_id: `cap_decouple_${i}`,
    layer: "top",
    footprint: "capacitor_0603",
    center: { x: -10 + (i % 4) * 5, y: 15 - Math.floor(i / 4) * 10 },
    rotation: 0,
    source_component_id: `c_decouple_${i}`,
    bbox: { x: -11 + (i % 4) * 5, y: 14.5 - Math.floor(i / 4) * 10, width: 1.6, height: 0.8 },
  })),

  // Current limiting resistors
  ...Array.from({ length: 4 }, (_, i) => ({
    type: "pcb_component",
    pcb_component_id: `res_led_${i}`,
    layer: "top",
    footprint: "resistor_0603",
    center: { x: 5 + i * 4, y: 10 },
    rotation: 90,
    source_component_id: `r_led_${i}`,
    bbox: { x: 4.5 + i * 4, y: 9, width: 1.6, height: 0.8 },
  })),

  // Mounting holes
  ...[
    { x: -31.5, y: 24 },
    { x: 31.5, y: 24 },
    { x: 31.5, y: -24 },
    { x: -31.5, y: -24 },
  ].map((pos, i) => ({
    type: "pcb_component",
    pcb_component_id: `mounting_hole_${i}`,
    layer: "top",
    footprint: "mounting_hole_3mm",
    center: pos,
    rotation: 0,
    source_component_id: `mh_${i}`,
    bbox: { x: pos.x - 3, y: pos.y - 3, width: 6, height: 6 },
  })),
];

async function generatePCB() {
  try {
    console.log("Generating PCB GLB model...");

    const glb = await convertCircuitJsonToGltf(circuitJson, {
      format: "glb",
      boardTextureResolution: 2048,
      includeModels: false,
      backgroundColor: "#0a1a0a",
    });

    const buffer = Buffer.from(glb);
    fs.writeFileSync("public/models/pcb_realistic.glb", buffer);
    console.log("PCB GLB generated successfully!");
    console.log("File size:", buffer.length, "bytes (", (buffer.length / 1024).toFixed(2), "KB)");
  } catch (error) {
    console.error("Error generating PCB:", error);
  }
}

generatePCB();