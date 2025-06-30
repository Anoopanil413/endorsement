import { PDFDocument, rgb, degrees } from 'pdf-lib';

export interface EndorsementOptions {
  signatureDataUrl: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  page?: number;
  rotation?: number;
}

export const endorsePDF = async (
  file: File,
  options: EndorsementOptions,
  selectedPages?: number[]
): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const signatureImageBytes = await fetch(options.signatureDataUrl).then(res => res.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  
  const pages = pdfDoc.getPages();
  const targetPages = selectedPages || [0];
  
  targetPages.forEach(pageIndex => {
    if (pageIndex < pages.length) {
      const page = pages[pageIndex];
      const { width, height } = page.getSize();
      
      page.drawImage(signatureImage, {
        x: options.position.x,
        y: height - options.position.y - options.size.height,
        width: options.size.width,
        height: options.size.height,
        rotate: degrees(options.rotation || 0),
      });
    }
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const endorseImage = async (
  file: File,
  options: EndorsementOptions
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const signatureImg = new Image();
      signatureImg.onload = () => {
        ctx.drawImage(
          signatureImg,
          options.position.x,
          options.position.y,
          options.size.width,
          options.size.height
        );
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, file.type);
      };
      
      signatureImg.src = options.signatureDataUrl;
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const generateDemoSignature = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 80;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#0369A1';
  ctx.font = '24px cursive';
  ctx.fillText('Demo Signature', 10, 40);
  
  return canvas.toDataURL();
};

export const generateDemoStamp = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;
  
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(60, 60, 50, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.fillStyle = '#F97316';
  ctx.font = '12px bold sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DEMO', 60, 50);
  ctx.fillText('STAMP', 60, 70);
  
  return canvas.toDataURL();
};