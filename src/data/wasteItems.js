import { Recycle, Leaf, Zap, AlertTriangle, Trash2 } from 'lucide-react';

export const categories = [
    { id: 'recyclable', label: 'Recyclable', icon: Recycle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { id: 'organic', label: 'Organic', icon: Leaf, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { id: 'ewaste', label: 'E-Waste', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { id: 'hazardous', label: 'Hazardous', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'general', label: 'General Waste', icon: Trash2, color: 'text-zinc-400', bg: 'bg-zinc-400/10', border: 'border-zinc-400/20' },
];

export const wasteItems = [
    // Recyclable
    { name: 'Plastic Bottle', category: 'recyclable', instruction: 'Rinse and crush. Keep cap on.' },
    { name: 'Newspaper', category: 'recyclable', instruction: 'Keep dry and clean. Bundle together.' },
    { name: 'Cardboard Box', category: 'recyclable', instruction: 'Flatten completely. Remove tape.' },
    { name: 'Glass Jar', category: 'recyclable', instruction: 'Rinse thoroughly. Remove lid.' },
    { name: 'Aluminum Can', category: 'recyclable', instruction: 'Rinse and crush if possible.' },

    // Organic
    { name: 'Banana Peel', category: 'organic', instruction: 'Compostable. Do not wrap in plastic.' },
    { name: 'Leftover Food', category: 'organic', instruction: 'Drain excess liquid. Compost bin.' },
    { name: 'Garden Trimmings', category: 'organic', instruction: 'Chop smaller branches. Compost.' },
    { name: 'Coffee Grounds', category: 'organic', instruction: 'Great for compost. No filters.' },

    // E-Waste
    { name: 'Old Phone', category: 'ewaste', instruction: 'Remove SIM/SD card. Drop at e-waste center.' },
    { name: 'Batteries', category: 'ewaste', instruction: 'Tape terminals. Do not bin. Special drop-off.' },
    { name: 'Laptop', category: 'ewaste', instruction: 'Wipe data. E-waste collection only.' },
    { name: 'Cables', category: 'ewaste', instruction: 'Bundle neatly. E-waste bin.' },

    // Hazardous
    { name: 'Paint Can', category: 'hazardous', instruction: 'Dry out if empty. Hazardous collection.' },
    { name: 'Light Bulb', category: 'hazardous', instruction: 'Wrap in paper. Do not break. Special bin.' },
    { name: 'Medical Waste', category: 'hazardous', instruction: 'Sealed container. Medical disposal only.' },
    { name: 'Cleaning Chemicals', category: 'hazardous', instruction: 'Keep in original bottle. Hazardous site.' },

    // General
    { name: 'Diapers', category: 'general', instruction: 'Wrap tightly. General waste bin.' },
    { name: 'Styrofoam', category: 'general', instruction: 'Not recyclable. General waste.' },
    { name: 'Chip Bags', category: 'general', instruction: 'Multi-layer plastic. General waste.' },
    { name: 'Broken Ceramics', category: 'general', instruction: 'Wrap in paper. General waste.' },
];
