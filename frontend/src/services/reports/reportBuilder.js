// ============================================================================
// PDF LAYOUT BUILDER
// ----------------------------------------------------------------------------
// Renders the professional multi-section inspection report with jsPDF. The
// builder is a pure layout function: it consumes the normalized report data
// (see ./reportData.js) and never invents values of its own — every number,
// label and verdict comes from the inspection result passed in.
// ============================================================================

import { jsPDF } from "jspdf";

const NAVY = [9, 14, 32];
const ACCENT = [0, 229, 255];
const SUCCESS = [0, 201, 140];
const DANGER = [229, 72, 77];
const INK = [23, 32, 56];
const MUTED = [110, 122, 148];
const LINE = [226, 232, 240];
const ROW_ALT = [245, 248, 252];
const BOX_BG = [248, 250, 252];
const SUCCESS_TINT = [236, 253, 245];
const SUCCESS_TEXT = [4, 120, 87];
const WHITE = [255, 255, 255];
const HEADER_SUBTEXT = [150, 165, 190];

const PAGE_WIDTH = 210;
const MARGIN = 14;
const CONTENT_WIDTH = 182;
const BOTTOM_LIMIT = 268;

const setFill = (doc, c) => doc.setFillColor(c[0], c[1], c[2]);
const setText = (doc, c) => doc.setTextColor(c[0], c[1], c[2]);
const setStroke = (doc, c) => doc.setDrawColor(c[0], c[1], c[2]);

function ensureSpace(doc, y, needed) {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return MARGIN + 6;
  }
  return y;
}

