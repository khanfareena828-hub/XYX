import * as THREE from 'three';

/**
 * Generates an ultra-high-resolution dial texture with guilloché engraving,
 * railroad minute track, applied indices, and sub-dial snailed textures.
 */
export function createDialTexture(
  dialColorHex: string,
  isDark = true,
  accentColorHex = '#E5C384'
): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const dummy = new THREE.CanvasTexture(canvas);
    return dummy;
  }

  const center = size / 2;
  const radius = size * 0.46;

  // 1. Base Dial Background & Sunburst Gradient
  const grad = ctx.createRadialGradient(center, center, radius * 0.05, center, center, radius);
  grad.addColorStop(0, dialColorHex);
  // Slightly darker towards perimeter for luxury vignette
  grad.addColorStop(0.85, dialColorHex);
  grad.addColorStop(1, '#000000');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Guilloché concentric rings / radial rays
  ctx.save();
  ctx.translate(center, center);
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
  ctx.lineWidth = 1.5;

  for (let r = 80; r < radius * 0.95; r += 8) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial guilloché rays
  const rayCount = 120;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * Math.PI * 2) / rayCount;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 70, Math.sin(angle) * 70);
    ctx.lineTo(Math.cos(angle) * (radius * 0.94), Math.sin(angle) * (radius * 0.94));
    ctx.stroke();
  }
  ctx.restore();

  // 3. Sub-dials (3 o'clock and 9 o'clock)
  const subRadius = size * 0.11;
  const subDialOffset = size * 0.22;

  const drawSubdial = (cx: number, cy: number, title: string) => {
    ctx.save();
    // Subdial background
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy, subRadius, 0, Math.PI * 2);
    ctx.fill();

    // Snailing / Azurage circular grooves
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1.2;
    for (let r = 12; r < subRadius; r += 6) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = accentColorHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, subRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Subdial tick marks
    for (let s = 0; s < 12; s++) {
      const angle = (s * Math.PI * 2) / 12 - Math.PI / 2;
      const x1 = cx + Math.cos(angle) * (subRadius - 8);
      const y1 = cy + Math.sin(angle) * (subRadius - 8);
      const x2 = cx + Math.cos(angle) * (subRadius - 2);
      const y2 = cy + Math.sin(angle) * (subRadius - 2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Subdial text
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = accentColorHex;
    ctx.textAlign = 'center';
    ctx.fillText(title, cx, cy + subRadius * 0.55);
    ctx.restore();
  };

  drawSubdial(center + subDialOffset, center, '30 MIN');
  drawSubdial(center - subDialOffset, center, '72 HRS');

  // 4. Periphery Railroad Minute Track
  ctx.save();
  ctx.translate(center, center);
  ctx.strokeStyle = accentColorHex;
  ctx.fillStyle = accentColorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const innerTrack = radius * 0.88;
  const outerTrack = radius * 0.94;

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, innerTrack, 0, Math.PI * 2);
  ctx.arc(0, 0, outerTrack, 0, Math.PI * 2);
  ctx.stroke();

  // 60 minute ticks
  for (let m = 0; m < 60; m++) {
    const angle = (m * Math.PI * 2) / 60 - Math.PI / 2;
    const isHour = m % 5 === 0;
    const len = isHour ? 28 : 14;
    const x1 = Math.cos(angle) * (outerTrack - 2);
    const y1 = Math.sin(angle) * (outerTrack - 2);
    const x2 = Math.cos(angle) * (outerTrack - len);
    const y2 = Math.sin(angle) * (outerTrack - len);

    ctx.lineWidth = isHour ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (isHour) {
      // Numbers: 05, 10, ... 60
      const num = m === 0 ? '60' : m < 10 ? `0${m}` : `${m}`;
      const numX = Math.cos(angle) * (innerTrack - 35);
      const numY = Math.sin(angle) * (innerTrack - 35);
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(num, numX, numY);
    }
  }

  // 5. Brand typography at 12 o'clock
  ctx.textAlign = 'center';
  ctx.font = '600 58px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('A U R A', 0, -radius * 0.52);

  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('HAUTE HORLOGERIE', 0, -radius * 0.44);

  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('CHRONOMÈTRE TOURBILLON', 0, -radius * 0.38);

  // Bottom Swiss Made
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('SWISS  MADE', 0, radius * 0.84);

  // 6. Tourbillon Aperture ring at 6 o'clock (transparent circle)
  const tourbillonY = radius * 0.42;
  const tourbillonRadius = radius * 0.32;

  // Clear aperture hole so the 3D escapement underneath is visible
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, tourbillonY, tourbillonRadius, 0, Math.PI * 2);
  ctx.fill();

  // Reset comp operation to draw gold aperture rim
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = accentColorHex;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, tourbillonY, tourbillonRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle engraved bezel ring around tourbillon aperture
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, tourbillonY, tourbillonRadius + 4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an engraved tachymeter bezel scale
 */
