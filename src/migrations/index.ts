import * as migration_20251015_190208 from './20251015_190208';

export const migrations = [
  {
    up: migration_20251015_190208.up,
    down: migration_20251015_190208.down,
    name: '20251015_190208'
  },
];