function sectionTitle(doc, text, y) {
  y = ensureSpace(doc, y, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  setText(doc, INK);
  doc.text(String(text).toUpperCase(), MARGIN, y);
  setFill(doc, ACCENT);
  doc.rect(MARGIN, y + 1.6, 26, 1, "F");
  return y + 7;
}

// ---- Header band ----------------------------------------------------------
function drawHeader(doc, data) {
  setFill(doc, NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 42, "F");
  setFill(doc, ACCENT);
  doc.rect(0, 42, PAGE_WIDTH, 1.1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  setText(doc, WHITE);
  doc.text("PCBVision", MARGIN, 15.5);

  doc.setFontSize(6.2);
  setText(doc, ACCENT);
  doc.text("INTELLIGENT PCB INSPECTION", MARGIN, 21);

  doc.setFontSize(9.5);
  setText(doc, WHITE);
  doc.text("QUALITY INSPECTION REPORT", MARGIN, 28);

  doc.setFontSize(6);
  setText(doc, HEADER_SUBTEXT);
  doc.text(`${data.title} · ${data.reportId}`, MARGIN, 34.5);

  const passed = data.status === "PASS";
  setFill(doc, passed ? SUCCESS : DANGER);
  doc.roundedRect(PAGE_WIDTH - MARGIN - 34, 12, 34, 10, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setText(doc, WHITE);
  doc.text(data.status, PAGE_WIDTH - MARGIN - 17, 19, { align: "center" });

  doc.setFontSize(5.8);
  setText(doc, HEADER_SUBTEXT);
  doc.text(`REPORT ID  ${data.reportId}`, PAGE_WIDTH - MARGIN, 30, { align: "right" });
  doc.text(`PCB  ${data.pcbId}`, PAGE_WIDTH - MARGIN, 35, { align: "right" });
}

// ---- Meta row (report id / pcb id / date / time / model / status) ---------
function drawMetaRow(doc, data, y) {
  const cols = [
    ["REPORT ID", data.reportId],
    ["PCB ID", data.pcbId],
    ["DATE", data.inspectionDate],
    ["TIME", data.inspectionTime],
    ["MODEL", data.model],
    ["STATUS", data.status],
  ];
  const gap = 8;
  const colW = (CONTENT_WIDTH - gap * 5) / 6;
  cols.forEach(([label, value], i) => {
    const x = MARGIN + i * (colW + gap);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.4);
    setText(doc, MUTED);
    doc.text(label, x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    if (label === "STATUS") {
      setText(doc, value === "PASS" ? SUCCESS : DANGER);
    } else {
      setText(doc, INK);
    }
    doc.text(String(value), x, y + 3.6);
  });
  setStroke(doc, LINE);
  doc.line(MARGIN, y + 8, PAGE_WIDTH - MARGIN, y + 8);
  return y + 14;
}

// ---- Executive summary ----------------------------------------------------
function drawMetaPair(doc, label, value, x, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  setText(doc, MUTED);
  doc.text(String(label).toUpperCase(), x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(doc, INK);
  doc.text(String(value), x, y + 4.2);
}

function drawExecutiveSummary(doc, data, y) {
  y = sectionTitle(doc, "Executive Summary", y);
  y = ensureSpace(doc, y, 36);

  const boxW = 54;
  const boxH = 29;
  const passed = data.status === "PASS";
  setFill(doc, passed ? SUCCESS : DANGER);
  doc.roundedRect(MARGIN, y, boxW, boxH, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  setText(doc, WHITE);
  doc.text("INSPECTION RESULT", MARGIN + boxW / 2, y + 10, { align: "center" });
  doc.setFontSize(17);
  doc.text(data.status, MARGIN + boxW / 2, y + 22, { align: "center" });

  const gridX = MARGIN + boxW + 12;
  const gridW = PAGE_WIDTH - MARGIN - gridX;
  const colW = gridW / 2;
  const rowH = 9.6;
  const pairs = [
    ["PCB ID", data.pcbId],
    ["MODEL", data.model],
    ["INSPECTION TIME", data.metrics.duration],
    ["COMPONENTS DETECTED", data.componentsDetected],
    ["DEFECTS DETECTED", data.defectsDetected],
  ];
  pairs.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    drawMetaPair(doc, label, value, gridX + col * colW, y + 3 + row * rowH);
  });
  return y + boxH + 7;
}

// ---- PCB inspection image -------------------------------------------------
function drawInspectionImage(doc, data, imageDataUrl, imageDims, y) {
  y = sectionTitle(doc, "PCB Inspection Image", y);
  y = ensureSpace(doc, y, 60);

  if (imageDataUrl) {
    const maxW = 112;
    const maxH = 84;
    const aspect = imageDims && imageDims.width && imageDims.height
      ? imageDims.width / imageDims.height
      : 1.5;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    const x = (PAGE_WIDTH - w) / 2;
    const format = String(imageDataUrl).startsWith("data:image/png") ? "PNG" : "JPEG";
    doc.addImage(imageDataUrl, format, x, y, w, h);
    setStroke(doc, LINE);
    doc.rect(x - 1, y - 1, w + 2, h + 2);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    setText(doc, MUTED);
    doc.text(`Inspected board frame — ${data.pcbId}`, PAGE_WIDTH / 2, y + h + 5, { align: "center" });
    return y + h + 10;
  }

  const ph = 46;
  setFill(doc, BOX_BG);
  setStroke(doc, LINE);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, ph, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setText(doc, MUTED);
  doc.text("PCB IMAGE NOT AVAILABLE", PAGE_WIDTH / 2, y + ph / 2 + 1, { align: "center" });
  return y + ph + 9;
}

// ---- Generic table ---------------------------------------------------------
function drawTable(doc, y, headers, rows, widths) {
  const padX = 2;
  const cellLine = 3.4;

  const measureRow = (cells) => {
    let lines = 1;
    cells.forEach((cell, i) => {
      const n = doc.splitTextToSize(String(cell), widths[i] - padX * 2).length;
      lines = Math.max(lines, n);
    });
    return 4.2 + lines * cellLine;
  };

  const drawRow = (cells, opts) => {
    const height = measureRow(cells);
    if (opts.fill) {
      setFill(doc, opts.fill);
      doc.rect(MARGIN, y, CONTENT_WIDTH, height, "F");
    }
    let x = MARGIN;
    cells.forEach((cell, i) => {
      doc.setFont("helvetica", opts.bold ? "bold" : "normal");
      doc.setFontSize(7.3);
      setText(doc, opts.color);
      const lines = doc.splitTextToSize(String(cell), widths[i] - padX * 2);
      doc.text(lines, x + padX, y + 3.4);
      x += widths[i];
    });
    y += height;
  };

  drawRow(headers, { fill: NAVY, color: WHITE, bold: true });
  rows.forEach((row, idx) => {
    drawRow(row, { fill: idx % 2 === 1 ? ROW_ALT : null, color: INK, bold: false });
  });
  return y + 5;
}

// ---- Detection results -----------------------------------------------------
function drawDetectionTable(doc, data, y) {
  y = sectionTitle(doc, "Detection Results", y);
  if (data.detections.length === 0) {
    y = ensureSpace(doc, y, 12);
    setFill(doc, BOX_BG);
    setStroke(doc, LINE);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 11, 2.5, 2.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(doc, MUTED);
    doc.text("No component detections were recorded for this inspection.", MARGIN + 4, y + 7.2);
    return y + 16;
  }
  y = ensureSpace(doc, y, 16 + data.detections.length * 8);
  const rows = data.detections.map((d) => [d.id, d.result, d.observation]);
  return drawTable(doc, y, ["COMPONENT", "RESULT", "OBSERVATION"], rows, [34, 20, 128]);
}

// ---- Defect report ---------------------------------------------------------
function drawDefects(doc, data, y) {
  y = sectionTitle(doc, "Defect Report", y);
  if (data.defects.length === 0) {
    y = ensureSpace(doc, y, 12);
    setFill(doc, SUCCESS_TINT);
    setStroke(doc, [204, 244, 222]);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 11, 2.5, 2.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(doc, SUCCESS_TEXT);
    doc.text(`No defects detected — all checks passed (${data.componentsDetected} component(s) verified).`, MARGIN + 4, y + 7.2);
    return y + 16;
  }
  y = ensureSpace(doc, y, 16 + data.defects.length * 9);
  const rows = data.defects.map((d) => [d.class, d.location, d.severity, d.observation]);
  return drawTable(doc, y, ["DEFECT CLASS", "LOCATION", "SEVERITY", "OBSERVATION"], rows, [40, 34, 22, 86]);
}

// ---- Explainable AI --------------------------------------------------------
function drawXai(doc, data, y) {
  y = sectionTitle(doc, "Explainable AI Analysis", y);
  const blocks = [
    ["WHAT WAS FOUND?", data.xai.whatWasFound],
    ...(data.xai.whyDidItPass ? [["WHY DID IT PASS?", data.xai.whyDidItPass]] : []),
    ["RECOMMENDED ACTION", data.xai.recommendedAction],
  ];
  for (const [label, text] of blocks) {
    y = ensureSpace(doc, y, 22);
    setFill(doc, ACCENT);
    doc.rect(MARGIN, y - 2.6, 1.6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(doc, INK);
    doc.text(label, MARGIN + 5, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(doc, MUTED);
    const lines = doc.splitTextToSize(String(text), CONTENT_WIDTH - 8);
    doc.text(lines, MARGIN + 5, y + 4.6);
    y += 5 + lines.length * 3.4;
  }
  return y + 2;
}

// ---- Compact metrics band ---------------------------------------------------
function drawMetrics(doc, data, y) {
  y = sectionTitle(doc, "Inspection Metrics", y);
  y = ensureSpace(doc, y, 20);
  const gap = 6;
  const boxW = (CONTENT_WIDTH - gap * 3) / 4;
  const boxH = 17;
  const boxes = [
    ["INSPECTION DURATION", data.metrics.duration],
    ["DETECTED COMPONENTS", data.metrics.components],
    ["DEFECTS", data.metrics.defects],
    ["RESULT", data.metrics.result],
  ];
  boxes.forEach(([label, value], i) => {
    const x = MARGIN + i * (boxW + gap);
    setFill(doc, BOX_BG);
    setStroke(doc, LINE);
    doc.roundedRect(x, y, boxW, boxH, 2.5, 2.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.6);
    setText(doc, MUTED);
    doc.text(label, x + boxW / 2, y + 6, { align: "center" });
    doc.setFontSize(11);
    if (value === "PASS") setText(doc, SUCCESS);
    else if (value === "FAIL") setText(doc, DANGER);
    else setText(doc, INK);
    doc.text(String(value), x + boxW / 2, y + 13.2, { align: "center" });
  });
  return y + boxH + 4;
}

// ---- Footer (applied to every page) ----------------------------------------
function drawFooter(doc, data, pageCount) {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setStroke(doc, LINE);
    doc.line(MARGIN, 279.5, PAGE_WIDTH - MARGIN, 279.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    setText(doc, MUTED);
    doc.text("PCBVision — Intelligent PCB Inspection", MARGIN, 284);
    doc.setFont("helvetica", "normal");
    doc.text("Automated Optical Inspection • Explainable AI", MARGIN, 287.4);
    doc.text(`Report generated: ${data.generatedDate} ${data.generatedTime}`, MARGIN, 290.8);
    doc.text("This report is generated from the PCBVision automated inspection system.", MARGIN, 294.2);
    doc.setFont("helvetica", "bold");
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, 294.2, { align: "right" });
  }
}

// Builds the full PDF document. Returns a jsPDF instance ready to save.
export function buildInspectionPdf(reportData, { imageDataUrl = null, imageDims = null } = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setLineHeightFactor(1.18);

  drawHeader(doc, reportData);
  let y = drawMetaRow(doc, reportData, 52);
  y = drawExecutiveSummary(doc, reportData, y);
  y = drawInspectionImage(doc, reportData, imageDataUrl, imageDims, y);
  y = drawDetectionTable(doc, reportData, y);
  y = drawDefects(doc, reportData, y);
  y = drawXai(doc, reportData, y);
  drawMetrics(doc, reportData, y);

  drawFooter(doc, reportData, doc.getNumberOfPages());
  return doc;
}

export function pdfToBlob(doc) {
  return doc.output("blob");
}
