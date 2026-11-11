import { describe, expect, vi, test } from 'vitest';
import type { IconSize } from './icon.types';
import { resolveIcon, getSizePx } from './icon';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  LayoutDashboard: 'LayoutDashboard',
  Database: 'Database',
  Building2: 'Building2',
  Target: 'Target',
  Box: 'Box',
  User: 'User',
  LogOut: 'LogOut',
  Menu: 'Menu',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  ChevronUp: 'ChevronUp',
  ChevronDown: 'ChevronDown',
  Home: 'Home',
  Settings: 'Settings',
  Search: 'Search',
  Plus: 'Plus',
  Edit: 'Edit',
  Trash2: 'Trash2',
  Copy: 'Copy',
  Download: 'Download',
  Upload: 'Upload',
  Share2: 'Share2',
  RefreshCw: 'RefreshCw',
  Save: 'Save',
  X: 'X',
  Check: 'Check',
  MoreHorizontal: 'MoreHorizontal',
  MoreVertical: 'MoreVertical',
  Filter: 'Filter',
  ArrowUpDown: 'ArrowUpDown',
  ExternalLink: 'ExternalLink',
  CheckCircle2: 'CheckCircle2',
  XCircle: 'XCircle',
  AlertTriangle: 'AlertTriangle',
  Info: 'Info',
  Loader2: 'Loader2',
  AlertCircle: 'AlertCircle',
  Package: 'Package',
  FolderOpen: 'FolderOpen',
  Inbox: 'Inbox',
  Users: 'Users',
  Building: 'Building',
  Sun: 'Sun',
  Moon: 'Moon',
  Monitor: 'Monitor',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Wrench: 'Wrench',
  WifiOff: 'WifiOff',
  Bell: 'Bell',
  CreditCard: 'CreditCard',
  File: 'File',
  SearchX: 'SearchX',
  Nonexistent: undefined,
}));

describe('lib/icon/icon (component logic)', () => {
  describe('resolveIcon', () => {
    test('resolves nav icons correctly', () => {
      expect(resolveIcon('dashboard', 'nav')).toBe('LayoutDashboard');
      expect(resolveIcon('crm', 'nav')).toBe('Database');
      expect(resolveIcon('user', 'nav')).toBe('User');
      expect(resolveIcon('search', 'nav')).toBe('Search');
    });

    test('resolves action icons correctly', () => {
      expect(resolveIcon('plus', 'action')).toBe('Plus');
      expect(resolveIcon('edit', 'action')).toBe('Edit');
      expect(resolveIcon('delete', 'action')).toBe('Trash2');
      expect(resolveIcon('copy', 'action')).toBe('Copy');
    });

    test('resolves status icons correctly', () => {
      expect(resolveIcon('success', 'status')).toBe('CheckCircle2');
      expect(resolveIcon('error', 'status')).toBe('XCircle');
      expect(resolveIcon('warning', 'status')).toBe('AlertTriangle');
      expect(resolveIcon('loading', 'status')).toBe('Loader2');
    });

    test('resolves empty state icons correctly', () => {
      expect(resolveIcon('default', 'empty')).toBe('Package');
      expect(resolveIcon('folder', 'empty')).toBe('FolderOpen');
      expect(resolveIcon('users', 'empty')).toBe('Users');
    });

    test('defaults to nav category when not specified', () => {
      expect(resolveIcon('dashboard')).toBe('LayoutDashboard');
      expect(resolveIcon('user')).toBe('User');
    });

    test('returns null for unknown icon', () => {
      expect(resolveIcon('nonexistent' as never, 'nav')).toBeNull();
      // Una categoría inválida cae al fallback por nombre del icono
      expect(resolveIcon('dashboard', 'invalid' as never)).toBe('LayoutDashboard');
    });

    test('resuelve el mismo icono aunque la categoría no coincida', () => {
      // Fallback por nombre: 'dashboard' existe en nav y se reutiliza
      expect(resolveIcon('dashboard', 'action')).toBe('LayoutDashboard');
      expect(resolveIcon('plus', 'status')).toBe('Plus');
    });
  });

  describe('getSizePx', () => {
    test('returns correct pixel values for each size', () => {
      expect(getSizePx('xs')).toBe(12);
      expect(getSizePx('sm')).toBe(16);
      expect(getSizePx('md')).toBe(20);
      expect(getSizePx('lg')).toBe(24);
      expect(getSizePx('xl')).toBe(32);
    });

    test('defaults to md when size not specified', () => {
      expect(getSizePx(undefined as unknown as IconSize)).toBe(20);
      expect(getSizePx(null as unknown as IconSize)).toBe(20);
    });

    test('defaults to md for invalid size', () => {
      expect(getSizePx('invalid' as unknown as IconSize)).toBe(20);
    });
  });
});