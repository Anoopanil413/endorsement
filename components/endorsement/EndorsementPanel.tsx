'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image, PenTool, Stamp, Share2, Save } from 'lucide-react';
import { endorsePDF, endorseImage, generateDemoSignature, generateDemoStamp } from '@/lib/endorsement';
import { dbManager, EndorsedDocument } from '@/lib/indexedDB';
import { shareFile } from '@/lib/sharing';
import { toast } from 'sonner';
import WaveBackground from '@/components/ui/wave-background';

export default function EndorsementPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [endorsementType, setEndorsementType] = useState<'signature' | 'stamp'>('signature');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [remarks, setRemarks] = useState('');
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      if (file.type === 'application/pdf') {
        // For demo, assume 5 pages max
        setSelectedPages([0]);
      }
    }
  };

  const handlePageSelection = (pageIndex: number, checked: boolean) => {
    if (checked) {
      setSelectedPages([...selectedPages, pageIndex]);
    } else {
      setSelectedPages(selectedPages.filter(p => p !== pageIndex));
    }
  };

  const handleEndorse = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsProcessing(true);

    try {
      const signatureDataUrl = endorsementType === 'signature' 
        ? generateDemoSignature() 
        : generateDemoStamp();

      const endorsementOptions = {
        signatureDataUrl,
        position: signaturePosition,
        size: { width: 150, height: 75 },
        rotation: 0
      };

      let endorsedFile: Blob;

      if (selectedFile.type === 'application/pdf') {
        endorsedFile = await endorsePDF(selectedFile, endorsementOptions, selectedPages.length > 0 ? selectedPages : [0]);
      } else {
        endorsedFile = await endorseImage(selectedFile, endorsementOptions);
      }

      const document: EndorsedDocument = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileType: selectedFile.type === 'application/pdf' ? 'pdf' : 'image',
        originalFile: selectedFile,
        endorsedFile,
        endorsedPages: selectedPages.length > 0 ? selectedPages : undefined,
        remarks,
        timestamp: Date.now(),
        signatureType: endorsementType,
        signaturePosition
      };

      await dbManager.saveDocument(document);
      
      toast.success('Document endorsed successfully!');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedPages([]);
      setRemarks('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      toast.error('Failed to endorse document');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <WaveBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Document Endorsement</h2>
          <p className="text-slate-600">Upload and endorse your documents with digital signatures and stamps</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-sky-600" />
                <span>Upload Document</span>
              </CardTitle>
              <CardDescription>
                Select a PDF or image file to endorse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-sky-200 rounded-lg p-8 text-center hover:border-sky-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer space-y-2">
                  {selectedFile ? (
                    <div className="space-y-2">
                      {selectedFile.type === 'application/pdf' ? (
                        <FileText className="h-12 w-12 text-red-500 mx-auto" />
                      ) : (
                        <Image className="h-12 w-12 text-green-500 mx-auto" />
                      )}
                      <p className="font-medium text-slate-700">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                      <p className="text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              {selectedFile?.type === 'application/pdf' && (
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">Select Pages to Endorse</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((pageIndex) => (
                      <div key={pageIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`page-${pageIndex}`}
                          checked={selectedPages.includes(pageIndex)}
                          onCheckedChange={(checked) => handlePageSelection(pageIndex, checked as boolean)}
                        />
                        <Label htmlFor={`page-${pageIndex}`} className="text-sm">
                          Page {pageIndex + 1}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endorsement Options */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-orange-600" />
                <span>Endorsement Options</span>
              </CardTitle>
              <CardDescription>
                Configure your signature or stamp placement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endorsement Type</Label>
                <Select value={endorsementType} onValueChange={(value: 'signature' | 'stamp') => setEndorsementType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signature">
                      <div className="flex items-center space-x-2">
                        <PenTool className="h-4 w-4" />
                        <span>Digital Signature</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="stamp">
                      <div className="flex items-center space-x-2">
                        <Stamp className="h-4 w-4" />
                        <span>Official Stamp</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X Position</Label>
                  <Input
                    type="number"
                    value={signaturePosition.x}
                    onChange={(e) => setSignaturePosition({
                      ...signaturePosition,
                      x: parseInt(e.target.value) || 0
                    })}
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position</Label>
                  <Input
                    type="number"
                    value={signaturePosition.y}
                    onChange={(e) => setSignaturePosition({
                      ...signaturePosition,
                      y: parseInt(e.target.value) || 0
                    })}
                    className="bg-white/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Textarea
                  placeholder="Add any remarks or notes about this endorsement..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="bg-white/70 min-h-[80px]"
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleEndorse}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold shadow-lg"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Endorse Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
              <CardDescription>Preview of the selected document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white">
                {selectedFile?.type === 'application/pdf' ? (
                  <div className="p-8 text-center">
                    <FileText className="h-24 w-24 text-red-500 mx-auto mb-4" />
                    <p className="text-slate-600">PDF Preview (File: {selectedFile.name})</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Full preview available after endorsement
                    </p>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="max-w-full h-auto"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}