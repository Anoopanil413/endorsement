export const shareFile = async (file: Blob, fileName: string): Promise<void> => {
  if (navigator.share && navigator.canShare) {
    const fileToShare = new File([file], fileName, { type: file.type });
    
    if (navigator.canShare({ files: [fileToShare] })) {
      try {
        await navigator.share({
          title: 'Endorsed Document',
          text: 'Sharing endorsed document from Maritime Endorser',
          files: [fileToShare]
        });
      } catch (error) {
        console.error('Error sharing file:', error);
        fallbackShare(file, fileName);
      }
    } else {
      fallbackShare(file, fileName);
    }
  } else {
    fallbackShare(file, fileName);
  }
};

export const fallbackShare = (file: Blob, fileName: string): void => {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const shareViaBluetooth = async (file: Blob, fileName: string): Promise<void> => {
  if ('bluetooth' in navigator) {
    try {
      // Request Bluetooth device
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      console.log('Bluetooth device selected:', device.name);
      // Note: Actual file transfer would require specific Bluetooth protocols
      // This is a placeholder for Bluetooth sharing functionality
      alert('Bluetooth sharing initiated. Please check your device for file transfer options.');
    } catch (error) {
      console.error('Bluetooth sharing error:', error);
      fallbackShare(file, fileName);
    }
  } else {
    alert('Bluetooth sharing not supported on this device');
    fallbackShare(file, fileName);
  }
};