import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EndorsedDocument, dbManager } from '@/lib/indexedDB';

interface DocumentsState {
  documents: EndorsedDocument[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterType: 'all' | 'pdf' | 'image';
  sortBy: 'timestamp' | 'fileName';
  sortOrder: 'asc' | 'desc';
}

const initialState: DocumentsState = {
  documents: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  filterType: 'all',
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

export const loadDocuments = createAsyncThunk(
  'documents/loadDocuments',
  async () => {
    const documents = await dbManager.getDocuments();
    return documents;
  }
);

export const saveDocument = createAsyncThunk(
  'documents/saveDocument',
  async (document: EndorsedDocument) => {
    await dbManager.saveDocument(document);
    return document;
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async (document: EndorsedDocument) => {
    await dbManager.updateDocument(document);
    return document;
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id: string) => {
    await dbManager.deleteDocument(id);
    return id;
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterType: (state, action: PayloadAction<'all' | 'pdf' | 'image'>) => {
      state.filterType = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'timestamp' | 'fileName'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(loadDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load documents';
      })
      .addCase(saveDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
      });
  }
});

export const { setSearchTerm, setFilterType, setSortBy, setSortOrder, clearError } = documentsSlice.actions;
export default documentsSlice.reducer;