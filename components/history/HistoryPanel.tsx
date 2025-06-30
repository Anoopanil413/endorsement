'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Image, Calendar, MessageSquare, Share2, Edit3, Trash2, Download, Bluetooth } from 'lucide-react';
import { dbManager, EndorsedDocument } from '@/lib/indexedDB';
import { shareFile, shareViaBluetooth } from '@/lib/sharing';
import { format } from 'date-fns';
import { toast } from 'sonner';
import WaveBackground from '@/components/ui/wave-background';

export default function HistoryPanel() {
  const [documents, setDocuments] = useState<EndorsedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<EndorsedDocument | null>(null);
  const [editingRemarks, setEditingRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await dbManager.getDocuments();
      setDocuments(docs.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRemarks = async (document: EndorsedDocument) => {
    try {
      const updatedDocument = { ...document, remarks: editingRemarks };
      await dbManager.updateDocument(updatedDocument);
      setDocuments(documents.map(doc => 
        doc.id === document.id ? updatedDocument : doc
      ));
      setSelectedDocument(null);
      toast.success('Remarks updated successfully');
    } catch (error) {
      toast.error('Failed to update remarks');
    }
  };

  const handleDelete = async (document: EndorsedDocument) => {
    try {
      await dbManager.deleteDocument(document.id);
      setDocuments(documents.filter(doc => doc.id !== document.id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleShare = async (document: EndorsedDocument) => {
    try {
      await shareFile(document.endorsedFile, `endorsed_${document.fileName}`);
    } catch (error) {
      toast.error('Failed to share document');
    }
  };

  const handleBluetoothShare = async (document: EndorsedDocument) => {
    try {
      await shareViaBluetooth(document.endorsedFile, `endorsed_${document.fileName}`);
    } catch (error) {
      toast.error('Failed to share via Bluetooth');
    }
  };

  const handleDownload = (doc: EndorsedDocument) => {
    const url = URL.createObjectURL(doc.endorsedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endorsed_${doc.fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-slate-600">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <WaveBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Endorsement History</h2>
          <p className="text-slate-600">Manage and share your endorsed documents</p>
        </div>

        {documents.length === 0 ? (
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Documents Yet</h3>
              <p className="text-slate-500">Start by endorsing your first document</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      {document.fileType === 'pdf' ? (
                        <FileText className="h-8 w-8 text-red-500 mt-1" />
                      ) : (
                        <Image className="h-8 w-8 text-green-500 mt-1" />
                      )}
                      <div>
                        <CardTitle className="text-slate-800">{document.fileName}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(document.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                          </span>
                          <Badge variant={document.signatureType === 'signature' ? 'default' : 'secondary'}>
                            {document.signatureType}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(document)}
                        className="text-sky-600 border-sky-200 hover:bg-sky-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare(document)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBluetoothShare(document)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Bluetooth className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDocument(document);
                              setEditingRemarks(document.remarks);
                            }}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Remarks</DialogTitle>
                            <DialogDescription>
                              Update the remarks for {document.fileName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              value={editingRemarks}
                              onChange={(e) => setEditingRemarks(e.target.value)}
                              placeholder="Enter your remarks..."
                              className="min-h-[100px]"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedDocument(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleEditRemarks(document)}
                                className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(document)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {document.remarks && (
                  <CardContent className="pt-0">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Remarks</p>
                          <p className="text-sm text-slate-600 mt-1">{document.remarks}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}