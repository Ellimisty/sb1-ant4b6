import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit2, ChevronLeft, ChevronRight, Tag, Link } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Fuse from 'fuse.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { ForceGraph2D } from 'react-force-graph';

// ... rest of the Codex component code ...