import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Camera, Upload, Scan, Trash2, Leaf, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User } from '../App';
import UploadProof from './UploadProof';
import rosyLogo from 'figma:asset/Rosy.png';

interface ScannerProps {
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

interface ScanResult {
  type: 'organic' | 'non-organic';
  confidence: number;
  item: string;
  guidance: string;
}

export default function Scanner({ user, updateUser }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showUploadProof, setShowUploadProof] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setSelectedFile(file);
        performScan(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const wasteItems = [
        { type: 'organic' as const, item: 'Sisa Sayuran', guidance: 'Bisa dijadikan kompos! Kumpulkan dalam wadah terpisah dan proses menjadi pupuk organik. 🌱' },
        { type: 'organic' as const, item: 'Kulit Buah', guidance: 'Sampah organik ini sempurna untuk kompos. Potong kecil-kecil agar lebih cepat terurai. 🍎' },
        { type: 'non-organic' as const, item: 'Botol Plastik', guidance: 'Cuci dan keringkan botol, lalu setor ke Bank Sampah. Botol plastik dapat didaur ulang! ♻️' },
        { type: 'non-organic' as const, item: 'Kardus', guidance: 'Ratakan kardus dan ikat dengan rapi. Kardus bernilai ekonomis di Bank Sampah! 📦' },
        { type: 'non-organic' as const, item: 'Kaleng Bekas', guidance: 'Cuci bersih dan penyokkan. Aluminium sangat bernilai untuk didaur ulang! 🥫' },
        { type: 'organic' as const, item: 'Daun Kering', guidance: 'Material kompos yang bagus! Campurkan dengan sampah organik basah untuk hasil optimal. 🍂' },
      ];

      const result = wasteItems[Math.floor(Math.random() * wasteItems.length)];
      setScanResult({
        ...result,
        confidence: 85 + Math.random() * 15,
      });
      setIsScanning(false);
      toast.success('Scan successful!');
    }, 2000);
  };

  const performScan = async (file: File) => {
    setIsScanning(true);
    try {
      const fd = new FormData();
      fd.append('image', file);

      const resp = await fetch('http://localhost:4000/api/scan', {
        method: 'POST',
        body: fd,
      });

      if (!resp.ok) {
        simulateScan();
        return;
      }

      const data = await resp.json();
      // server returns { type, item, guidance, confidence, isReceipt }
      const out: ScanResult = {
        type: (data.type === 'organic' ? 'organic' : 'non-organic') as any,
        item: data.item || (data.isReceipt ? 'Bank transaction / receipt' : 'Unknown item'),
        guidance: data.guidance || (data.isReceipt ? 'This looks like a receipt. You can upload it as proof.' : 'No guidance available.'),
        confidence: data.confidence || 80,
      };

      setScanResult(out);
      setIsScanning(false);
      toast.success('Scan completed');
    } catch (err) {
      console.error('scan error', err);
      // fallback
      simulateScan();
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setPreviewImage(null);
  };

  const handleProofUploaded = () => {
    setShowUploadProof(false);
    toast.success('Proof uploaded successfully! +50 points');
    updateUser({
      points: user.points + 50,
      deposits: user.deposits + 1,
    });
  };

  return (
    <div className="min-h-screen p-4 pt-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header with Logo */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3">
          <img src={rosyLogo} alt="Rosy" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-emerald-600 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Rosy Scan
        </h1>
        <p className="text-gray-600">Scan your waste and identify its type!</p>
      </div>

      {/* Scanner Card */}
      <Card className="max-w-md mx-auto p-6 rounded-3xl shadow-xl">
        {!previewImage && !scanResult && (
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <Scan className="w-20 h-20 text-emerald-500 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Take a photo of the waste to scan</p>
              </div>
            </div>
            
            <Button
              onClick={handleCameraClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-lg"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Waste Photo
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-gray-500">or</span>
              </div>
            </div>

            <Button
              onClick={() => setShowUploadProof(true)}
              variant="outline"
              className="w-full rounded-2xl border-2 border-emerald-300 hover:bg-emerald-50"
              size="lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Proof
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
              {previewImage && (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing with AI...</p>
            </div>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="space-y-4">
            {previewImage && (
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                <img src={previewImage} alt="Scanned waste" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Result */}
            <div className={`p-5 rounded-3xl ${
              scanResult.type === 'organic' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400' 
                : 'bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-400'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {scanResult.type === 'organic' ? (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <p className={scanResult.type === 'organic' ? 'text-green-700' : 'text-blue-700'}>
                    {scanResult.type === 'organic' ? '🌿 Organic waste' : '♻️ Non-organic waste'}
                  </p>
                  <p className={scanResult.type === 'organic' ? 'text-green-900' : 'text-blue-900'}>
                    {scanResult.item}
                  </p>
                </div>
              </div>
              <div className="bg-white/70 p-4 rounded-2xl">
                <p className="text-gray-600 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{scanResult.guidance}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleNewScan}
                variant="outline"
                className="flex-1 rounded-2xl border-2"
              >
                Scan Again
              </Button>
              <Button
                onClick={() => setShowUploadProof(true)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Proof
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Info Cards */}
      <div className="max-w-md mx-auto mt-6 grid grid-cols-2 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-3xl shadow-lg">
          <p className="text-white/90 mb-1"> Total Points</p>
          <p className="text-white">{user.points}</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl shadow-lg">
          <p className="text-white/90 mb-1"> Total Deposits</p>
          <p className="text-white">{user.deposits}</p>
        </Card>
      </div>

      {/* Upload Proof Dialog */}
      <Dialog open={showUploadProof} onOpenChange={setShowUploadProof}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
                Upload Proof
            </DialogTitle>
          </DialogHeader>
          <UploadProof onUploadSuccess={handleProofUploaded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}