const express = require('express');
const router = express.Router();
const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, ShadingType, BorderStyle, HeadingLevel,
  Table, TableRow, TableCell, WidthType, TableBorders,
} = require('docx');

const COLORS = {
  navy: '1C2D3E',
  blue: '1C3557',
  grayBg: 'F4F6F7',
  white: 'FFFFFF',
  linkedinBg: 'D6EAF8', linkedinFg: '1A5276',
  emailBg: 'D5F5E3', emailFg: '145A32',
  llamadaBg: 'FEF9E7', llamadaFg: '7D6608',
};

function channelColor(channel) {
  if (channel === 'LinkedIn') return { bg: COLORS.linkedinBg, fg: COLORS.linkedinFg };
  if (channel === 'Email') return { bg: COLORS.emailBg, fg: COLORS.emailFg };
  return { bg: COLORS.llamadaBg, fg: COLORS.llamadaFg };
}

router.post('/', async (req, res) => {
  const { clientName, roles, sector, geo, channels, tone, duration, steps, branches } = req.body;

  const children = [];

  // Apollo best practices note
  children.push(new Paragraph({
    spacing: { after: 300 },
    shading: { type: ShadingType.CLEAR, fill: COLORS.grayBg },
    children: [
      new TextRun({ text: 'Buenas prácticas Apollo aplicadas: ', bold: true, size: 22, font: 'Calibri' }),
      new TextRun({ text: 'asuntos 3–5 palabras · emails máx. 7 líneas · sin presentación corporativa · una pregunta al final · primer LinkedIn = solo conexión · último paso = break-up email', size: 22, font: 'Calibri' }),
    ],
  }));

  // Group steps into blocks
  const n = steps.length;
  const c1 = n <= 5 ? 2 : 3;
  const c2 = n <= 5 ? 4 : n <= 7 ? 6 : 7;
  const blocks = [
    { label: 'Bloque 1 — Primer contacto', items: steps.slice(0, c1) },
    { label: 'Bloque 2 — Seguimiento', items: steps.slice(c1, c2) },
    { label: 'Bloque 3 — Cierre', items: steps.slice(c2) },
  ];

  for (const block of blocks) {
    if (!block.items.length) continue;

    // Block header
    children.push(new Paragraph({
      spacing: { before: 400, after: 200 },
      shading: { type: ShadingType.CLEAR, fill: COLORS.navy },
      children: [
        new TextRun({ text: block.label.toUpperCase(), bold: true, color: COLORS.white, size: 22, font: 'Calibri' }),
      ],
    }));

    for (const step of block.items) {
      const cc = channelColor(step.channel);

      // Day + Channel + Title
      children.push(new Paragraph({
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({ text: step.day + '  ', bold: true, size: 20, color: '6B7280', font: 'Calibri' }),
          new TextRun({ text: ` ${step.channel} `, bold: true, size: 20, color: cc.fg, shading: { type: ShadingType.CLEAR, fill: cc.bg }, font: 'Calibri' }),
          new TextRun({ text: '  ' + step.title, bold: true, size: 24, color: COLORS.blue, font: 'Calibri' }),
        ],
      }));

      // Subject (email only)
      if (step.subject) {
        children.push(new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({ text: 'ASUNTO: ', bold: true, size: 20, color: '6B7280', font: 'Calibri' }),
            new TextRun({ text: step.subject, size: 20, font: 'Calibri' }),
          ],
        }));
      }

      // Body in gray box
      const bodyLines = (step.body || '').split(/\\n|\n/);
      children.push(new Paragraph({
        spacing: { after: 100 },
        shading: { type: ShadingType.CLEAR, fill: COLORS.grayBg },
        children: bodyLines.flatMap((line, i) => {
          const runs = [new TextRun({ text: line, size: 22, font: 'Calibri' })];
          if (i < bodyLines.length - 1) runs.push(new TextRun({ break: 1 }));
          return runs;
        }),
      }));

      // Objective
      children.push(new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: 'Objetivo: ', bold: true, size: 20, color: '6B7280', font: 'Calibri', italics: true }),
          new TextRun({ text: step.objetivo || '', size: 20, color: '6B7280', font: 'Calibri', italics: true }),
        ],
      }));
    }
  }

  // Branching logic header
  children.push(new Paragraph({
    spacing: { before: 400, after: 200 },
    shading: { type: ShadingType.CLEAR, fill: COLORS.navy },
    children: [
      new TextRun({ text: 'LÓGICA DE RAMIFICACIÓN', bold: true, color: COLORS.white, size: 22, font: 'Calibri' }),
    ],
  }));

  for (const b of (branches || [])) {
    children.push(new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: b.cond + ' → ', bold: true, size: 22, color: COLORS.navy, font: 'Calibri' }),
        new TextRun({ text: b.action, size: 22, font: 'Calibri' }),
      ],
    }));
  }

  const doc = new Document({
    sections: [{
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: 'Humanfunnel', bold: true, size: 20, font: 'Calibri', color: COLORS.navy }),
              new TextRun({ text: `\t\t${clientName} · ${(roles || []).join(', ')} · ${geo}`, size: 18, font: 'Calibri', color: '6B7280' }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Humanfunnel · humanfunnel.es', size: 18, font: 'Calibri', color: '9CA3AF' })],
          })],
        }),
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': `attachment; filename="secuencia-${(clientName || 'export').replace(/\s+/g, '-').toLowerCase()}.docx"`,
  });
  res.send(buffer);
});

module.exports = router;