export function createBezelTexture(bezelColorHex: string, accentColorHex = '#E5C384'): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const center = size / 2;
  const radius = size * 0.48;
  const innerRadius = size * 0.38;

  // Bezel background ring
  ctx.fillStyle = bezelColorHex;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.arc(center, center, innerRadius, Math.PI * 2, 0, true);
  ctx.fill();

  // Concentric separator rings
  ctx.strokeStyle = accentColorHex;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center, center, radius - 2, 0, Math.PI * 2);
  ctx.arc(center, center, innerRadius + 2, 0, Math.PI * 2);
  ctx.stroke();

  // Tachymeter scale numbers
  const speeds = [
    { text: 'TACHYMÈTRE', deg: -90, isTitle: true },
    { text: '500', deg: -70 },
    { text: '400', deg: -55 },
    { text: '300', deg: -35 },
    { text: '240', deg: -15 },
    { text: '200', deg: 10 },
    { text: '180', deg: 30 },
    { text: '160', deg: 55 },
    { text: '140', deg: 80 },
    { text: '120', deg: 110 },
    { text: '100', deg: 145 },
    { text: '90', deg: 175 },
    { text: '80', deg: 210 },
    { text: '70', deg: 245 },
    { text: '60', deg: 265 },
  ];

  ctx.save();
  ctx.translate(center, center);
  ctx.fillStyle = accentColorHex;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  speeds.forEach((item) => {
    const rad = (item.deg * Math.PI) / 180;
    const r = (radius + innerRadius) / 2;
    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rad + Math.PI / 2);
    ctx.font = item.isTitle
      ? '700 16px "Plus Jakarta Sans", sans-serif'
      : '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(item.text, 0, 0);
    ctx.restore();
  });

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates movement bridge with Geneva stripes (Côtes de Genève)
 */
export function createMovementTexture(accentGold = '#E5C384'): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base rhodium silver
  ctx.fillStyle = '#C2C6CC';
  ctx.fillRect(0, 0, size, size);

  // Côtes de Genève vertical bands
  const bandWidth = 40;
  for (let x = 0; x < size; x += bandWidth) {
    const isOdd = Math.floor(x / bandWidth) % 2 === 0;
    const grad = ctx.createLinearGradient(x, 0, x + bandWidth, 0);
    if (isOdd) {
      grad.addColorStop(0, '#B8BCC2');
      grad.addColorStop(0.5, '#E2E6EC');
      grad.addColorStop(1, '#B8BCC2');
    } else {
      grad.addColorStop(0, '#989CA2');
      grad.addColorStop(0.5, '#C2C6CC');
      grad.addColorStop(1, '#989CA2');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, bandWidth, size);
  }

  // Circular perlage around center
  const center = size / 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let r = 80; r < size * 0.45; r += 40) {
    const count = Math.floor((r * 2 * Math.PI) / 35);
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count;
      const px = center + Math.cos(a) * r;
      const py = center + Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Gold engraved caliber insignia
  ctx.save();
  ctx.translate(center, center);
  ctx.fillStyle = accentGold;
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AURA CALIBRE 9820-T', 0, -size * 0.2);
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('33 JEWELS • FIVE (5) POSITIONS ADJUSTED • SWISS', 0, -size * 0.14);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
