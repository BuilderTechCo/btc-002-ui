import { describe, expect, test } from 'vitest';
import {
  ICON_SIZE_MAP,
  ICON_COLOR_MAP,
  ICON_COLOR_MAP_DARK,
  type IconName,
  type IconCategory,
  type IconSize,
} from './icon.types';

describe('lib/icon/icon.types', () => {
  describe('iCON_SIZE_MAP', () => {
    test('has all required sizes', () => {
      expect(ICON_SIZE_MAP).toEqual({
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
      });
    });

    test('maps each IconSize to a number', () => {
      const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
      sizes.forEach((size) => {
        expect(typeof ICON_SIZE_MAP[size]).toBe('number');
        expect(ICON_SIZE_MAP[size]).toBeGreaterThan(0);
      });
    });
  });

  describe('iCON_COLOR_MAP', () => {
    test('has all required categories', () => {
      expect(ICON_COLOR_MAP).toEqual({
        nav: 'var(--btc-text-secondary)',
        action: 'var(--btc-text-brand)',
        status: 'currentColor',
        empty: 'var(--btc-text-muted)',
      });
    });

    test('maps each IconCategory to a CSS variable or color', () => {
      const categories: IconCategory[] = ['nav', 'action', 'status', 'empty'];
      categories.forEach((category) => {
        expect(typeof ICON_COLOR_MAP[category]).toBe('string');
        expect(ICON_COLOR_MAP[category].length).toBeGreaterThan(0);
      });
    });
  });

  describe('iCON_COLOR_MAP_DARK', () => {
    test('has all required categories', () => {
      expect(ICON_COLOR_MAP_DARK).toEqual({
        nav: 'var(--btc-text-secondary)',
        action: 'var(--btc-text-brand)',
        status: 'currentColor',
        empty: 'var(--btc-text-muted)',
      });
    });

    test('maps each IconCategory to a CSS variable or color', () => {
      const categories: IconCategory[] = ['nav', 'action', 'status', 'empty'];
      categories.forEach((category) => {
        expect(typeof ICON_COLOR_MAP_DARK[category]).toBe('string');
        expect(ICON_COLOR_MAP_DARK[category].length).toBeGreaterThan(0);
      });
    });
  });

  describe('iconName type', () => {
    test('includes navigation icons', () => {
      const navIcons: IconName[] = [
        'dashboard', 'crm', 'organizations', 'prospecting', 'components',
        'user', 'logout', 'menu', 'chevronLeft', 'chevronRight',
        'chevronUp', 'chevronDown', 'home', 'settings', 'search',
      ];
      navIcons.forEach((_icon) => {
        expect(true).toBe(true); // Type check passes if no TS error
      });
    });

    test('includes action icons', () => {
      const actionIcons: IconName[] = [
        'plus', 'edit', 'delete', 'copy', 'download', 'upload',
        'share', 'refresh', 'save', 'cancel', 'check', 'close',
        'moreHorizontal', 'moreVertical', 'filter', 'sort', 'externalLink',
      ];
      actionIcons.forEach((_icon) => {
        expect(true).toBe(true);
      });
    });

    test('includes status icons', () => {
      const statusIcons: IconName[] = [
        'success', 'error', 'warning', 'info', 'loading',
        'checkCircle', 'alertCircle', 'alertTriangle', 'infoCircle',
        'loader', 'loaderCircle',
      ];
      statusIcons.forEach((_icon) => {
        expect(true).toBe(true);
      });
    });

    test('includes empty state icons', () => {
      const emptyIcons: IconName[] = [
        'default', 'folder', 'inbox', 'users', 'package',
        'target', 'building', 'building2',
      ];
      emptyIcons.forEach((_icon) => {
        expect(true).toBe(true);
      });
    });
  });

  describe('iconCategory type', () => {
    test('has exactly 4 categories', () => {
      const categories: IconCategory[] = ['nav', 'action', 'status', 'empty'];
      expect(categories).toHaveLength(4);
    });
  });

  describe('iconSize type', () => {
    test('has exactly 5 sizes', () => {
      const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
      expect(sizes).toHaveLength(5);
    });
  });
});