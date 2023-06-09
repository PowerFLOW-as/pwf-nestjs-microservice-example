import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { DEBUG_METADATA } from '../constants/debug.constant';
import type { DebugOptions } from '../models/debug.interface';

export const Debug = (options?: string | DebugOptions): CustomDecorator =>
  SetMetadata(DEBUG_METADATA, { context: options, ...(typeof options === 'object' && options) });
