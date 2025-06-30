import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EndorsementItem {
  id: string;
  type: 'signature' | 'stamp' | 'text' | 'date' | 'initials';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  page: number;
  content?: string;
  isPremium?: boolean;
}

interface EndorsementState {
  selectedFile: File | null;
  previewUrl: string | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  endorsements: EndorsementItem[];
  selectedEndorsement: string | null;
  endorsementType: 'signature' | 'stamp' | 'text' | 'date' | 'initials';
  remarks: string;
  isProcessing: boolean;
  canvasSize: { width: number; height: number };
}

const initialState: EndorsementState = {
  selectedFile: null,
  previewUrl: null,
  currentPage: 0,
  totalPages: 0,
  zoom: 1,
  endorsements: [],
  selectedEndorsement: null,
  endorsementType: 'signature',
  remarks: '',
  isProcessing: false,
  canvasSize: { width: 800, height: 600 }
};

const endorsementSlice = createSlice({
  name: 'endorsement',
  initialState,
  reducers: {
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
      if (action.payload) {
        state.previewUrl = URL.createObjectURL(action.payload);
        state.totalPages = action.payload.type === 'application/pdf' ? 5 : 1; // Demo value
      } else {
        state.previewUrl = null;
        state.totalPages = 0;
      }
      state.endorsements = [];
      state.currentPage = 0;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.5, Math.min(3, action.payload));
    },
    setEndorsementType: (state, action: PayloadAction<'signature' | 'stamp' | 'text' | 'date' | 'initials'>) => {
      state.endorsementType = action.payload;
    },
    addEndorsement: (state, action: PayloadAction<Omit<EndorsementItem, 'id'>>) => {
      const endorsement: EndorsementItem = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      state.endorsements.push(endorsement);
      state.selectedEndorsement = endorsement.id;
    },
    updateEndorsement: (state, action: PayloadAction<{ id: string; updates: Partial<EndorsementItem> }>) => {
      const index = state.endorsements.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.endorsements[index] = { ...state.endorsements[index], ...action.payload.updates };
      }
    },
    removeEndorsement: (state, action: PayloadAction<string>) => {
      state.endorsements = state.endorsements.filter(e => e.id !== action.payload);
      if (state.selectedEndorsement === action.payload) {
        state.selectedEndorsement = null;
      }
    },
    setSelectedEndorsement: (state, action: PayloadAction<string | null>) => {
      state.selectedEndorsement = action.payload;
    },
    setRemarks: (state, action: PayloadAction<string>) => {
      state.remarks = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.canvasSize = action.payload;
    },
    clearEndorsement: (state) => {
      state.selectedFile = null;
      state.previewUrl = null;
      state.currentPage = 0;
      state.totalPages = 0;
      state.endorsements = [];
      state.selectedEndorsement = null;
      state.remarks = '';
      state.zoom = 1;
    }
  }
});

export const {
  setSelectedFile,
  setCurrentPage,
  setZoom,
  setEndorsementType,
  addEndorsement,
  updateEndorsement,
  removeEndorsement,
  setSelectedEndorsement,
  setRemarks,
  setIsProcessing,
  setCanvasSize,
  clearEndorsement
} = endorsementSlice.actions;

export default endorsementSlice.reducer;