import { Extension } from '@tiptap/core';

/**
 * @description Custom tiptap extensions
 */
export const Steps = Extension.create({
  name: 'Steps',
  // TODO: Figure out how to add steps UI
  onCreate() {
    console.info('hi from the extension');
  },
});
