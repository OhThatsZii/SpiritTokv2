// Filter helper functions for TikTokFilters component

export const applySmoothFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.filter = 'blur(1px)';
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.6;
  const imageData = ctx.getImageData(x, y, w, h);
  ctx.putImageData(imageData, x, y);
  ctx.restore();
};

export const applyGlowFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 15;
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyRosyFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#ff69b4';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyBrightFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyCuteFilter = (ctx: CanvasRenderingContext2D, face: any) => {
  const { landmarks } = face;
  
  // Add rosy cheeks
  if (landmarks?.leftEye && landmarks?.rightEye) {
    const cheekPositions = [
      { x: landmarks.leftEye.x - 20, y: landmarks.leftEye.y + 15 },
      { x: landmarks.rightEye.x + 20, y: landmarks.rightEye.y + 15 }
    ];
    
    cheekPositions.forEach(pos => {
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 15);
      gradient.addColorStop(0, 'rgba(255,182,193,0.4)');
      gradient.addColorStop(1, 'rgba(255,182,193,0)');
      
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    });
  }
};

export const applyDollFilter = (ctx: CanvasRenderingContext2D, face: any) => {
  applySmoothFilter(ctx, face.x, face.y, face.width, face.height);
  applyBrightFilter(ctx, face.x, face.y, face.width, face.height);
  applyCuteFilter(ctx, face);
};

export const applyVintageFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#d2691e';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyNeonFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 10;
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#00ffff';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyCyberpunkFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'hard-light';
  ctx.globalAlpha = 0.4;
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, '#ff00ff');
  gradient.addColorStop(1, '#00ffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyDreamyFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.filter = 'blur(2px)';
  ctx.globalCompositeOperation = 'soft-light';
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#e6e6fa';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};

export const applyGalaxyFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.4;
  const gradient = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, Math.max(w, h)/2);
  gradient.addColorStop(0, '#4b0082');
  gradient.addColorStop(0.5, '#8a2be2');
  gradient.addColorStop(1, '#000080');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
};